var expect = require("./expect.js"), xexpect = { group: function() {} }, equal = require("./equal.js"), similar = require("./similar.js"), shape = require("./shape.js");

var inline_test = require("../index.js"), markup = require("../markup.js");

var styles = { passOpen:"[", passClose: "]", failOpen: "<", failClose: ">" };

function test(message, src, expected) {
	var results = inline_test(src);
	if (!equal(message, markup(results, styles), expected)) {
		console.log("inline-test results:", results);
	}
}

test("does not change the source", function() { "code"; }, ' "code"; ');

expect.group("passing tests", function() {
	test("truthy marked up", function() {
		true /// passes
		1 /// truthy also passes
	}, "\r\n\t\ttrue [/// passes]\r\n\t\t1 [/// truthy also passes]\r\n\t");
	
	expect.group("no message", function() {
		test("just whitespace", function() {
			true /// 	
		}, "\r\n\t\t\ttrue [/// \t(passed)]\r\n\t\t");
		test("no whitespace", function() {
			true ///
		}, "\r\n\t\t\ttrue [/// (passed)]\r\n\t\t");
	});
});

xexpect.group("failing tests", function() {
	test("markedup", function() {
		false /// fails
	}, "\r\n\t\tfalse [/// fails]\r\n\t");
});
