#!/usr/bin/env node

/**
 * oauth-register.js - Register an OAuth consumer.
 *
 * @author yclian
 * @since 2.12.20110210
 * @version 2.12.20110211
 */

var sys = require('sys');
var http = require('http');
var url = require('url');
var _ = require('underscore');

var main = function(){

    var argv = require('optimist')
            .default('u', 'http://portal.aflexi.net/mini_operator.php')
            .default('t', 'standard')
            .usage('Usage: oauth-register.js -l username -p secret -a app_title [-u portal_url] [-t app_auth_type]')
            .demand(['u', 'p', 'a'])
            .argv;

    var args = {
        portal: argv.u,
        username: argv.l,
        secret: argv.p,
        app_title: argv.a,
        app_auth_type: argv.t
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
        'oauth_application_title=' + encodeURIComponent(args.app_title) + '&' +
        'oauth_application_type=' + encodeURIComponent(args.app_auth_type) + '&' +
        'auth_username=' + encodeURIComponent(args.username) + '&' +
        'auth_secret=' + encodeURIComponent(args.secret);
    var data = "";

    console.log("Sending HTTP request:", options);

    var request = http.request(options, function(res){
        console.log("Got response: " + res.statusCode);
    }).on('error', function(e){
        console.log("Got error: " + e.message);
    }).on('response', function(response){
        response.on('data', function(chunk){
            data += chunk;
        }).on('end', function(){
            data = JSON.parse(data);
            console.log("Created entry:", data);
        })
    });

    request.write(submit);

    request.end();
}

main();
