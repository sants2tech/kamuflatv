/*
 * Biblioteca de identidade de canais para o KamuflaTV.
 *
 * A identidade é resolvida nesta ordem:
 *   1. id do catálogo/stream;
 *   2. nome canônico ou alias exato normalizado;
 *   3. correspondência regional conservadora.
 *
 * Não há fuzzy global nesta biblioteca: um canal regional nunca deve herdar
 * a programação de outra praça apenas porque compartilha a marca da rede.
 */
(function (root) {
  'use strict';

  function normalize(value) {
    return String(value == null ? '' : value)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pt-BR')
      .replace(/\[[^\]]*\]|\([^)]*\)/g, ' ')
      .replace(/\b(?:hd|fhd|uhd|4k|sd|br|brasil)\b/g, ' ')
      .replace(/\+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function compact(value) {
    return normalize(value).replace(/[^a-z0-9]+/g, '');
  }

  function regionTokens(value) {
    const text = normalize(value)
      .replace(/\brecord\s*tv\b|\brecordtv\b/g, 'record')
      .replace(/\binter\s*tv\b|\bintertv\b/g, 'inter')
      .replace(/^tv\s+/, ' ');
    const uf = {
      sp: 'sao paulo', rj: 'rio de janeiro', rs: 'rio grande do sul',
      mg: 'minas gerais', pa: 'para', ba: 'bahia', sc: 'santa catarina',
      pr: 'parana', go: 'goias', df: 'brasilia', am: 'amazonas',
      es: 'espirito santo', ce: 'ceara', pb: 'paraiba', pe: 'pernambuco',
      ma: 'maranhao', pi: 'piaui', rn: 'rio grande do norte'
    };
    return compact(text.split(/\s+/).map(function (word) {
      return uf[word] || word;
    }).join(' '));
  }

  function unique(values) {
    return Array.from(new Set((values || []).map(function (v) {
      return String(v == null ? '' : v).trim();
    }).filter(Boolean)));
  }

  function aliasesOf(record) {
    return unique([record && record.name]
      .concat(record && Array.isArray(record.aliases) ? record.aliases : [])
      .concat(record && Array.isArray(record.display_names) ? record.display_names : [])
      .concat(record && record.xmltv_id ? [record.xmltv_id] : []));
  }

  function build(records) {
    const byId = new Map();
    const byName = new Map();
    const byRegion = new Map();
    (Array.isArray(records) ? records : []).forEach(function (raw) {
      if (!raw || typeof raw !== 'object') return;
      const record = Object.assign({}, raw, {
        id: String(raw.id == null ? '' : raw.id),
        aliases: aliasesOf(raw)
      });
      if (!record.id) return;
      byId.set(record.id, record);
      record.aliases.forEach(function (alias) {
        const key = compact(alias);
        if (key && !byName.has(key)) byName.set(key, record);
        else if (key && byName.get(key) !== record) byName.set(key, null);
        const regional = regionTokens(alias);
        if (regional && !byRegion.has(regional)) byRegion.set(regional, record);
        else if (regional && byRegion.get(regional) !== record) byRegion.set(regional, null);
      });
    });

    function resolve(input) {
      const value = input && typeof input === 'object' ? input : { name: input };
      const id = String(value.id == null ? '' : value.id);
      const name = String(value.name == null ? '' : value.name);
      if (id && byId.has(id)) return { record: byId.get(id), method: 'id' };
      const exact = compact(name);
      if (exact && byName.has(exact) && byName.get(exact)) {
        return { record: byName.get(exact), method: 'alias-exato' };
      }
      const regional = regionTokens(name);
      if (regional && byRegion.has(regional) && byRegion.get(regional)) {
        return { record: byRegion.get(regional), method: 'regional-exato' };
      }
      return null;
    }

    return {
      byId: byId,
      resolve: resolve,
      size: byId.size,
      normalize: normalize,
      compact: compact
    };
  }

  root.KTVChannelRegistry = { normalize: normalize, build: build };
})(window);
