#!/usr/bin/env node

var sys = require('sys');
var http = require('http');
var url = require('url');
var _ = require('underscore');

var help = function(){
    if(0 in arguments){
        sys.puts(arguments[0]);
    }
    sys.puts('Usage: oauth-register.js -l username -p secret -a app_title [-u portal_url] [-t app_auth_type]');
};

var main = function(){

    var argv = require('optimist')
            .default('u', 'http://portal.aflexi.net/mini_operator.php')
            .default('t', 'standard')
            .argv;

    var args = {
        portal: argv.u,
        username: argv.l,
        secret: argv.p,
        app_title: argv.a,
        app_auth_type: argv.t
    }

    if(args.username === undefined){
        help("'username' is not defined");
        process.exit();
    }
    if(args.secret === undefined){
        help("'secret' is not defined");
        process.exit();
    }
    if(args.app_title === undefined){
        help("'app_title' is not defined");
        process.exit();
    }

    register(args);
}

var register = function(args){

    var url_ = args.portal;
    url_ = url.parse(url_);
    _.each({
        protocol: 'http:',
        port: 80
    }, function(v, k){ if(_.isUndefined(url[k])){ url_[k] = v; }});

    var options = {
        host: url_.host,
        port: url_.port,
        path: url_.pathname + '/oauth/register?format=json',
        method: 'POST',
        headers: {
            // PHP (not sure about other servers) will only set $_POST variables
            // given this content-type - used for form submission.
            // See also: http://php.net/manual/en/language.variables.external.php
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var submit = 'generate=1&' +
        'oauth_application_title=' + encodeURI(args.app_title) + '&' +
        'oauth_application_type=' + encodeURI(args.app_auth_type) + '&' +
        'auth_username=' + encodeURI(args.username) + '&' +
        'auth_secret=' + encodeURI(args.secret);
    var data = "";

    console.log("Sending HTTP request: ");
    console.log(options);

    var request = http.request(options, function(res){
        console.log("Got response: " + res.statusCode);
    }).on('error', function(e){
        console.log("Got error: " + e.message);
    }).on('response', function(response){
        response.on('data', function(chunk){
            data += chunk;
        }).on('end', function(){
            data = JSON.parse(data);
            console.log("Created entry: ");
            console.log(data);
        })
    });

    request.write(submit);

    request.end();
}

main();
