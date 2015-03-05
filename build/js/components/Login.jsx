"use strict";

var React = require("react"),
    Router = require("react-router"),
    request = require("superagent"),
    cookies = require("cookies-js");
// security = require("../security");

var Login = React.createClass({
    displayName: "Login",

    mixins: [Router.State, Router.Navigation],

    getInitialState: function getInitialState() {
        return {
            vkAuthPageUrl: ""
        };
    },

    componentDidMount: function componentDidMount() {
        var _this = this;

        if (cookies.get("access_token")) {
            this.transitionTo("home");
            return;
        }

        var code = this.getQuery().code;

        if (code) {
            request.get("http://localhost:8080/auth/create-session/" + code).withCredentials().end(function (res) {
                console.log(res);
                _this.transitionTo("home");
            });
        } else {
            request.get("http://localhost:8080/auth/get-auth-dialog-url").withCredentials().end(function (res) {
                window.location = res.body;
            });
        }
    },

    render: function render() {
        return React.createElement(
            "div",
            { className: "Login" },
            "Imma Login"
        );
    }
});

module.exports = Login;