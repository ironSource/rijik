var http = require('http');

/*
	probe is designed to failed when two consecutive calls report the same stat
*/
function RijikHealthProbe(config) {
	this._stat = 0;
	this._port = config.port;
}

RijikHealthProbe.prototype.update = function(stat) {
	this._stat = stat;
};

RijikHealthProbe.prototype.httpServer = function() {
	var self = this;

	return function (request, response) {
		var lastStat = self._lastStat;
		var stat = self._stat;

		var message = 'last stat: ' + lastStat + ', current stat:' + stat;
		var statusCode = 200;


		if (lastStat === stat) {
			statusCode = 500;
		}

		self._lastStat = self._stat;

		response.writeHead(statusCode, {
		  'Content-Length': Buffer.byteLength(message),
		  'Content-Type': 'text/plain'
		});

		response.end(message);
	};
};

RijikHealthProbe.prototype.start = function () {
	var server = http.createServer(this.httpServer());
	var port = this._port;

	server.on('listening', function () {
		console.log('rijik started: %s', port);
	});

	server.listen(port);
};

module.exports = RijikHealthProbe;