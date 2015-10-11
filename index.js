var parse = /(;?[ \t]*)\/\/\/[ \t]*[^\r\n]*/g,
	findBody = /^function\s*[^\s(]*\([^)]*\)\s*\{([\W\w]*)\}$/;
module.exports = function(source, callback) {
	source = source.toString().replace(findBody, "$1");
	var id;
	while(source.indexOf("result" + (id = Math.random().toString().substr(2))) !== -1);

	var tests = "", i = 0;
	var rendered = source.replace(parse, function(match, pre, index) {
		tests += ", { from:" + (index + pre.length) + ", to:" + (index + match.length) + ", passed: 0, failed: 0 }";
		var result = (
			" ? result" + id + ".tests[" + i + "].passed++" +
			" : result" + id + ".tests[" + i + "].failed++" +
			";"
		);
		i++;
		return result;
	});

	rendered = (
		"var result" + id + " = { src: " + JSON.stringify(source) + ", log: [], tests: [" + tests.substr(1) + "] };"+
		"\n/* shadow logging */ var console = {" +
		"log: function() { result" + id + ".log.push(Array.prototype.join.call(arguments, ' ')); } };" +
		"\n\n" +
		rendered + "\n" +
		"\nif (callback) { callback(result" + id + "); }" +
		"\nreturn result" + id + ";"
	);

	require("fs").writeFileSync("rendered.js", rendered);
	
	rendered = new Function("callback", rendered);
	
	return rendered(callback);
};
