# Rijik healthprobe
use inside your app as a drop in http health probe. Very useful for something like amazon load balancer.

each time the probe's url is touched, the probe will remember the recent value and will reply with 500 if its touched again
and that value hasn't changed.

### Install
```
npm install rijik-healthprobe
```

### Usage
#### stand alone
```
var RijikHealthProbe = require('rijik-healthprobe');

var probe = new RijikHealthProbe({ port: 4000 });

probe.start();

probe.update(1); // update the value
```
#### in a web server
```
var http = require('http');
var RijikHealthProbe = require('rijik-healthprobe');

var probe = new RijikHealthProbe({ port: 4000 });

http.createServer(probe.httpServer());

.
.
.

probe.update(1); // update the value
```
