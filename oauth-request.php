<?php

/**
 * oauth-request.php - Request for OAuth token through the 2-way handshake implementation.
 *
 * @author yclian
 * @since 2.12.20110211
 * @version 2.12.20110211
 */

require_once 'OAuth/OAuthStore.php';
require_once 'OAuth/OAuthRequester.php';

$url = @$argv[1];
$key = @$argv[2];
$secret = @$argv[3];

$store = OAuthStore::instance("2Leg", array(
    'consumer_key' => $key,
    'consumer_secret' => $secret
));

$request = new OAuthRequester($url, 'POST', NULL);
$result = $request->doRequest();

$response = array();
parse_str($result['body'], $response);

echo json_encode($response);
