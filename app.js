const path = require('path');
const express = require('express')
const app = express()
const db = require('./db-connection');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(require("body-parser").json());

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

app.get('/widgets', function (req, res, next) {
    db.query('SELECT * FROM widgets', function (error, resp, fields) {
        if (error) throw error;
        res.render('widgets', {
            title: 'hello world',
            widgets: resp
        });
    });
});

app.post('/widget', function (req, res, next) {
    db.query('INSERT INTO `widgets` (`name`) VALUES (?)',
    [req.body.name],
    function(err, results, fields) {
        if (!err) {
            db.query('SELECT * FROM widgets', function (error, resp, fields) {
                if (error) throw error;
                res.status(200).json(resp);
            });
        } else {
            throw err;
        }
    });
});

app.delete('/widget', function (req, res, next) {
    db.query('DELETE FROM `widgets` where id = (?)',
    [req.body.id],
    function(err, results, fields) {
        if (!err) {
            db.query('SELECT * FROM widgets', function (error, resp, fields) {
                if (error) throw error;
                res.status(200).json(resp);
            });
        } else {
            throw err;
        }
    });
});

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'))
