var RijikHealthProbe = require('../index.js');
var assert = require('assert');

function create() {
	return new RijikHealthProbe({ rijik: { port: 3911 } });
}

function Response() {

}

Response.prototype.writeHead = function (statusCode, headers) {
	this.statusCode = statusCode;
	this.headers = headers;
}

Response.prototype.end = function (message) {
	this.message = message;
	this.endCalled = true;
};


describe('RijikHealthProbe', function () {

	it('responds with 500 if stat doesnt change between web requests', function () {
		var probe = create();

		var handler = probe.httpServer();

		var response = new Response();

		handler(null, response);

		assert.strictEqual(response.statusCode, 200);
		assert(response.message !== undefined);
		assert(response.endCalled);

		response = new Response();

		handler(null, response);

		assert.strictEqual(response.statusCode, 500);
		assert(response.message !== undefined);
		assert(response.endCalled);

	});

	it('responds with 200 if stat changes between web requests', function () {
		var probe = create();

		var handler = probe.httpServer();

		var response = new Response();

		handler(null, response);

		assert.strictEqual(response.statusCode, 200);
		assert(response.message !== undefined);
		assert(response.endCalled);

		probe.update(11);

		response = new Response();
		handler(null, response);

		assert.strictEqual(response.statusCode, 200);
		assert(response.message !== undefined);
		assert(response.endCalled);
	});

});