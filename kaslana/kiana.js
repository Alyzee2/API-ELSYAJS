import { Elysia } from 'elysia';
import fs from 'fs';
import path from 'path';

const app = new Elysia();

/** Functions **/
function renderEJS(filePath, data) {
    return new Promise((resolve, reject) => {
        const fullPath = path.join(__dirname, '..', 'views', filePath);
        fs.readFile(fullPath, 'utf-8', (err, template) => {
            if (err) reject(err);
            resolve(template.replace(/<%= (\w+) %>/g, (_, key) => data[key] || ''));
        });
    });
}

/** Starting Route **/
app.get('/', async () => {
    const html = await renderEJS('seele.ejs', {});
    return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
    });
});

app.post('/submit', async ({ body }) => {
    const { message } = await body.json();
    return {
        status: 'Success',
        receivedMessage: message
    };
});

app.get('/ping', () => ({
    message: 'Welcome to Elysia.js REST API',
    author: 'Kiana Kaslana'
}));

app.get('/status', () => ({
    status: 'API is running',
    uptime: process.uptime()
}));


app.listen(3000, () => {
    console.log('Elysia.js REST API is running on http://localhost:3000');
});
