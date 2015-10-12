var util = require("util");
var expect = require("./expect.js");
var forward = false;
var shape = module.exports = function(message, got, expected) {
	var pass = hasShape(got, expected);
	if (!pass) { message += " (got " + util.inspect(got) + ", expected shape " + util.inspect(expected) + ")"; }
	expect(message, pass);
};
shape.forward = function() {
	forward = true;
	var result = shape.apply(this, arguments);
	forward = false;
	return result;
};

function hasShape(a, b) {
	if (a === b) { return true; }
	else if (a === null) { return (b === null); }
	else if (a === undefined) { return (b === undefined); }
	else {
		var ak = Object.keys(a).sort(), bk = Object.keys(b).sort();
		if (!forward && (ak.length !== bk.length)) { return false; }
		else if (typeof a !== typeof b) { return false; }
		else if (Array.isArray(a) !== Array.isArray(b)) { return false; }
		else if (typeof b === "object") {
			for (var i = 0, l = bk.length; i < l; i++) {
				if (!forward && (ak[i] !== bk[i])) { return false; }
				else if (!hasShape(a[bk[i]], b[bk[i]])) { return false; }
			}
		}
	}
	
	return true;
}