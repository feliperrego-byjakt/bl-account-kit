
const fs = require('fs');
const Guid = require('guid');
const express = require('express');
const bodyParser = require("body-parser");
const Mustache = require('mustache');
const Request = require('request');
const Querystring = require('querystring');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('assets'));

var csrf_guid = Guid.raw();
const account_kit_api_version = 'v1.0';
const app_id = '1834269493537357';
const app_secret = 'f18497362265a2f033f5074f0a7804ae';
const me_endpoint_base_url = 'https://graph.accountkit.com/v1.0/me';
const token_exchange_base_url = 'https://graph.accountkit.com/v1.0/access_token';

app.get('/', function (request, response) {

    function render_html() {
        return fs.readFileSync('index.html').toString();
    }

    var html = Mustache.to_html(render_html(), {
        appId: app_id,
        csrf: csrf_guid,
        version: account_kit_api_version,
    });

    response.send(html);
});

var port = 8111;
app.listen(port, function () {
    console.log('Example app listening on port: ' + port);
  });

