var React = require("react"),
    Router = require("react-router"),
    Link = Router.Link,
    request = require("superagent");

var PlayLists = React.createClass({
    getInitialState () {
        return {
            playLists: []
        };
    },
    componentDidMount () {
        request
            .get("http://localhost:8080/playlists")
            .withCredentials()
            .end((res) => {
                if (res.body.result) {
                    this.setState({
                        playLists: res.body.result
                    });
                }
            });
    },
    render: function() {
        var playLists = this.state.playLists.map((playList, index) => {
            return (
                <div key={index}>
                    <Link style={{paddingRight: "10px"}} params={{id: playList._id}} to="show-playlist">Play</Link>
                    {playList.title}
                </div>
            )
        });

        return (
            <div className="PlayLists">
                {playLists}
            </div>
        );
    }
});

module.exports = PlayLists