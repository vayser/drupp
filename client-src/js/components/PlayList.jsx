var React = require("react"),
  request = require("superagent"),
  Router = require("react-router");

var PlayList = React.createClass({
    mixins: [ Router.State ],
    getInitialState () {
        return {
            playList: {
                tracks: []
            }
        }
    },
    componentDidMount () {
        var {id} = this.getParams()
        request
            .get(`http://localhost:8080/playlists/${id}`)
            .withCredentials()
            .end((res) => {
                if (res.body.result) {
                    this.setState({
                        playList: res.body.result
                    })
                }
            });
    },
    render: function() {
        var tracks = this.state.playList.tracks.map(track => {
            return <li>{track.artist} - {track.title}</li>
            });

        return (
            <div className="PlayList">
                <div>{this.state.playList.title}</div>
                <ul>
                    {tracks}
                </ul>
            </div>
        );
    }
});


module.exports = PlayList