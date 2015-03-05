var React = require('react/addons'),
  Router = require('react-router'),
  Route = Router.Route,
  DefaultRoute = Router.DefaultRoute,
  NotFoundRoute = Router.NotFoundRoute,
  RouteHandler = Router.RouteHandler;

var App  = require("./components/App.jsx"),
  Home  = require("./components/Home.jsx"),
  Login  = require("./components/Login.jsx"),
  Explore  = require("./components/Explore.jsx"),
  PlayList  = require("./components/PlayList.jsx"),
  PlayLists  = require("./components/PlayLists.jsx"),
  AddPlaylist  = require("./components/AddPlaylist.jsx");

var routes = (
    <Route>
        <Route path="/" handler={App}>
            <Route name="home" path="home" handler={Home} />
            <Route name="login" path="login" handler={Login} />
            <Route name="explore" path="explore" handler={Explore} />
            <Route name="show-playlist" path="playlist/:id" handler={PlayList} />
            <Route name="playlists" path="playlists" handler={PlayLists} />
            <Route name="add-playlist" path="add-playlist" handler={AddPlaylist} />
            <DefaultRoute handler={Home} />
        </Route>

        <NotFoundRoute handler={Home} />

    </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler />, document.body);
});
