var Enemy = function() {
	'use strict';

	this.el = document.getElementById('enemy');

	this.el.onclick = function() {
		console.log('I am now dead');
	}

	return this;
}

var enemy = new Enemy();