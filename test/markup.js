var stringify = require("./stringify.js");

var expect = require("./expect.js"), xexpect = { group: function() {} }, equal = require("./equal.js"), similar = require("./similar.js"), shape = require("./shape.js"), literal = require("./literal.js");

var inline_test = require("../index.js"), markup = require("../markup.js");

var styles = {
	pass: { open: "[", close: "]" },
	fail: {open: "<", close: ">" },
	other: { open: "{", close: "}" }
};

function test(message, src, expected) {
	var result = eval("(" + inline_test(src) + ")()");
	if (!equal(message, markup(result, styles), expected)) {
		console.log("inline-test result:", result);
	}
}

expect.results.reset();
test("does not change the source", function() { "code"; }, ' "code"; ');

expect.group("passing tests", function() {
	test("marked up", function() {
		true /// passes
		1 /// truthy also passes
	}, literal(function() {/*
		true [/// passes]
		1 [/// truthy also passes]
	*/}));
	
	expect.group("no message", function() {
		test("just whitespace", function() {
			true /// 	
		}, literal(function() {/*
			true [/// 	(passed)]
		*/}));
		test("no whitespace", function() {
			true ///
		}, literal(function() {/*
			true [/// (passed)]
		*/}));
		console.log("(NOTE: No-message checks will be made implicity in future tests.)");
	});
});

test("failing tests marked up", function() {
	false /// fails
	0 /// falsy also fails
	false /// 	
	false ///
}, literal(function() {/*
	false </// fails>
	0 </// falsy also fails>
	false </// 	(failed)>
	false </// (failed)>
*/}));

test("other notes marked up", function() {
	if (false) {
		true /// never run
		1 /// 	
		"truthy" ///
	}
	for (var i = 0; i < 2; i++) {
		!i /// bit of both
		!i /// 	
		!i ///
	}
}, literal(function() {/*
	if (false) {
		true {/// never run (did not run)}
		1 {/// 	(did not run)}
		"truthy" {/// (did not run)}
	}
	for (var i = 0; i < 2; i++) {
		!i {/// bit of both (1 passed, 1 failed)}
		!i {/// 	(1 passed, 1 failed)}
		!i {/// (1 passed, 1 failed)}
	}
*/}));

expect("log added", false);
expect("summary created", false);

var frac = (expect.results.passed / expect.results.total);
console.log("\n" + [
	"(" + (frac === 1 ? expect.style.pass : expect.style.fail) + (frac * 100).toPrecision(3) + "%" + expect.style.reset + ")",
	"Pass: " + expect.style.pass + expect.results.passed + expect.style.reset,
	"Fail: " + (expect.results.failed ? expect.style.fail : "") + expect.results.failed + expect.style.reset
].join(" "));