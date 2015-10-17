if (typeof require === "undefined") {
	if (!XMLHttpRequest) { // shim
		// ...
	}
	
	require = (function() {
		var cache = {};
		
		function require(name) {
			if (name in cache) {
				if (cache[name].error) { throw cache[name].error; }
				else { return cache[name].exports; }
			}
			else if (this.completed === undefined) {
				return require.call({
					completed: false,
					original: name,
					trying: name, tryingStage: "start",
					exports: {}
				});
			}
			else if (this.completed) {
				if (this.error) {
					cache[this.original] = cache[this.trying] = { error: this.error };
					throw this.error;
				}
				else {
					cache[this.original] = cache[this.trying] = { filename: this.trying, exports: this.exports };
					return this.exports;
				}
			}
			else {
				if (this.tryingStage !== "start") {
					cache[this.trying] = { error: "Cannot find module '" + this.trying + "'" };
				}
				
				switch (this.tryingStage) {
					case "start": this.trying = this.original; this.tryingStage = "original"; break;
					case "original": this.trying = this.original + "/index.js"; this.tryingStage = "original/index.js"; break;
					case "original/index.js": this.trying = this.original + ".js"; this.tryingStage = "original.js"; break;
					case "original.js": this.completed = true; this.error = "Could not load module '" + this.original + "'."; return require.call(this);
				}
				return get(this);
			}
		}
		require.throw = false;

		function get(options) {
			var xhr = new XMLHttpRequest();
			xhr.responseType = "";
			xhr.open("GET", options.trying, false);
			xhr.send();
			
			if (xhr.status === 200) { // good
				var module = { exports: {} };
				new Function("module,require", xhr.responseText)(module, require);
				
				options.completed = true;
				options.exports = module.exports;
			}
			else { // bad
				require.call(options);
			}

			return require.call(options);
		}
		
		return require;
	})();
}