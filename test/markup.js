var expect = require("./expect.js"), xexpect = { group: function() {} }, equal = require("./equal.js"), similar = require("./similar.js"), shape = require("./shape.js");

var inline_test = require("../index.js"), markup = require("../markup.js");

var styles = { passOpen:"[", passClose: "]", failOpen: "<", failClose: ">" };

function test(message, src, expected) {
	equal(message, markup(inline_test(src), styles), expected);
}

test("does not change the source", function() {"code"}, '"code"');
test("does markup passing tests", function() {
	true /// passes
}, "\r\n\ttrue [/// passes]\r\n");

/*

expect.group("Returns", function() {
	
});
*/