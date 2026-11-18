const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const source = fs.readFileSync(__dirname + '/channel-registry.js', 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context);
const { build } = context.window.KTVChannelRegistry;

const registry = build([
  {
    id: 'cs:channel:globo-minas',
    name: 'Globo Minas',
    aliases: ['TV Globo Minas', 'Globo MG', 'Globo BH', 'TVGloboMinas.br'],
    epg_id: 'cs:channel:globo-minas',
    epg_source_ids: ['TVGloboMinas.br']
  },
  {
    id: 'cs:channel:globo-sp',
    name: 'Globo SP',
    aliases: ['Globo São Paulo', 'GloboSP.br']
  }
]);

assert.equal(registry.resolve({ id: 'cs:channel:globo-minas', name: 'qualquer nome' }).method, 'id');
assert.equal(registry.resolve({ name: 'Globo Minas HD' }).record.id, 'cs:channel:globo-minas');
assert.equal(registry.resolve({ name: 'TV Globo MG' }).record.id, 'cs:channel:globo-minas');
assert.equal(registry.resolve({ name: 'Globo SP HD' }).record.id, 'cs:channel:globo-sp');
assert.equal(registry.resolve({ name: 'Globo' }), null);

console.log('channel-registry: OK');
