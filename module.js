var parse = /\/\/(?=[^\/])[^\r\n]*|\/\*(?=[^\/])(?:[^*]*\*[^\/])*[^*]*\*\/|"(?:[^"\r\n]*\\[\W\w])*[^"\r\n]*"|'(?:[^'\r\n]*\\[\W\w])*[^'\r\n]*'|(\/\/\/[ ]*([^\r\n]*))|(\/\*\/((?:[^\/]*(?:\/\*[^\/]|\/[^*]))*[^\/]*)\/\*\/)/g;

var fs = 0//require("fs");
module.exports = function inline_test__module(src, test) {
	if (!test) { return src.toString(); }
	else {
		// console.log("creating it");
		
		var it = "";
		src.toString().replace(parse, function(match, hasLineTest, lineTest, hasMultiLineTest, multiLineTest) {
			it += (
				hasLineTest ? "\n" + lineTest :
				hasMultiLineTest ? multiLineTest :
					""
			);
			return match;
		});
		
		fs && fs.appendFileSync("./testRun-output.js", "//inline-test//\n"+it+"\n\n\n");
		return 'function() { (' + src.toString() + ')(); console.log(require("inline-test/markup")(eval("(" + require("inline-test")(' + new Function(it) + ') + ")()"))); }';
	}
};