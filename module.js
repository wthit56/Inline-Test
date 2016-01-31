var parse = /\/\/(?=[^\/])[^\r\n]*|\/\*(?=[^\/])(?:[^*]*\*[^\/])*[^*]*\*\/|"(?:[^"\r\n]*\\[\W\w])*[^"\r\n]*"|'(?:[^'\r\n]*\\[\W\w])*[^'\r\n]*'|(\/\/\/[ ]*([^\r\n]*))|(\/\*\/((?:[^\/]*(?:\/\*[^\/]|\/[^*]))*[^\/]*)\/\*\/)/g;
parse = /([\W\w]*?)(?:(\/\/(?=[^\/])[^\r\n]*|\/\*(?=[^\/])(?:[^*]*\*[^\/])*[^*]*\*\/|"(?:[^"\r\n]*\\[\W\w])*[^"\r\n]*"|'(?:[^'\r\n]*\\[\W\w])*[^'\r\n]*')|(\/\/\/[ ]*([^\r\n]*(?:\r?\n|$)))|(\/\*\/((?:[^\/]*(?:\/\*[^\/]|\/[^*]))*[^\/]*)\/\*\/))/g;

var fs = require("fs");
module.exports = function inline_test__module(src, test) {
	if (!test) { return src.toString(); }
	else {
		// console.log("creating it");
		
		var marker = ";;";
		var it = "", log = "";
		src.toString().replace(parse, function(match, pre, ignored, hasLineTest, lineTest, hasMultiLineTest, multiLineTest) {
			ignored = ((pre || "") + (ignored || "")).replace(/[^\r\n]/g, ";");
			//if (ignored.length >= marker.length * 2) { ignored = marker + ignored.substr(marker.length, ignored.length - (marker.length * 2)) + marker; }
			it += ignored;
			it += (
				hasLineTest ? "" + lineTest :
				hasMultiLineTest ? "" + multiLineTest :
					""
			);
			return match;
		});
		
		fs && fs.writeFileSync("./inline-test--module--output.js", it);
		fs && fs.writeFileSync("./inline-test--module--log.js", log);
		var runner = 'function() { (' + src.toString() + ')();' + 
			'var result = require("inline-test/markup")(eval("(" + require("inline-test")(' + new Function(it) + ') + ")()"));'+
			'if (typeof fs !== "undefined") { fs.writeFileSync("./inlint-test--markup--result.js", result); }'+
			'console.log(result.replace(/;{2,}(?:(?:\\r?\\n)+;+)*|^;$/gm, "")); }';
		fs && fs.writeFileSync("./inline-test--module--runner.js", runner);
		return runner;
	}
};