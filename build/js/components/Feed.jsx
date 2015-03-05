"use strict";

var React = require("react");

var Feed = React.createClass({
	displayName: "Feed",

	render: function render() {
		return React.createElement(
			"div",
			{ className: "Feed" },
			"Imma Feed"
		);
	}
});

module.exports = Feed;