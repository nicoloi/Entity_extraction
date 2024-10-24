
const express = require('express')
const http = require('http')
const dotenv = require('dotenv')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(express.static('public'));
app.use(express.static('public/root'));
app.use(express.static('public/results'));
app.use(express.static('public/not_found'));

let porta = process.env.SERVER_PORT ?? 8080;
let hostname = process.env.SERVER_HOST ?? "127.0.0.1";

server.listen(porta, hostname);

console.log(`In ascolto sulla porta: ${porta}`);
console.log(`indirizzo home page del server: http://${hostname}:${porta}`);

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname + "/public/root"});
});

app.get('/results', (req, res) => {
    res.sendFile('results.html', {root: __dirname + "/public/results"});
});

app.get('/search', (req, res) => {
    const token = process.env.API_KEY;
    if (!token) {
        console.log("Errore, API KEY mancante.");
        res.json({"messaggio": "Errore, con la gestione della richiesta, riprova più tardi."});
        return;
    }

    const {lang, text} = req.query;

    if (lang && text) {
        let url = new URL(`https://api.dandelion.eu/datatxt/nex/v1/`);
        url.searchParams.set('lang', lang);
        url.searchParams.set('text', text);
        url.searchParams.set('token', token);
        url.searchParams.set('social.mention', 'true');
        url.searchParams.set('social.hashtag', 'true');
        url.searchParams.set('include', 'image,abstract,categories');
        url.searchParams.set('min_confidence', '0.7');

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onload = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    //console.log(xhr.responseText);
                    let jsonObj = JSON.parse(xhr.responseText);
                    res.json(jsonObj);
                } else {
                    console.log("errore nella richiesta");
                    res.json({"messaggio": "Errore, con la gestione della richiesta, riprova più tardi.", 
                              "status": xhr.status,
                              "status-text" : xhr.statusText,
                    });
                }
            }
        }
    } else {
        console.log('errore, parametri mancanti');
        res.json({"messaggio": "Errore, con la gestione della richiesta, parametri mancanti."});
    }
});

app.all('*', (req, res) => {
    res.sendFile('404.html', {root: __dirname + "/public/not_found"});
});