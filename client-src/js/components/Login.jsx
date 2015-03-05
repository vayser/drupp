var React = require("react"),
    Router = require("react-router"),
    request = require("superagent"),
    cookies = require("cookies-js");
    // security = require("../security");

var Login = React.createClass({

    mixins: [ Router.State, Router.Navigation ],

    getInitialState () {
        return {
            vkAuthPageUrl: ""
        }
    },

    componentDidMount: function() {
        if (cookies.get("access_token")) {
            this.transitionTo("home");
            return
        }

        var code = this.getQuery().code

        if (code) {
            request
                .get("http://localhost:8080/auth/create-session/" + code)
                .withCredentials()
                .end((res) => {
                    console.log(res);
                    this.transitionTo("home");
                });
        } else {
            request
                .get('http://localhost:8080/auth/get-auth-dialog-url')
                .withCredentials()
                .end((res) => {
                    window.location = res.body
                });
        }
    },

    render: function() {
        return (
            <div className="Login">Imma Login</div>
        );
    }
});

module.exports = Login