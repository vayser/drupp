"use strict";

var React = require("react"),
    request = require("superagent"),
    Router = require("react-router");

var PlayList = React.createClass({
    displayName: "PlayList",

    mixins: [Router.State],
    getInitialState: function getInitialState() {
        return {
            playList: {
                tracks: []
            }
        };
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        var _getParams = this.getParams();

        var id = _getParams.id;

        request.get("http://localhost:8080/playlists/" + id).withCredentials().end(function (res) {
            if (res.body.result) {
                _this.setState({
                    playList: res.body.result
                });
            }
        });
    },
    render: function render() {
        var tracks = this.state.playList.tracks.map(function (track) {
            return React.createElement(
                "li",
                null,
                track.artist,
                " - ",
                track.title
            );
        });

        return React.createElement(
            "div",
            { className: "PlayList" },
            React.createElement(
                "div",
                null,
                this.state.playList.title
            ),
            React.createElement(
                "ul",
                null,
                tracks
            )
        );
    }
});

module.exports = PlayList;