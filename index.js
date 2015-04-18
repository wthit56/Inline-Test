 var findLT = /</g, findAmp = /&/g;
 function stringify(string, style) {
	var result = string.replace(/["'\\]/g, "\\$&").replace(/\r?\n/g, "\\n");
	if (style) {
		if (style["<"]) { result = result.replace(findLT, style["<"]); }
		if (style["&"]) { result = result.replace(findAmp, style["&"]); }
	}
	return result;
}

var styles = {
	"HTML": {
		preGood: stringify('<span style="color:#0F0; font-weight:bold;">'),
		preBad: stringify('<span style="color:#F00; font-weight:bold;">'),
		preUntested: stringify('<span style="color:#99F; font-weight:bold;">'),
		post: stringify('</span>'),
		"<": "&lt;", "&": "&amp;"
	},
	"NODE": {
		preBad: "\x1b[1m\x1b[31m",
		preGood: "\x1b[1m\x1b[32m",
		preUntested: "\x1b[1m\x1b[36m",
		post: "\x1b[0m"
	}
};

function test(code, styleType) {
  var style = styles[styleType];
  
  var render = "render" + Math.random().toString().substring(2),
      failed = "failed" + Math.random().toString().substring(2),
      passed = "passed" + Math.random().toString().substring(2),
      untested = "untested" + Math.random().toString().substring(2),
      tests = "tests" + Math.random().toString().substring(2),
      error = "error" + Math.random().toString().substring(2);

  var testCount = 0;
  code = code.toString().match(/^(function\s*\S*\s*\([^)]*\)\s*\{)([\W\w]*)\}$/);
  
  var findParts = /([\W\w]*?)(?:(\/\/(?:(?!\/)|(?=\/\/))[^\r\n]*|\/\*[\W\w]*?\*\/|"[^"\\\r\n]*(?:\\[\W\w][^"\\\r\n]*)*"|'[^'\\\r\n]*(?:\\[\W\w][^'\\\r\n]*)*')|(;)([ \t]*)(\/\/\/(?!\/)[^\r\n]*)|$)/g;
  
  var testIndex = 0;
  code = 'return ' + code[1] + ('\n' +
    'var ' + failed + ' = 0, ' + passed + ' = 0, ' + untested + ' = 0, ' + tests + ' = [], ' + render + ', ' + error + ';\n\n' +
    render + ' = "";\n' +
    'try {\n' +
      code[2].replace(findParts, function(match, ignored, ignored2, testSemicolon, testSpacing, test) {
        var result = ignored + (ignored2 || "");
        if (test) {
          result += (
            '\n? (' + tests + '[' + testIndex + '] = true, ' + passed + '++) ' +
            '\n: (' + tests + '[' + testIndex + '] = false, ' + failed + '++);'
          );
          testIndex++;
        }
        return result;
      }) + '\n\n' +
      (testIndex = 0, render + ' = "' +
        code[2].replace(findParts, function(match, ignored, ignored2, testSemicolon, testSpacing, test) {
          var result = stringify(ignored + (ignored2 || ""), style);
          if (test) {
            result += (testSemicolon + testSpacing +
              '" +\n(' + tests + '[' + testIndex + '] === undefined ? (' + untested + '++, "' + style.preUntested + '") : ' +
                tests + '[' + testIndex + '] ? "' + style.preGood + '" : "' + style.preBad + '") +\n"' +
              stringify(test, style) + '" +\n' +
              '"' + style.post
            );
            testIndex++;
          }

          return result;
        }) +
		'\\n\\n// Tests ' +
			'failed: " + (' + failed + ' > 0 ? "' + style.preBad + '" : "") + ' + failed + ' + "' + style.post + ', ' +
			'passed: " + (' + failed + ' > 0 ? "" : "' + style.preGood + '") + ' + passed + ' + "' + style.post + ', ' +
			'out of " + (' + failed + ' + ' + passed + ') + " tests" + (' + untested + ' > 0 ? " ' + style.preUntested + '(" + ' + untested + ' + " untested)' + style.post + '" : "") + " //' +
        '";'
      ) + '\n' +
    '}\n' +
    'catch(error) {\n' +
		render + ' += (' + render + ' ? "\\n\\n" : "") + "' + style.preBad + '// Error: Could not continue testing.\\n' +
		'// " + (error.message || error) + "' + style.post + '";\n' +
		error + ' = error;\n' +
    '}\n' +
    'finally {\n' + tests + '.length = 0;\n' +
      'return { toString: function() { return ' + render + ' }, detected: ' + testIndex +', failed: ' + failed + ', passed: ' + passed + ', tested: (' + failed + ' + ' + passed + '), untested: ' + untested + ', error: ' + error + ' };\n' +
    '}\n};'
  );

  return new Function(code)();
}

if (typeof module !== "undefined") { module.exports = test; }
