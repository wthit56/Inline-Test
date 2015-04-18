var test = require("./index.js");
var result;

result = test(function(argument) {
argument.secret === 10; /// argument passed in
this.secret === 3; /// context preserved

"code"; /// passed test
false;  /// failed test

if (false) {
  "hidden test"; /// unreached test
}

true;   /// spaces preceeding the comment
true;		/// tabs preceeding the comment

1 === 1; /// should test 1 === 1

// regular comment
/* regular multi-line comment */

// /// test ignored, as it was commented out
/* /// test ignored, as it was commented out */
//// test ignored, as incorrect number of /s */

!false; /// should test !false

"statement without a semicolon" /// should be handled correctly

"in double-quoted strings /// tests should be ignored";
'in single-quoted strings /// tests should be ignored';

var error; try { nonexistent } catch(e) { error = e; } (error instanceof ReferenceError) ///

JSON;
}, "NODE").call(
	{ secret: 3 }, // context
	{ secret: 10 } // argument
);
console.log("/* FEATURE DEMO */\n" + result.toString());

result = test(function() {// demo
	non_existent_reference; ///
}, "NODE")();
console.log("\n\n\n/* ERROR DEMO */\n" + result.toString());
