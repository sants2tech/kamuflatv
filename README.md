# KamuflaTV Smart TV

Aplicação web estática da KamuflaTV, preparada para navegador de computador, celular e Smart TV.

## Publicação

O projeto utiliza o arquivo `index.html` como ponto de entrada. Para publicar pelo GitHub Pages:

1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Escolha a branch `main` e a pasta `/ (root)`.
4. Salve e aguarde a publicação.

## Estrutura

- `index.html`: aplicação, estilos, navegação, player, catálogo e integração do guia de programação.
- `README.md`: instruções deste projeto.

Não é necessário instalar Node.js, executar build ou manter servidor próprio para servir os arquivos estáticos.

## Integrações externas

A aplicação consulta os serviços de conteúdo e o XMLTV configurados no próprio HTML. A disponibilidade de canais, filmes, séries, metadados e programação depende desses serviços externos, de suas credenciais, CORS e disponibilidade. O GitHub Pages hospeda apenas a interface; não fornece nem garante os fluxos de mídia.

## Atualizações

Edite o `index.html` e publique as alterações na branch `main`. Recomenda-se testar a aplicação em navegador desktop e no dispositivo de destino após cada atualização.
