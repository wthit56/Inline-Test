var markup = function(results /* from inline test */, style) {
	var src = results.src;
	for (var i = 0, l = results.tests.length; i < l; i++) {
		var test = results.tests[i];
		src = src.substring(0, test.from) +
		("[") + src.substring(test.from, test.to) + ("]") +
		src.substring(test.to);
	}
	return src;
};
