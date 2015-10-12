var expect = require("./expect.js");
var equal = module.exports = function equal(message, got, expected) {
	return equal.strict.apply(this, arguments);
};

equal.sloppy = function equal_sloppy(message, got, expected) {
	return test(message, got, expected, equal.sloppy.passes(got, expected));
};
equal.sloppy.passes = function equal_sloppy_passes(a, b) {
	return (a == b);
};
equal.strict = function equal_strict(message, got, expected) {
	return test(message, got, expected, equal.strict.passes(got, expected));
}
equal.passes = equal.strict.passes = function equal_strict_passes(a, b) {
	return (a === b);
};

function test(message, got, expected, pass) {
	return expect(buildMessage(message, got, expected, pass), pass);
}

function buildMessage(message, got, expected, pass) {
	if (!pass) {
		message += (message ? " " : "[fail] ") + " (got " + JSON.stringify(got) + ", expected " + JSON.stringify(expected) + ")";
	}
	return message;
}
