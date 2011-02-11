#!/usr/bin/env node

var sys = require('sys');
var exec = require('child_process').exec;

/**
 * oauth-request.js - Request for OAuth token through the 2-leg implementation.
 *
 * @author yclian
 * @since 2.12.20110211
 * @version 2.12.20110211
 */

var main = function(){

    var argv = require('optimist')
            .default('u', 'http://portal.aflexi.net/mini_operator.php')
            .default('PHP', '')
            .usage(
				'Usage: oauth-request.js -k consumer_key -s consumer_secret [-u portal_url] [--PHP="php_options"]' + "\n" + 
				'Example: oauth-request.js --PHP="-d include_path=.:/usr/share/php" -k KEY -s SECRET -u URL'
			)
            .demand(['k', 's'])
            .argv;

    var url = argv.u + '/oauth/request';
    var consumer_key = argv.k;
    var consumer_secret = argv.s;
    
    var command = 'php ' + argv.PHP + ' ' + __dirname + '/oauth-request.php';
    command += ' ' + url + ' ' + consumer_key + ' ' + consumer_secret;

    console.info("exec: " + command);
    
    exec(command, function (error, stdout, stderr){

        if (error !== null) {
            console.log('Execution error:', error);
        } else{
			var response = JSON.parse(stdout);
            console.log('Successful:', response);
			console.log('You may now login to the portal through: ' + argv.u + '/?oauth_token=' + response.oauth_token + '&auth_username=USERNAME');
        }
    });
};

main();
