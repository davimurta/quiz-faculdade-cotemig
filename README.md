# Quiz Cotemig

Quiz interativo sobre a **Faculdade COTEMIG**, com identidade visual da Cotemig. Front-end em HTML, CSS e JS puros + um pequeno servidor Node (sem dependências) para gravar os resultados.

O banco tem **20 perguntas** sobre a Faculdade, guardadas no arquivo **`perguntas.json`**; a cada rodada **5 são sorteadas e embaralhadas** para o participante responder.

## Dados coletados no formulário

Antes de começar o quiz, o participante informa: **nome completo**, **e-mail**, **escola em que estuda**, **série que está cursando** (lista de opções, do 6º ano ao ensino superior) e **telefone**. Todos os campos são obrigatórios.

## Como rodar

Precisa apenas do [Node.js](https://nodejs.org) instalado (não precisa de internet).

```bash
node server.js
```

Depois abra **http://localhost:3000** no navegador.

> Para usar outra porta: `PORT=8080 node server.js`

## Onde os resultados são salvos

A cada quiz finalizado, o servidor **adiciona uma linha** ao arquivo **`resultados.csv`**, que fica na própria pasta do projeto. Nada é baixado — o arquivo é atualizado direto no repositório.

Colunas: `Data ; Nome ; Email ; Escola ; Serie ; Telefone ; Acertos ; Total ; Percentual` (separador `;`, com BOM, abre certo no Excel/Google Planilhas com acentuação correta).

Cada gravação também aparece no terminal onde o servidor está rodando (`Resultado gravado: Fulano — 4/5 — ...`). Se nada aparecer lá, o resultado não chegou ao servidor.

Se o servidor estiver fora do ar no momento, o resultado entra numa fila no navegador (localStorage) e a tela avisa quantos estão aguardando. Basta subir o servidor e **recarregar a página**: a fila é enviada automaticamente e as linhas entram no CSV. Nada se perde.

### O resultado não aparece no CSV?

1. A página precisa estar aberta em **http://localhost:3000** (ou a porta que o terminal mostrou). Abrir o `index.html` com duplo clique (`file://`) não grava — nesse caso a própria tela avisa.
2. O servidor precisa estar rodando (`node server.js`) na **mesma pasta** do `resultados.csv`.
3. Se o CSV estiver aberto no Excel, o Excel não mostra as linhas novas sozinho — feche e abra de novo.
4. Apagar o conteúdo do `resultados.csv` é seguro: o cabeçalho é recriado no próximo resultado gravado.

---

## Estrutura de arquivos

```
/
├── server.js          ← servidor local (serve a página + grava o CSV)
├── index.html         ← aplicação completa (telas e lógica)
├── perguntas.json     ← banco de perguntas do quiz
├── resultados.csv     ← resultados gravados (1 linha por participante)
├── logo-white.svg     ← logo Cotemig (fundo verde)
└── README.md          ← este arquivo
```

---

## Configurações rápidas

No topo do bloco `<script>` do `index.html`:

```js
const TOTAL_PERGUNTAS = 5;   // quantidade de perguntas sorteadas por rodada
const CSV_STORAGE_KEY  = "quiz_cotemig_resultados";  // chave do backup local
const PERGUNTAS_URL    = "perguntas.json";           // arquivo com o banco de perguntas
```

A porta do servidor é configurada pela variável de ambiente `PORT` (padrão `3000`).

---

## Editar as perguntas

As perguntas ficam no arquivo **`perguntas.json`**, na raiz do projeto, e são carregadas pela página em tempo de execução — não é preciso mexer no `index.html`. O próprio arquivo começa com um bloco `_como_editar`, com as instruções passo a passo.

Cada pergunta é um bloco assim:

```json
{
  "pergunta": "Sua pergunta aqui?",
  "alternativas": [
    "Primeira opção",
    "Segunda opção",
    "Terceira opção"
  ],
  "resposta_correta": "Segunda opção"
}
```

- **`resposta_correta`** é o *texto* da alternativa certa — copie e cole de `alternativas`. Não é preciso contar posições nem usar números. Diferenças de maiúsculas/minúsculas e espaços nas pontas são ignoradas.
- Cada pergunta pode ter de **2 a 6 alternativas** (as letras A, B, C… são geradas automaticamente).
- Para **desativar** uma pergunta sem apagá-la, troque o nome do campo `"pergunta"` por `"pergunta_desativada"`.
- Para **acrescentar** uma pergunta, copie um bloco `{ ... }` inteiro, cole no fim da lista e coloque uma vírgula antes dele.

Depois de salvar, basta recarregar a página (F5). Se algum bloco estiver com problema, a tela inicial mostra exatamente qual pergunta está errada e o que falta — as perguntas boas continuam funcionando.

> Como as perguntas são carregadas via `fetch`, a página precisa ser aberta pelo servidor (`http://localhost:3000`) — abrir o `index.html` direto pelo sistema de arquivos (`file://`) não funciona.

As perguntas e as alternativas são embaralhadas a cada rodada, e o participante só descobre o resultado no final.
