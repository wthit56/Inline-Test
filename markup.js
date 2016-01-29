var parseTarget = /\/\/\/(\s*)(\S[^\r\n]*)?/;
var markup = module.exports = function(inline_test_result /* from inline test */, styles) {
	if (!styles) { styles = markup.defaultStyles.current; }
	
	var result = inline_test_result, src = result.src, offset = 0, summary = { passed: 0, failed: 0, didnotrun: 0 };
	for (var i = 0, test, style, note, l = result.tests.length; i < l; i++) {
		test = result.tests[i];
		
		summary.passed += test.passed;
		summary.failed += test.failed;
		
		style = styles.other;
		if (test.failed && !test.passed) { style = styles.fail; }
		else if (test.passed && !test.failed) { style = styles.pass; }
		
		var target = src.substring(test.from + offset, test.to + offset);
		var parsed = target.match(parseTarget);
		
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
			summary.didnotrun++;
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
	
	if (result.out.length > 0) {
		src += "\n\n/* OUT //\n" +
			result.out.map(function(log) {
				return (markup.typeIndicators[log.type] + " " + log.data);
			}).join("\n") +
		"*\/";
	}
	
	src += (
		"\n\n// Summary: " +
			styles.pass.open + summary.passed + " passed" + styles.pass.close + ", " +
			styles.fail.open + summary.failed + " failed" + styles.fail.close + ", " +
			styles.other.open + summary.didnotrun + " did not run" + styles.other.close +
		". //"
	);

	return src;
};

markup.typeIndicators = {
	"stdout": ">", "stderr": "!",
	"log": "#", "info": "=", "warn": "?", "error": "!"
};

var resetANSI = "\x1b[0m", resetHTML = "</span>";
var defaultStyles = markup.defaultStyles = {
	"Node": {
		pass: { open: "\x1b[1;32m", close: resetANSI },
		fail: { open: "\x1b[1;31m", close: resetANSI },
		other: { open: "\x1b[1;36m", close: resetANSI }
	},
	"HTML": {
		pass: { open: "<span style='color:green; font-weight:bold;'>", close: resetHTML },
		fail: { open: "<span style='color:red; font-weight:bold;'>", close: resetHTML },
		other: { open: "<span style='color:cyan; font-weight:bold;'>", close: resetHTML }
	}
};

defaultStyles.current = Object.create(markup.defaultStyles[typeof process === "undefined" ? "HTML" : "Node"]);