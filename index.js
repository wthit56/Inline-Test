var fs = require("fs"), child_process = require("child_process");

var findLTs = /</g, findAmps = /&/g, findTabs = /\t/g;
function stringify(string, style) {
	var result = string.replace(/["'\\]/g, "\\$&").replace(/\r?\n/g, "\\n");
	if (style) {
		if (style["<"]) { result = result.replace(findLTs, style["<"]); }
		if (style["&"]) { result = result.replace(findAmps, style["&"]); }
		if (style["\t"]) { result = result.replace(findTabs, style["\t"]); }
	}
	return result;
}

var styles = {
	"HTML": {
		preGood: stringify('<span style="color:#0F0; font-weight:bold;">'),
		preBad: stringify('<span style="color:#F00; font-weight:bold;">'),
		preUntested: stringify('<span style="color:#99F; font-weight:bold;">'),
		post: stringify('</span>'),
		"<": "&lt;", "&": "&amp;",
		"\t": "    "
	},
	"NODE": {
		preBad: "\x1b[1m\x1b[31m",
		preGood: "\x1b[1m\x1b[32m",
		preUntested: "\x1b[1m\x1b[36m",
		post: "\x1b[0m",
		"\t": "    "
	}
};

function test(code, source__dirname, source__filename) {
	var style = styles["NODE"];

	var render = "render" + Math.random().toString().substring(2),
		failed = "failed" + Math.random().toString().substring(2),
		passed = "passed" + Math.random().toString().substring(2),
		untested = "untested" + Math.random().toString().substring(2),
		tests = "tests" + Math.random().toString().substring(2),
		error = "error" + Math.random().toString().substring(2);

	var testCount = 0;
	code = code.toString().match(/^(function\s*\S*\s*\([^)]*\)\s*\{)([\W\w]*)\}$/);
  
	var findParts = /([\W\w]*?)(?:(\/\/(?:(?!\/)|(?=\/\/))[^\r\n]*|\/\*[\W\w]*?\*\/|"[^"\\\r\n]*(?:\\[\W\w][^"\\\r\n]*)*"|'[^'\\\r\n]*(?:\\[\W\w][^'\\\r\n]*)*')|(;)([ \t]*)(\/\/\/(?!\/)[^\r\n]*(?:\s*\/\/\/(?!\/)[^\r\n]*)*)|$)/g;
  
	var testIndex = 0;
	var run = (
		'var __dirname = ' + JSON.stringify(source__dirname) + ', __filename = ' + JSON.stringify(source__filename) + ';\n' +
		'var ' + failed + ' = 0, ' + passed + ' = 0, ' + untested + ' = 0, ' + tests + ' = [], ' + render + ' = "", ' + error + ';\n\n' +
		'try {\n' +
		  code[2].replace(findParts, function(match, ignored, ignored2, testSemicolon, testSpacing, test) {
			var result = ignored + (ignored2 || "");
			if (test) {
			  result += (
				'\n? process.stdout.write("{!!return tests[' + testIndex + '] = true!!}") ' +
				'\n: process.stdout.write("{!!return tests[' + testIndex + '] = false!!}");\n'
			  );
			  testIndex++;
			}
			return result;
		  }) + '\n\n' +
		'}\n' +
		'catch(error) {\n' +
			'Error.prototype.toJSON = function() {\n'+
					'var alt = {}; alt.type = this.constructor.name; Object.getOwnPropertyNames(this).forEach(function (key) { alt[key] = this[key]; }, this); return alt;' +
			'};\n' +
			'process.stdout.write("{!!return error = " + JSON.stringify(error) + "!!}");' +
		'}'
	);

	var result = { tests: [], detected: testIndex, passed: 0, failed: 0, tested: 0, untested: 0, error: null, log: "" };
	
	fs.writeFileSync(__dirname + "/run", run);
	try {
		//console.log("node '" + __dirname + "/" + child + "'");
		var out = child_process.execSync(
			'node "' + __dirname + '/run"',
			{ cwd: source__dirname }
		);
		out = out.toString();
		fs.writeFileSync(__dirname + "/out", out);
		out.replace(/([\W\w]*?)(?:\{!!return (?:error = ([\W\w]*?)(?=!!\})|tests\[(\d+)\] = (true|false))!!\}|$)/g, function(match, log, error, testIndex, testPassed) {
			result.log += (log || "");
			
			if (error) { result.error = JSON.parse(error); }
			else if (testIndex) {
				if (testPassed === "true") {
					result.tests[testIndex] = true;
					result.passed++;
				}
				else {
					result.tests[testIndex] = false;
					result.failed++;
				}
				
				result.tested++;
			}
		});
	}
	finally {
		fs.unlinkSync(__dirname + "/run");
		fs.unlinkSync(__dirname + "/out");
	}

	testIndex = 0;
	var render = (
		'var render = "' + 
			code[2].replace(findParts, function(match, ignored, ignored2, testSemicolon, testSpacing, test) {
			  var result = stringify(ignored + (ignored2 || ""), style);
			  if (test) {
				result += (testSemicolon + testSpacing +
				  '" +\n(result.tests[' + testIndex + '] === undefined ? (result.untested++, "' + style.preUntested + '") : ' +
					'result.tests[' + testIndex + '] ? "' + style.preGood + '" : "' + style.preBad + '") +\n"' +
				  stringify(test, style) + '" +\n' +
				  '"' + style.post
				);
				testIndex++;
			  }
			  return result;
			}) +
		'";\n' +
		'var renderFull = render + "' +
			'" + (result.log ? "/* // STDOUT //\\n" + result.log.replace(/\\r?\\n$/, "") + "\\n*/" : "") + "' +
			('" + (result.error' +
				'? "\\n\\n' + style.preBad + '/* // ERROR //\\n' +
					'" + (result.error.stack || require("util").inspect(result.error)) + "\\n*/' + style.post + '"\n' +
				': ""' +
			') + "') +
			'\\n\\n// Tests ' +
				'failed: " + (result.failed > 0 ? "' + style.preBad + '" : "") + result.failed + "' + style.post + ', ' +
				'passed: " + (result.failed > 0 ? "" : "' + style.preGood + '") + result.passed + "' + style.post + ', ' +
				'out of " + result.tested + " tests" + (result.untested > 0 ? " ' + style.preUntested + '(" + result.untested + " untested)' + style.post + '" : "") + " //' +
		'";\n' +
		'return { render: render, renderFull: renderFull, detected: result.detected, failed: result.failed, passed: result.passed, tested: (result.failed + result.passed), untested: result.untested, error: result.error, log: result.log };'
	);
	fs.writeFileSync(__dirname + "/renderer", render);
	
	try {
		return new Function("require,result", render)(require, result);
	}
	finally {
		fs.unlink(__dirname + "/renderer");
	}
}

if (typeof module !== "undefined") { module.exports = test; }
