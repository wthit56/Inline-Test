try {
	module.exports = require("util").inspect;
}
catch(error) {
	module.exports = JSON.stringify;
}