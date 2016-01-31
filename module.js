var parse = /\/\/(?=[^\/])[^\r\n]*|\/\*(?=[^\/])(?:[^*]*\*[^\/])*[^*]*\*\/|"(?:[^"\r\n]*\\[\W\w])*[^"\r\n]*"|'(?:[^'\r\n]*\\[\W\w])*[^'\r\n]*'|(\/\/\/[ ]*([^\r\n]*))|(\/\*\/((?:[^\/]*(?:\/\*[^\/]|\/[^*]))*[^\/]*)\/\*\/)/g;
parse = /([\W\w]*?)(?:(\/\/(?=[^\/])[^\r\n]*|\/\*(?=[^\/])(?:[^*]*\*[^\/])*[^*]*\*\/|"(?:[^"\r\n]*\\[\W\w])*[^"\r\n]*"|'(?:[^'\r\n]*\\[\W\w])*[^'\r\n]*')|(\/\/\/[ ]*([^\r\n]*(?:\r?\n|$)))|(\/\*\/((?:[^\/]*(?:\/\*[^\/]|\/[^*]))*[^\/]*)\/\*\/))/g;

var fs = require("fs");
module.exports = function inline_test__module(src, test) {
	if (!test) { return src.toString(); }
	else {
		// console.log("creating it");
		
		var it = "", log = "";
		src.toString().replace(parse, function(match, pre, ignored, hasLineTest, lineTest, hasMultiLineTest, multiLineTest) {
			ignored = ((pre || "") + (ignored || "")).replace(/\S/g, " ");
			it += ignored;
			it += (
				hasLineTest ? "" + lineTest :
				hasMultiLineTest ? "" + multiLineTest :
					""
			);
			return match;
		});
		
		console.log("logging");
		fs && fs.writeFileSync("./inline-test--module--output.js", it);
		fs && fs.writeFileSync("./inline-test--module--log.js", log);
		console.log("logged");
		return 'function() { (' + src.toString() + ')(); console.log(require("inline-test/markup")(eval("(" + require("inline-test")(' + new Function(it) + ') + ")()"))); }';
	}
};