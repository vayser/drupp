"use strict";

var React = require("react"),
    Router = require("react-router"),
    Link = Router.Link,
    request = require("superagent");

var PlayLists = React.createClass({
    displayName: "PlayLists",

    getInitialState: function getInitialState() {
        return {
            playLists: []
        };
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        request.get("http://localhost:8080/playlists").withCredentials().end(function (res) {
            if (res.body.result) {
                _this.setState({
                    playLists: res.body.result
                });
            }
        });
    },
    render: function render() {
        var playLists = this.state.playLists.map(function (playList, index) {
            return React.createElement(
                "div",
                { key: index },
                React.createElement(
                    Link,
                    { style: { paddingRight: "10px" }, params: { id: playList._id }, to: "show-playlist" },
                    "Play"
                ),
                playList.title
            );
        });

        return React.createElement(
            "div",
            { className: "PlayLists" },
            playLists
        );
    }
});

module.exports = PlayLists;