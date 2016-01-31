var fs = 0//require("fs");
var module_test = require("../module.js");
function testRun(test) {
	var run = false, tested = false;
	var newSrc = module_test(function() {
		"string /// \""
		'string/// \''
		// comment / /// test ignored /
		/* multi-line comment * /// test ignored * */
		
		/// a === 1; /// single test
		/*/
		a === 1; /// multi test
		/*/
		
		run = true;
		/// tested = true;
	}, test);
	fs && fs.appendFileSync("./testRun-output.js", newSrc+"\n\n\n");
	eval("(" + newSrc + ")()");
	
	return (test ? (!run && tested) : (run && !tested));
}

var expect = require("./expect.js");
expect("test = null; should run module", testRun());
expect("should run module", testRun(false));
expect("should run tests", testRun(false));

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