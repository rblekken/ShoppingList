 /*jshint unused:false */

/***************

  This file allow to configure a proxy system plugged into BrowserSync
  in order to redirect backend requests while still serving and watching
  files from the web project

  IMPORTANT: The proxy is disabled by default.

  If you want to enable it, watch at the configuration options and finally
  change the `module.exports` at the end of the file

***************/

'use strict';

var httpProxy = require('http-proxy');
var chalk = require('chalk');

/*
 * Location of your backend server
 */
var proxyTarget = 'http://localhost:49159';

var proxy = httpProxy.createProxyServer({
  target: proxyTarget
});

proxy.on('error', function(error, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  console.error(chalk.red('[Proxy]'), error);
});

/*
 * The proxy middleware is an Express middleware added to BrowserSync to
 * handle backend request and proxy them to your backend.
 */
function proxyMiddleware(req, res, next) {
  /*
   * Test for API request.
   */
    if (req.url.indexOf('/webapi/api') === 0) {
        req.url = req.url.substr(7);
        proxy.web(req, res);
    } else {
      next();
    }
}

/*
 * This is where you activate or not your proxy.
 *
 * The first line activate if and the second one ignored it
 */

module.exports = [proxyMiddleware];
//module.exports = [];
