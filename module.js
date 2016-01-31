var parse = /\/\/(?=[^\/])[^\r\n]*|\/\*(?=[^\/])(?:[^*]*\*[^\/])*[^*]*\*\/|"(?:[^"\r\n]*\\[\W\w])*[^"\r\n]*"|'(?:[^'\r\n]*\\[\W\w])*[^'\r\n]*'|(\/\/\/[ ]*([^\r\n]*))|(\/\*\/((?:[^\/]*(?:\/\*[^\/]|\/[^*]))*[^\/]*)\/\*\/)/g;
parse = /([\W\w]*?)(?:(\/\/(?=[^\/])[^\r\n]*|\/\*(?=[^\/])(?:[^*]*\*[^\/])*[^*]*\*\/|"(?:[^"\r\n]*\\[\W\w])*[^"\r\n]*"|'(?:[^'\r\n]*\\[\W\w])*[^'\r\n]*')|(\/\/\/[ ]*([^\r\n]*))|(\/\*\/((?:[^\/]*(?:\/\*[^\/]|\/[^*]))*[^\/]*)\/\*\/))/g;

var fs = require("fs");
module.exports = function inline_test__module(src, test) {
	if (!test) { return src.toString(); }
	else {
		// console.log("creating it");
		
		var marker = Math.random();
		var it = "", log = "";
		src.toString().replace(parse, function(match, pre, ignored, hasLineTest, lineTest, hasMultiLineTest, multiLineTest) {
			ignored = ((pre || "") + (ignored || "")).replace(/[^\r\n]/g, ";");
			//if (ignored.length >= marker.length * 2) { ignored = marker + ignored.substr(marker.length, ignored.length - (marker.length * 2)) + marker; }
			it += ignored;
			//if (hasLineTest) { console.log(!!lineTest, JSON.stringify(hasLineTest)); }
			it += (
				hasLineTest ? (
					lineTest ? lineTest : "/" + marker + "/"
				) :
				hasMultiLineTest ? "" + multiLineTest :
					""
			);
			return match;
		});
		
		fs && fs.writeFileSync("./inline-test--module--output.js", it);
		fs && fs.writeFileSync("./inline-test--module--log.js", log);
		var toNL = new RegExp(/(?:(?:\r?\n)+;+)+(?:\r?\n)*(?:\/1\/)?/g.source.replace("1", marker), "g");
		var runner = 'function() { (' + src.toString() + ')();' + 
			'var result = require("inline-test/markup")(eval("(" + require("inline-test")(' + new Function(it) + ') + ")()")); '+
			'result = result.replace(' + toNL + ', "\\n"); '+
			'if (typeof fs !== "undefined") { fs.writeFileSync("./inlint-test--markup--result.js", result); }'+
			' console.log(result);'+
			'}';
		fs && fs.writeFileSync("./inline-test--module--runner.js", runner);
		return runner;
	}
};