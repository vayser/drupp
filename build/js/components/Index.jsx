"use strict";

var React = require("react");

var Index = React.createClass({
	displayName: "Index",

	render: function render() {
		return React.createElement(
			"div",
			{ className: "Index" },
			"Imma index"
		);
	}
});
module.exports = Index;