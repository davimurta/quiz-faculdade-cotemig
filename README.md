# Quiz Cotemig

Quiz interativo sobre a Faculdade COTEMIG. A cada rodada, 5 perguntas são sorteadas de um banco de 20 (`perguntas.json`). Front-end em HTML/CSS/JS puro e um servidor Node sem dependências que grava os resultados em CSV.

## Como rodar

Precisa apenas do [Node.js](https://nodejs.org).

```bash
node server.js
```

Abra http://localhost:3000 no navegador. Para outra porta: `PORT=8080 node server.js`.

## Resultados

Cada quiz finalizado vira uma linha em `resultados.csv` (criado automaticamente na pasta do projeto). Colunas: `Data ; Nome ; Email ; Escola ; Serie ; Telefone ; Acertos ; Total ; Percentual`.

Se o servidor estiver fora do ar, o resultado fica numa fila no navegador e é enviado ao recarregar a página com o servidor no ar.

O arquivo não é versionado (contém dados pessoais).

## Editar as perguntas

Edite `perguntas.json` e recarregue a página. Cada pergunta:

```json
{
  "pergunta": "Sua pergunta aqui?",
  "alternativas": ["Primeira opção", "Segunda opção", "Terceira opção"],
  "resposta_correta": "Segunda opção"
}
```

- `resposta_correta` é o texto exato de uma das alternativas.
- De 2 a 6 alternativas por pergunta.
- Para desativar uma pergunta, renomeie o campo `"pergunta"` para `"pergunta_desativada"`.

## Arquivos

```
server.js        servidor local (serve a página e grava o CSV)
index.html       aplicação completa
perguntas.json   banco de perguntas
logo-white.svg   logo Cotemig
```
