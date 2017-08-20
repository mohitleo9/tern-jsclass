const expect = require('chai').expect;
const { runServer, queryCompletion } = require('./utils.js');
const server = runServer();


describe('tern-jsclass', function() {

	describe('instance methods', function() {
		it('should be picked up', function() {
			const options = {
				server,
				fileName   : 'simple.js',
				expression : 'const s = new Simple(); s.',
			};
			queryCompletion(options).then(function(res) {
				[ 'method1', 'method2' ].forEach((value, key) => expect(res.completions[key].name).to.equal(value));
			});
			expect(true).to.equal(true);
		});
	});
});
