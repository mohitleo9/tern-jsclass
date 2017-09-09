const expect = require('chai').expect;
const { runServer, queryCompletion } = require('./utils.js');
const server = runServer();


const getCompletionNames = function(res) {
	return res.completions.map(val => val.name);
};

describe('tern-jsclass', function() {

	describe('instance methods', function() {
		it('should be picked up', function() {
			const options = {
				server,
				fileName   : 'simple.js',
				expression : 'const s = new Simple(); s.',
			};
			queryCompletion(options).then(function(res) {
				expect(getCompletionNames(res)).to.include.members([ 'method1', 'method2', 'auth' ]);
			});
		});
	});

	describe('Promise', function() {
		it('should add some methods', function() {
			const options = {
				server,
				expression : 'Promise.',
			};
			queryCompletion(options).then(function(res) {
				expect(getCompletionNames(res)).to.include.members([ 'ajax', 'wrapGenerator' ]);
			});
		});


		it('should return correct type from methods', function() {
			const options = {
				server,
				expression : 'Promise.ajax().',
			};
			queryCompletion(options).then(function(res) {
				expect(getCompletionNames(res)).to.include.members([ 'ajax', 'wrapGenerator' ]);
			});
		});
	});

	describe('instance fields', function() {
		it('should be picked up', function() {
			const options = {
				server,
				fileName   : 'simple.js',
				expression : 'const s = new Simple(); s.',
			};
			queryCompletion(options).then(function(res) {
				expect(getCompletionNames(res)).to.include.members([ 'f1', 'f2' ]);
			});
		});
	});

	describe('static methods', function() {
		it('should be picked up', function() {
			const options = {
				server,
				fileName   : 'simple.js',
				expression : 'Simple.',
			};
			queryCompletion(options).then(function(res) {
				expect(getCompletionNames(res)).to.include.members([ 'st', 'current' ]);
			});
		});
	});
});
