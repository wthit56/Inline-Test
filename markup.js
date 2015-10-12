var util = require("util");
var parseTarget = /\/\/\/(\s*)(\S[^\r\n]*)?/;
var markup = module.exports = function(inline_test_result /* from inline test */, styles) {
	var result = inline_test_result, src = result.src, offset = 0;
	for (var i = 0, test, style, note, l = result.tests.length; i < l; i++) {
		test = result.tests[i];
		
		style = styles.other;
		if (test.failed && !test.passed) { style = styles.fail; }
		else if (test.passed && !test.failed) { style = styles.pass; }
		
		//require("fs").appendFileSync("test-failed.txt", "\n\n>>"+src+"<<\n"+util.inspect(test)+"\n"+offset+"\n");
		
		var target = src.substring(test.from + offset, test.to + offset);
		var parsed = target.match(parseTarget);
		//console.log(util.inspect(src.substring(test.from + offset)), "->", parsed);
		
		note = "";
		if (test.passed + test.failed > 1) {
			if (test.passed) { note += test.passed + " passed"; }
			if (test.failed) { note += (note ? ", " : "") + test.failed + " failed"; }
		}
		else if (!parsed[2]) {
			if (test.passed) { note = "passed"; }
			else if (test.failed) { note = "failed"; }
		}
		
		if (!note && (test.passed + test.failed === 0)) {
			note = "did not run";
		}
		if (note) {
			note = "(" + note + ")";
			if (!parsed[1] || parsed[2]) { note = " " + note; }
		}
		
		src = (src.substring(0, test.from + offset) +
			style.open +
				target + note +
			style.close +
		src.substring(test.to + offset));
		
		offset += style.open.length + style.close.length + note.length;
	}
	
	if (result.stdout) {
		var stdout = result.stdout.replace(/\n/g, "\r\n");
		src += "\r\n" + styles.other.open + (
			"/* STDOUT: //\r\n" +
			stdout +
			(stdout.substr(-2) === "\r\n" ? "" : "\r\n") +
			"*/"
		) + styles.other.close;
	}
	
	return src;
};
