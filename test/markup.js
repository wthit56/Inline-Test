var expect = require("./expect.js"), xexpect = { group: function() {} }, equal = require("./equal.js"), similar = require("./similar.js"), shape = require("./shape.js");

var inline_test = require("../index.js"), markup = require("../markup.js");

function test(message, src, expected) {
	equal("message", markup(inline_test(src)), expected);
}

test("does not change the source", function() {"code"}, '"code"');


/*

expect.group("Returns", function() {
	
});
*/