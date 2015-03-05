var React = require("react/addons"),
    Router = require("react-router"),
    Link = Router.Link,
    _ = require("lodash"),
    vk = require("../vk"),
    config = require("../config"),
    RouteHandler = Router.RouteHandler;

var App = React.createClass({
    componentDidMount () {
        vk.getPhotoUploadServer(config.VK_ALBUM_ID, config.VK_GROUP_ID)
        .then(url => {
            console.log(url);
        })
        .catch(err => {
            console.log(err);
        });
    },
    render: function() {
        var navbarStyle = {"marginBottom": "100px;"};
        var navStyle = {"padding": "10px"};

        return (
            <div className="App">
                <div style={navbarStyle}>
                    <Link style={navStyle} to="login">Login</Link>
                    <Link style={navStyle} to="home">Home</Link>
                    <Link style={navStyle} to="explore">Explore</Link>
                    <Link style={navStyle} to="playlists">Playlists</Link>
                    <Link style={navStyle} to="add-playlist">Add playlist</Link>
                </div>
                
                <RouteHandler {...this.props} />
            </div>
        );
    }
});

module.exports = App