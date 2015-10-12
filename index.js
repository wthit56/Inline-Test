var parse = /("(?:[^"\r\n]*(?:\\[\W\w])?)*"|'(?:[^'\r\n]*(?:\\[\W\w])?)*')|(;?[ \t]*)\/\/\/[ \t]*[^\r\n]*/g,
	findBody = /^function\s*[^\s(]*\([^)]*\)\s*\{([\W\w]*)\}$/;
var inline_test = module.exports = function(source, callback) {
	source = source.toString().replace(findBody, "$1");
	var id;
	while(source.indexOf("result" + (id = Math.random().toString().substr(2))) !== -1);

	var tests = "", i = 0;
	require("fs").writeFileSync("test-source.js", source);
	var rendered = source.replace(parse, function(match, string, pre, index) {
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
		var original = process.stdout.write;
		process.stdout.write = function(data) {
			//console.log("write");
			//require("fs").appendFileSync("stdout.txt", data);
			//stdout.original.write.apply(stdout, arguments);
			result.stdout += data;
		};
		process.stdout.write.original = original;
	}
	var post = function(result) {
		if (callback) { callback(result); }
		process.stdout.write = process.stdout.write.original;
		return result;
	}

	rendered = (
		"var result" + id + " = { src: " + JSON.stringify(source) + ", stdout: '', tests: [" + tests.substr(1) + "] };" +
		"(" + pre.toString() + ")(result" + id + ");" +
		//"\nfunction stderrListener"+id+"(data) { result"+id+".stderr+=data; }"+
		//"\nprocess.stderr.on('data', stderrListener"+id+").on('error', stderrListener"+id+");" +
		"\n\n" +
		rendered +
		//"\nprocess.stdout.removeListener('data', stdoutListener"+id+");" +
		//"\nprocess.stderr.removeListener('data', stderrListener"+id+").removeListener('error', stderrListener"+id+");" +
		"; return (" + post.toString() + ")(result" + id + ");"
	);

	require("fs").writeFileSync("rendered.js", rendered);
	
	return new Function("callback,require", rendered);
};
