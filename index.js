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

		response.write('last stat: ' + lastStat + ', current stat:' + stat);

		if (self._lastStat === self._stat) {
			response.statusCode = 500;
		} else {
			response.statusCode = 200;
		}

		self._lastStat = self._stat;

		response.end();
	};
};

RijikHealthProbe.prototype.start = function () {
	var server = http.createServer(this.httpServer());
	var config = this._config;

	server.on('listening', function () {
		console.log('rijik started: %s', config.rijik.port);
	});

	server.listen(this._port);
};

module.exports = RijikHealthProbe;