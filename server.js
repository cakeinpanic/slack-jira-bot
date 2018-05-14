// app.js
const express = require('express');
var cors = require('cors');
const port = process.env.PORT || 3000;
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.use(cors({origin: 'http://localhost:3000'}));

router.get('/data', function(req, res) {
    res.status(200).send('123');
});

const server = app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
