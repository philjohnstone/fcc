{
	"//1": "describes your app and its dependencies",
	"//2": "https://docs.npmjs.com/files/package.json",
	"//3": "updating this file will download and update your packages",
	"name": "my-hyperdev-app",
	"version": "0.0.1",
	"description": "What am I about?",
	"main": "server.js",
	"scripts": {
		"start": "node server.js"
	},
	"dependencies": {
		"express": "^4.14.0",
		"cors": "^2.8.1",
		"body-parser": "^1.15.2",
		"chai": "^3.5.0",
		"mongodb": "^2.2.16",
		"chai-http": "^3.0.0",
		"mocha": "^3.2.0",
		"zombie": "^5.0.5",
		"helmet": "^3.1.0"
	},
	"engines": {
		"node": "4.4.3"
	},
	"repository": {
		"type": "git",
		"url": "https://hyperdev.com/#!/project/welcome-project"
	},
	"keywords": [
		"node",
		"hyperdev",
		"express"
	],
	"license": "MIT"
}

