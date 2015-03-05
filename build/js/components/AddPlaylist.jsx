"use strict";

var React = require("react"),
    Router = require("react-router"),
    request = require("superagent"),
    _ = require("lodash"),
    cookies = require("cookies-js");

window.jQuery = window.$ = require("jquery");
require("typeahead.js");
require("../bootstrap-tagsinput");

var TagsInput = React.createClass({
    displayName: "TagsInput",

    componentDidMount: function componentDidMount() {
        var _this = this;

        this.input = $(this.getDOMNode());

        var tagsStorage = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("value"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 20,
            remote: "http://localhost:8080/autocomplete/tags?q=%QUERY"
        });

        tagsStorage.initialize();

        this.input.tagsinput({
            typeaheadjs: {
                name: "name",
                displayKey: "name",
                valueKey: "name",
                source: tagsStorage.ttAdapter()
            }
        });

        this.input.on("itemAdded", function (e) {
            _this.props.onItemAdded(_this.input.tagsinput("items"));
        });

        this.input.on("itemRemoved", function (e) {
            _this.props.onItemRemoved(_this.input.tagsinput("items"));
        });
    },
    render: function render() {
        return React.createElement("input", { type: "text", "data-role": "tagsinput" });
    }
});

var SearchBox = React.createClass({
    displayName: "SearchBox",

    utilize: function utilize(str) {
        var pattern = /\((.*?)\)|\[(.*?)\]|\{(.*?)\}/gi;
        return str.replace(pattern, "");
    },

    componentDidMount: function componentDidMount() {
        var _this = this;

        var self = this;

        this.input = $(this.getDOMNode()).find(".typeahead__input");

        var myStorage = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("value"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 20,
            remote: "http://localhost:8080/autocomplete/" + cookies.get("access_token") + "?q=%QUERY"
        });

        myStorage.initialize();

        this.input.typeahead(null, {
            source: myStorage.ttAdapter(),
            displayKey: function displayKey(item) {
                return self.utilize(item.artist) + " - " + self.utilize(item.title);
            }
        });

        if (this.props.track.id) {
            this.input.typeahead("val", this.utilize(this.props.track.artist) + " - " + this.utilize(this.props.track.title));
        }

        this.input.on("typeahead:selected", function (e, track) {
            _this.props.onSelect(track);
        });
    },

    componentWillUnmount: function componentWillUnmount() {},

    onResetHandler: function onResetHandler() {
        this.input.typeahead("val", "");
        this.props.onReset(this.props.inputName);
    },

    render: function render() {
        var resetButton = React.createElement(
            "a",
            { className: "typeahead__reset", href: "#", onClick: this.onResetHandler },
            " x"
        );

        if (!this.props.track.id) {
            resetButton = null;
        }

        return React.createElement(
            "div",
            { className: "typeahead" },
            React.createElement("input", {
                type: "search",
                ref: this.props.inputName,
                className: "form-control typeahead__input",
                placeholder: "search" }),
            resetButton
        );
    }
});

var AlbumCover = React.createClass({
    displayName: "AlbumCover",

    hadleVKPhotoUploadClick: function hadleVKPhotoUploadClick() {
        $("#upload").on("click", function () {
            var file_data = $("#sortpicture").prop("files")[0];
            var form_data = new FormData();
            form_data.append("file", file_data);
            alert(form_data);
            $.ajax({
                url: "upload.php", // point to server-side PHP script
                dataType: "text", // what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: "post",
                success: function success(php_script_response) {
                    alert(php_script_response); // display response from the PHP script, if any
                }
            });
        });
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                null,
                React.createElement(
                    "a",
                    { href: "#" },
                    "from Instagram"
                ),
                React.createElement("br", null),
                React.createElement(
                    "a",
                    { href: "#" },
                    "From disc"
                ),
                React.createElement("br", null),
                React.createElement(
                    "a",
                    { href: "#" },
                    "from url"
                )
            ),
            React.createElement(
                "div",
                null,
                "Preview here"
            )
        );
    }
});

var AddPlaylist = React.createClass({
    displayName: "AddPlaylist",

    getInitialState: function getInitialState() {
        return {
            title: "Default title",
            tracks: [{ cid: "cid-" + this.uid++ }]
        };
    },

    getTotalTime: function getTotalTime() {
        return _.reduce(this.state.tracks, function (sum, track) {
            return sum + (+track.duration || 0);
        }, 0);
    },

    uid: 0,

    tags: [],

    mixins: [Router.Navigation],

    handleTrackAdd: function handleTrackAdd(trackId, track) {
        var tracks = this.state.tracks;

        var existingTrack = _.find(tracks, function (track) {
            return track.cid === trackId || track.id === trackId;
        });

        if (existingTrack) {
            existingTrack = _.extend(existingTrack, track);
        } else {
            tracks.push(track);
        }

        var needLastInput = _.every(this.state.tracks, function (track) {
            return !!track.id;
        });

        if (needLastInput) {
            tracks.push({ cid: "cid-" + this.uid++ });
        }

        this.setState({ tracks: tracks });
    },

    handleTrackRemove: function handleTrackRemove(trackId) {
        var tracks = _.filter(this.state.tracks, function (track) {
            return track.id != trackId;
        });

        this.setState({ tracks: tracks });
    },

    handleTagsChange: function handleTagsChange(tags) {
        this.tags = tags;
    },

    handleSubmit: function handleSubmit(e) {
        var _this = this;

        e.preventDefault();

        var tracks = _.filter(this.state.tracks, function (track) {
            return !!track.id;
        });

        var data = {
            tracks: tracks,
            title: this.state.title,
            tags: this.tags
        };

        request.post("http://localhost:8080/playlist/" + cookies.get("access_token")).send(data).withCredentials().end(function (res) {
            _this.transitionTo("playlists");
        });
    },

    handleTitleChange: function handleTitleChange(e) {
        this.setState({ title: e.target.value });
    },

    render: function render() {
        var _this = this;

        var trackInputs = this.state.tracks.map(function (track, index) {
            var id = track.id || track.cid;
            return React.createElement(
                "div",
                { key: id, className: "form-group" },
                React.createElement(SearchBox, { track: track, onReset: _this.handleTrackRemove.bind(_this, track.id), onSelect: _this.handleTrackAdd.bind(_this, track.cid || track.id) })
            );
        });

        return React.createElement(
            "div",
            { className: "AddPlaylist container" },
            React.createElement(
                "form",
                { onSubmit: this.handleSubmit },
                React.createElement(
                    "div",
                    { className: "col-sm-8 col-sm-offset-2 form-group step" },
                    React.createElement(
                        "span",
                        { className: "step__number" },
                        "1"
                    ),
                    React.createElement("input", { className: "form-control input-lg", type: "text", name: "title", value: this.state.title, onChange: this.handleTitleChange })
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-3 col-sm-offset-2 step" },
                    React.createElement(
                        "span",
                        { className: "step__number" },
                        "2"
                    ),
                    React.createElement(AlbumCover, null)
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-5 form-group step" },
                    React.createElement(
                        "span",
                        { className: "step__number" },
                        "3"
                    ),
                    React.createElement("textarea", { className: "form-control", placeholder: "Describe your playlist" })
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-5 col-sm-offset-5 form-group step" },
                    React.createElement(
                        "span",
                        { className: "step__number" },
                        "4"
                    ),
                    React.createElement(TagsInput, { onItemRemoved: this.handleTagsChange, onItemAdded: this.handleTagsChange, className: "form-control" })
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-8 col-sm-offset-2 step" },
                    React.createElement(
                        "span",
                        { className: "step__number" },
                        "5"
                    ),
                    trackInputs,
                    React.createElement(
                        "div",
                        null,
                        "Track total time ",
                        Math.floor(this.getTotalTime() / 60),
                        " min ",
                        this.getTotalTime() % 60,
                        " sec"
                    ),
                    React.createElement("input", { className: "btn btn-success", type: "submit", value: "Save" })
                )
            )
        );
    }
});

module.exports = AddPlaylist;

// this.input.typeahead('destroy');