"use strict";

var React = require("react/addons"),
    Router = require("react-router"),
    Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,
    NotFoundRoute = Router.NotFoundRoute,
    RouteHandler = Router.RouteHandler;

var App = require("./components/App.jsx"),
    Home = require("./components/Home.jsx"),
    Login = require("./components/Login.jsx"),
    Explore = require("./components/Explore.jsx"),
    PlayList = require("./components/PlayList.jsx"),
    PlayLists = require("./components/PlayLists.jsx"),
    AddPlaylist = require("./components/AddPlaylist.jsx");

var routes = React.createElement(
    Route,
    null,
    React.createElement(
        Route,
        { path: "/", handler: App },
        React.createElement(Route, { name: "home", path: "home", handler: Home }),
        React.createElement(Route, { name: "login", path: "login", handler: Login }),
        React.createElement(Route, { name: "explore", path: "explore", handler: Explore }),
        React.createElement(Route, { name: "show-playlist", path: "playlist/:id", handler: PlayList }),
        React.createElement(Route, { name: "playlists", path: "playlists", handler: PlayLists }),
        React.createElement(Route, { name: "add-playlist", path: "add-playlist", handler: AddPlaylist }),
        React.createElement(DefaultRoute, { handler: Home })
    ),
    React.createElement(NotFoundRoute, { handler: Home })
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(React.createElement(Handler, null), document.body);
});