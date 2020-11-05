const http = require('http');
const express = require('express');
const path = require('path');
const Pageres = require('pageres');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

let filename;
let format;

app.post('/submit', (req, res) => {
    console.log('====================' + req.body['url'] + '====================');
    let date = new Date();
    let hours = date.getHours() < 10 ? '0' + String(date.getHours()) : date.getHours();
    let minutes = date.getMinutes() < 10 ? '0' + String(date.getMinutes()) : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? '0' + String(date.getSeconds()) : date.getSeconds();
    filename = date.toISOString().slice(0, 10) + '-' + hours + '-' + minutes + '-' + seconds;

    format = req.body.format;

    (async () => {
        await new Pageres({ delay: 2 })
            .src('https://' + req.body.url, [req.body.resolution], {
                crop: true,
                filename: '<%= date %>-<%= time %>',
                format: format,
            })
            .dest(__dirname + '/public/images')
            .run();

        console.log('Finished generating screenshots!');
    })();
    res.redirect('/');
});

app.use('/', (req, res) => {
    res.render('index.html', { targetURL: filename + '.' + format });
    filename = '';
    format = '';
    console.log('Gottt');
});

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);
