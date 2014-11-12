var fs = require('fs');
var path = require('path');

var JsonStore = function(uri) {
	this.uri = uri;
	if (fs.existsSync(this.uri)) {
		var data = fs.readFileSync(this.uri, 'utf8');
		this.data = data.length
			? JSON.parse(data)
			: {};
	} else {
		this.data = {}
	};
};

JsonStore.prototype.persist = function() {
	var json = JSON.stringify(this.data);
	var uri = path.resolve(__dirname, this.uri);
	fs.writeFileSync(this.uri, json);
};

module.exports = JsonStore;