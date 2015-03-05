var React = require("react"),
    Router = require("react-router"),
    request = require("superagent"),
    _ = require("lodash"),
    cookies = require("cookies-js");

window.jQuery = window.$ = require("jquery");
require("typeahead.js");
require("../bootstrap-tagsinput");

var TagsInput = React.createClass({
    componentDidMount () {
        this.input = $(this.getDOMNode())

        var tagsStorage = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("value"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 20,
            remote: "http://localhost:8080/autocomplete/tags?q=%QUERY"
        });

        tagsStorage.initialize();

        this.input.tagsinput({
            typeaheadjs: {
                name: 'name',
                displayKey: 'name',
                valueKey: 'name',
                source: tagsStorage.ttAdapter()
            }
        });

        this.input.on("itemAdded", e => {
            this.props.onItemAdded(this.input.tagsinput("items"));
        });

        this.input.on("itemRemoved", e => {
            this.props.onItemRemoved(this.input.tagsinput("items"));
        });

    },
    render () {
        return (
            <input type="text" data-role="tagsinput" />
        )
    }
});

var SearchBox = React.createClass({
    utilize (str) {
        var pattern = /\((.*?)\)|\[(.*?)\]|\{(.*?)\}/gi;
        return str.replace(pattern, "")
    },

    componentDidMount () { 
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
            displayKey (item) {
                return self.utilize(item.artist) + 
                    " - " + self.utilize(item.title);
            }
        });

        if (this.props.track.id) {
            this.input.typeahead(
                "val",
                this.utilize(this.props.track.artist) + " - " +
                this.utilize(this.props.track.title)
            );
        }

        this.input.on("typeahead:selected", (e, track) => {
            this.props.onSelect(track);
        });
    },
    
    componentWillUnmount () {
        // this.input.typeahead('destroy');
    },

    onResetHandler () {
        this.input.typeahead("val", "");
        this.props.onReset(this.props.inputName);
    },

    render: function(){
        var resetButton = <a className="typeahead__reset" href="#" onClick={this.onResetHandler}> x</a>

        if (!this.props.track.id) {
            resetButton = null;
        }

        return (
            <div className="typeahead">
                <input 
                    type="search"
                    ref={this.props.inputName}
                    className="form-control typeahead__input"
                    placeholder="search" />
                {resetButton}                
            </div>
        );
    }
});

var AlbumCover = React.createClass({
    hadleVKPhotoUploadClick () {
        $('#upload').on('click', function() {
            var file_data = $('#sortpicture').prop('files')[0];   
            var form_data = new FormData();                  
            form_data.append('file', file_data)
            alert(form_data);                             
            $.ajax({
                url: 'upload.php', // point to server-side PHP script 
                dataType: 'text',  // what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,                         
                type: 'post',
                success: function(php_script_response){
                    alert(php_script_response); // display response from the PHP script, if any
                }
             });
        });
    },
    render: function() {
        return (
            <div>
                <div>
                    <a href="#">from Instagram</a>
                    <br/>
                    <a href="#">From disc</a>
                    <br/>
                    <a href="#">from url</a>
                </div>
                <div>Preview here</div>
            </div>  
        );
    }
});

var AddPlaylist = React.createClass({
    getInitialState () {
        return {
            title: "Default title",
            tracks: [
                {cid:"cid-" + this.uid++}
            ]
        }
    },

    getTotalTime () {
        return _.reduce(this.state.tracks, (sum, track) => {
            return sum + (+track.duration || 0);
        }, 0);
    },

    uid: 0,

    tags: [],

    mixins: [ Router.Navigation ],

    handleTrackAdd (trackId, track) {
        var tracks = this.state.tracks;

        var existingTrack = _.find(tracks, track => {
            return track.cid === trackId || track.id === trackId;
        });

        if (existingTrack) {
            existingTrack = _.extend(existingTrack, track);
        } else {
            tracks.push(track);
        }

        var needLastInput = _.every(this.state.tracks, track => {
            return !!track.id;
        });

        if (needLastInput) {
            tracks.push({cid: "cid-" + this.uid++});
        }

        this.setState({tracks});
    },

    handleTrackRemove (trackId) {
        var tracks = _.filter(this.state.tracks, track => {
            return track.id != trackId;
        });

        this.setState({tracks})
    },

    handleTagsChange (tags) {
        this.tags = tags;
    },

    handleSubmit (e) {
        e.preventDefault();

        var tracks = _.filter(this.state.tracks, track => {
            return !!track.id
        });

        var data = {
            tracks: tracks,
            title: this.state.title,
            tags: this.tags
        };

        request
            .post("http://localhost:8080/playlist/" + cookies.get("access_token"))
            .send(data)
            .withCredentials()
            .end((res) => {
                this.transitionTo("playlists");
            });
    },

    handleTitleChange (e) {
        this.setState({title: e.target.value});
    },

	render () {
        var trackInputs = this.state.tracks.map((track, index) => {
            var id = track.id || track.cid;
            return (
                <div key={id}  className="form-group">
                    <SearchBox track={track} onReset={this.handleTrackRemove.bind(this, track.id)} onSelect={this.handleTrackAdd.bind(this, track.cid || track.id)} />
                </div>
            )
        });

		return (
			<div className="AddPlaylist container">
                <form onSubmit={this.handleSubmit} >
                    <div className="col-sm-8 col-sm-offset-2 form-group step">
                        <span className="step__number">1</span>
                        <input className="form-control input-lg" type="text" name="title" value={this.state.title} onChange={this.handleTitleChange} />
                    </div>  

                    <div className="col-sm-3 col-sm-offset-2 step">
                        <span className="step__number">2</span>
                        <AlbumCover />
                    </div>

                    <div className="col-sm-5 form-group step">
                        <span className="step__number">3</span>
                        <textarea className="form-control" placeholder="Describe your playlist">
                        </textarea>
                    </div>  

                    <div className="col-sm-5 col-sm-offset-5 form-group step">
                        <span className="step__number">4</span>
                        <TagsInput onItemRemoved={this.handleTagsChange} onItemAdded={this.handleTagsChange} className="form-control" />
                    </div>  

                    <div className="col-sm-8 col-sm-offset-2 step">
                        <span className="step__number">5</span>
                        {trackInputs}

                        <div>
                            Track total time {Math.floor(this.getTotalTime() / 60)} min {this.getTotalTime() % 60} sec
                        </div>

                        <input className="btn btn-success" type="submit" value="Save" />

                    </div>  


                </form>
            </div>
		);
	}
});

module.exports = AddPlaylist