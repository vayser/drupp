"use strict";

var React = require("react/addons"),
    Router = require("react-router");

var Explore = React.createClass({
	displayName: "Explore",

	render: function render() {
		return React.createElement(
			"div",
			{ className: "Explore" },
			"Imma explore page"
		);
	}
});

module.exports = Explore;