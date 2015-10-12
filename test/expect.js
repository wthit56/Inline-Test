var expect = module.exports = function expect(message, pass) {
	expect.log(
		indent +
		(pass ? expect.style.pass + "/" : expect.style.fail + "X") + expect.style.reset +
		" " + (message || (pass ? "(pass)" : "(fail)"))
	);
	
	if (!pass) {
		require("fs").appendFileSync("test-failed.txt", message+"\n\n");
	}
	
	if (pass) { expect.results.passed++; }
	else { expect.results.failed++; }
	expect.results.total++;
	
	return pass;
};
expect.style = {
	pass: "\x1b[1m\x1b[32m",
	fail: "\x1b[1m\x1b[31m",
	reset: "\x1b[0m"
};
expect.results = { passed: 0, failed: 0, total: 0, reset: function() {
	expect.results.passed = expect.results.failed = expect.results.total = 0;
} };

var indent = "";
expect.group = function(message, grouped) {
	// TODO: add partial running support	
	expect.log(indent + "# " + message);
	indent += expect.group.indent;
	grouped();
	indent = indent.substr(expect.group.indent.length);
};
expect.group.indent = "  ";
expect.log = console.log;
