try { var fs = require("fs"); } catch(e) {}
var stringify = require("./stringify.js");
var expect = require("./expect.js");

function similar(message, got, expected) {
	var pass = isSimilar(got, expected);
	if (!pass) {
		message += (message ? " " : "[Fail] ") + " (got " + stringify(got) + ", expected partial " + stringify(expected) + ")";
	}
	if (fs) { fs.appendFileSync("test-failed.txt", message); }
	return expect(message, pass);
}

var partial = false;
similar.partial = function similar_forward(message, got, expected) {
	partial = true;
	var result = similar(message, got, expected);
	partial = false;
};

var isBase = /^(?:function|number|boolean|string|undefined|symbol)$/;
function isSimilar(a, b) {
	var at = typeof a, bt = typeof b;
	if (at !== bt) { return false; }
	else if (isBase.test(at) || (a === null)) { return a === b; }
	else if (Array.isArray(a)) {
		if (!Array.isArray(b) || (a.length !== b.length)) { return false; }
		else {
			for (var i = 0, l = a.length; i < l; i++) {
				if (!isSimilar(a[i], b[i])) { return false; }
			}
		}
	}
	else {
		var ak = Object.keys(a).sort(), bk = Object.keys(b).sort();
		if (!partial && ak.length !== bk.length) { return false; }
		else {
			for (var i = 0, l = bk.length; i < l; i++) {
				if ((!partial && (ak[i] !== bk[i])) || !isSimilar(a[bk[i]], b[bk[i]])) {
					return false;
				}
			}
		}
	}
	return true;
}

module.exports = similar;
