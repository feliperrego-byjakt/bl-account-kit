
const fs = require('fs');
const Guid = require('guid');
const express = require('express');
const bodyParser = require("body-parser");
const Mustache = require('mustache');
const Request = require('request');
const Querystring = require('querystring');
const app = express();

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('assets'));

var csrf_guid = Guid.raw();
const me_endpoint_base_url = 'https://graph.accountkit.com/v1.0/me';
const token_exchange_base_url = 'https://graph.accountkit.com/v1.0/access_token';

app.get('/', function (request, response) {

    function render_html() {
        return fs.readFileSync('sign_up.html').toString();
    }

    var html = Mustache.to_html(render_html(), {
        appId: process.env.ACCOUNT_KIT_APP_ID,
        csrf: csrf_guid,
        version: process.env.ACCOUNT_KIT_APP_VERSION,
    });

    response.send(html);
});

app.get('/login', function (request, response) {

    function render_html() {
        return fs.readFileSync('sign_in.html').toString();
    }

    var html = Mustache.to_html(render_html(), {
        appId: process.env.ACCOUNT_KIT_APP_ID,
        csrf: csrf_guid,
        version: process.env.ACCOUNT_KIT_APP_VERSION,
    });

    response.send(html);
});

app.listen(process.env.PORT || 8111, function () {
    console.log('Example app listening on port: ' + this.address().port);
  });

