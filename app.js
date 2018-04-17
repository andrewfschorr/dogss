const path = require('path');
const express = require('express')
const app = express()
const db = require('./db-connection');

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/', (req, res) => res.render('index'))

app.get('/dogs', function (req, res, next) {
    const query = req.query.q;
    if (query === 'error') {
        res.status(500).send('Something broke!');
        return;
    }

    db.query(`SELECT * FROM dogs WHERE breed like "%${query}%"`, function (error, resp, fields) {
        if (error) throw error;
        res.status(200).json(resp);
    });
});

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'))
