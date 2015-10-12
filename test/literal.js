module.exports = function literal(src) {
	return new Function("return " + src.toString().replace(/\/\*(([\W\w])*)\*\//, function(match, literal) {
		return 'return "' + (literal.replace(/(?:\/\\\*|\*\\\/)|(["\\])|(\n)|(\r)/g, function(match, e, n, r) {
			return (
				e ? "\\" + e :
				n ? "\\n" :
				r ? "\\r" :
					match
			);
		})) + '"';
	}))()();
};