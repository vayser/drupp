"use strict";

var React = require("react/addons"),
    Router = require("react-router"),
    Link = Router.Link,
    _ = require("lodash"),
    vk = require("../vk"),
    config = require("../config"),
    RouteHandler = Router.RouteHandler;

var App = React.createClass({
    displayName: "App",

    componentDidMount: function componentDidMount() {
        vk.getPhotoUploadServer(config.VK_ALBUM_ID, config.VK_GROUP_ID).then(function (url) {
            console.log(url);
        })["catch"](function (err) {
            console.log(err);
        });
    },
    render: function render() {
        var navbarStyle = { marginBottom: "100px;" };
        var navStyle = { padding: "10px" };

        return React.createElement(
            "div",
            { className: "App" },
            React.createElement(
                "div",
                { style: navbarStyle },
                React.createElement(
                    Link,
                    { style: navStyle, to: "login" },
                    "Login"
                ),
                React.createElement(
                    Link,
                    { style: navStyle, to: "home" },
                    "Home"
                ),
                React.createElement(
                    Link,
                    { style: navStyle, to: "explore" },
                    "Explore"
                ),
                React.createElement(
                    Link,
                    { style: navStyle, to: "playlists" },
                    "Playlists"
                ),
                React.createElement(
                    Link,
                    { style: navStyle, to: "add-playlist" },
                    "Add playlist"
                )
            ),
            React.createElement(RouteHandler, this.props)
        );
    }
});

module.exports = App;