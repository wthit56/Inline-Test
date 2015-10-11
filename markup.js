var markup = module.exports = function(results /* from inline test */, styles) {
	var src = results.src;
	for (var i = 0, test, pass, l = results.tests.length; i < l; i++) {
		test = results.tests[i];
		pass = test.passed && !test.failed;
		
		src = src.substring(0, test.from) +
		(pass ? styles.passOpen : styles.failOpen) +
			src.substring(test.from, test.to) +
		(pass ? styles.passClose : styles.failClose) +
		src.substring(test.to);
	}
	return src;
};
