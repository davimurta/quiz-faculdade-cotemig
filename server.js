const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT     = process.env.PORT || 3100;
const ROOT     = __dirname;
const CSV_PATH = path.join(ROOT, 'resultados.csv');
const HEADERS  = ['Data', 'Nome', 'Email', 'Escola', 'Serie', 'Telefone', 'Acertos', 'Total', 'Percentual'];

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'text/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg':  'image/svg+xml',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.ico':  'image/x-icon'
};

function csvEscape(value) {
    const s = String(value == null ? '' : value);
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function ensureCSV() {
    let precisaCabecalho = !fs.existsSync(CSV_PATH);

    if (!precisaCabecalho) {
        const conteudo = fs.readFileSync(CSV_PATH, 'utf8').replace(/^﻿/, '').trim();
        precisaCabecalho = conteudo === '';
    }

    if (precisaCabecalho) {
        fs.writeFileSync(CSV_PATH, '﻿' + HEADERS.join(';') + '\r\n', 'utf8');
    }
}

function appendResultado(record) {
    ensureCSV();
    const linha = [
        record.data || new Date().toISOString(),
        record.nome,
        record.email,
        record.escola,
        record.serie,
        record.telefone,
        record.acertos,
        record.total,
        record.percentual != null ? record.percentual + '%' : ''
    ].map(csvEscape).join(';') + '\r\n';

    fs.appendFileSync(CSV_PATH, linha, 'utf8');
    console.log(`Resultado gravado: ${record.nome || '(sem nome)'} — ${record.acertos}/${record.total} — ${CSV_PATH}`);
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/api/resultado') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 1e6) req.destroy();
        });
        req.on('end', () => {
            try {
                appendResultado(JSON.parse(body || '{}'));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true }));
            } catch (err) {
                console.error('Falha ao gravar resultado:', err.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: false, erro: String(err) }));
            }
        });
        return;
    }

    let pathname = decodeURIComponent(req.url.split('?')[0]);
    if (pathname === '/') pathname = '/index.html';

    const filePath = path.normalize(path.join(ROOT, pathname));
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end('Acesso negado');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Arquivo não encontrado');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

function start(port, tentativasRestantes) {
    server.once('error', (err) => {
        if (err.code === 'EADDRINUSE' && tentativasRestantes > 0) {
            console.log(`Porta ${port} ocupada — tentando ${port + 1}...`);
            start(port + 1, tentativasRestantes - 1);
        } else {
            console.error('Não foi possível iniciar o servidor:', err.message);
            process.exit(1);
        }
    });

    server.listen(port, () => {
        ensureCSV();
        console.log(`\nQuiz Cotemig rodando em:  http://localhost:${port}`);
        console.log(`Resultados gravados em:   ${CSV_PATH}\n`);
    });
}

start(Number(PORT), 20);
