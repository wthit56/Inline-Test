var fs = 0//require("fs");
var module_test = require("../module.js");
function testRun(test) {
	var run = false, tested = false, multitested = false;
	var newSrc = module_test(function() {
		"string /// \""
		'string/// \''
		// comment / /// test ignored /
		/* multi-line comment * /// test ignored * */
		
		run = true;
		/// tested = true;
		/*/ multitested = true; /*/
	}, test);
	fs && fs.appendFileSync("./testRun-output.js", "//testRun//\n"+newSrc+"\n\n\n");
	eval("(" + newSrc + ")()");
	
	return run && (test ? tested && multitested : !tested && !multitested);
}

var expect = require("./expect.js");
expect("test = null; should run module", testRun());
expect("should run module", testRun(false));
expect("should run module and tests", testRun(true));

/*
console.log(require("../markup.js")(eval("(" + require("../index.js")(function() {

testRun(); ///
testRun(false); ///
testRun(true); ///

}) + ")()")));
*/

/*
console.log(eval("(" + require("../index.js")(function() {
	var a = 1;
	"string ///"
	'string///'
	// comment /// test ignored
	/// a === 1; /// comment

	return 2;
}) + ")()"));
*/