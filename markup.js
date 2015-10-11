var parseTarget = /\/\/\/(\s*)(\S[^\r\n]*)?/;
var markup = module.exports = function(results /* from inline test */, styles) {
	var src = results.src, offset = 0;
	for (var i = 0, test, pass, l = results.tests.length; i < l; i++) {
		test = results.tests[i];
		pass = test.passed && !test.failed;
		
		var target = src.substring(test.from + offset, test.to + offset);
		var parsed = target.match(parseTarget);
		//console.log(target, "->", parsed);
		
		src = src.substring(0, test.from + offset) +
		(pass ? styles.passOpen : styles.failOpen) +
			target +
			(parsed[2]
				? "" // has a message
				: // doesn't have a message
					(parsed[1] ? "" : " ") +
					(pass ? "(passed)" : "(failed)")
			)
		+ (pass ? styles.passClose : styles.failClose) +
		src.substring(test.to + offset);
		
		if (pass) { offset += styles.passOpen.length + styles.passClose.length; }
		else { offset += styles.failOpen.length + styles.failClose.length; }
	}
	return src;
};
