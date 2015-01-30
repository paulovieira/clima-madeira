(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var test1 = require("./test1.js");
var $ = require("jQuery");

debugger;
console.log(test1.say());

console.log(test1.sayAgain());

debugger;
console.log( $("#xxx").html() );

},{"./test1.js":2,"jQuery":"jQuery"}],2:[function(require,module,exports){
var test1 = {
	say: function(){
		debugger;
		console.log("hey there! ");
	},

	sayAgain: function(){
		debugger;
		console.log("hey there again!  ");
	},

	sayAgain2: function(){
		debugger;
		console.log("hey there again! ");
	}
};

module.exports = test1;

},{}]},{},[1,2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvdGVzdC9qcy9tYWluLmpzIiwiY2xpZW50L3Rlc3QvanMvdGVzdDEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB0ZXN0MSA9IHJlcXVpcmUoXCIuL3Rlc3QxLmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwialF1ZXJ5XCIpO1xuXG5kZWJ1Z2dlcjtcbmNvbnNvbGUubG9nKHRlc3QxLnNheSgpKTtcblxuY29uc29sZS5sb2codGVzdDEuc2F5QWdhaW4oKSk7XG5cbmRlYnVnZ2VyO1xuY29uc29sZS5sb2coICQoXCIjeHh4XCIpLmh0bWwoKSApO1xuIiwidmFyIHRlc3QxID0ge1xuXHRzYXk6IGZ1bmN0aW9uKCl7XG5cdFx0ZGVidWdnZXI7XG5cdFx0Y29uc29sZS5sb2coXCJoZXkgdGhlcmUhIFwiKTtcblx0fSxcblxuXHRzYXlBZ2FpbjogZnVuY3Rpb24oKXtcblx0XHRkZWJ1Z2dlcjtcblx0XHRjb25zb2xlLmxvZyhcImhleSB0aGVyZSBhZ2FpbiEgIFwiKTtcblx0fSxcblxuXHRzYXlBZ2FpbjI6IGZ1bmN0aW9uKCl7XG5cdFx0ZGVidWdnZXI7XG5cdFx0Y29uc29sZS5sb2coXCJoZXkgdGhlcmUgYWdhaW4hIFwiKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0ZXN0MTtcbiJdfQ==
