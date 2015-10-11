var expect = require("./expect.js");
var forward = false;
var shape = module.exports = function(message, got, expected) {
	expect(message, hasShape(got, expected));
};
shape.forward = function() {
	forward = true;
	var result = shape.apply(this, arguments);
	forward = false;
	return result;
};

function hasShape(a, b) {
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
	
	return true;
}