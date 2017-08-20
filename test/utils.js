const fs      = require('fs');
const tern    = require('tern');
const uuid    = require('uuid');
const Promise = require('bluebird');

function runServer() {
	require('tern/plugin/node');
	require('../jsclass.js');

	const server = new tern.Server({
		plugins : {
			jsclass : {},
			node    : {},
		},
		projectDir : __dirname,
	});
	return server;
}

function queryCompletion(options) {
	options = options || {};
	const { server, fileName, expression }  = options;
	let { fakeFileName } = options;
	fakeFileName = fakeFileName || `${uuid.v4()}.js`;
	let fileContent;

	if (fileName)
		fileContent = fs.readFileSync(`${__dirname}/data/${fileName}`);

	if (expression)
		fileContent += `\n${expression}`;

	server.addFile(fakeFileName, fileContent);

	const requestAsync = Promise.promisify(server.request, { context : server });

	return requestAsync({
		query : {
			type              : 'completions',
			file              : fakeFileName,
			end               : fileContent.length,
			types             : true,
			docs              : false,
			urls              : false,
			origins           : true,
			caseInsensitive   : true,
			lineCharPositions : true,
			expandWordForward : false,
		},
	});
}

module.exports = { runServer, queryCompletion };
