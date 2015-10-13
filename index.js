var parse = /("(?:[^"\r\n]*(?:\\[\W\w])?)*"|'(?:[^'\r\n]*(?:\\[\W\w])?)*')|(;?[ \t]*)\/\/\/[ \t]*[^\r\n]*/g,
	parseFunction = /^(function\s*[^\s(]*\([^)]*\)\s*\{)([\W\w]*)(\})$/,
	cleanup = /\/\/[^\r\n]*|[\r\n]/g;

var inline_test = module.exports = function(source) {
	var parsedF = source.toString().match(parseFunction);
	var body = parsedF[2];
	var id;
	while(body.indexOf("result" + (id = Math.random().toString().substr(2))) !== -1);

	var tests = "", i = 0;
	require("fs").writeFileSync("test-source.js", body);
	var rendered = body.replace(parse, function(match, string, pre, index) {
		if (string) { return match; }
		else {
			tests += ", { from:" + (index + (pre ? pre.length : 0)) + ", to:" + (index + match.length) + ", passed: 0, failed: 0 }";
			var result = (
				" ? result" + id + ".tests[" + i + "].passed++" +
				" : result" + id + ".tests[" + i + "].failed++" +
				";"
			);
			i++;
			return result;
		}
	});

	var pre = function(result) {
		if (typeof process !== "undefined") {
			var original = process.stdout.write;
			process.stdout.write = function(data) {
				result.stdout += data;
			};
			process.stdout.write.original = original;
		}
	}
	var post = function(result) {
		if (typeof process !== "undefined") {
			process.stdout.write = process.stdout.write.original;
		}
		return result;
	}

	rendered = parsedF[1] + (
		"var result" + id + " = { src: " + JSON.stringify(body) + ", stdout: '', tests: [" + tests.substr(1) + "] };" +
		"(" + pre.toString().replace(cleanup, "") + ")(result" + id + "); " +
		rendered +
		"; var result = (" + post.toString().replace(cleanup, "") + ")(result" + id + "); return result;"
	) + parsedF[3];

	require("fs").writeFileSync("rendered.js", rendered);
	
	return rendered;
};
