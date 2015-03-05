var Promise = require("bluebird"),
    _ = require("lodash");

class VKClass {
    getPhotoUploadServer (album_id, group_id) {
        return new Promise((resolve, reject) => {
            VK.Api.call('photos.getUploadServer', {album_id, group_id}, (res) => {
                if (res.response) {
                    return resolve(res.response.upload_url);
                } else {
                    return reject(res.error);
                }
            });
        });
    }

    getAid () {
        var albums, druppAlbum, aid;
        return new Promise((resolve, reject) =>{
            VK.Api.call('photos.getAlbums', {owner_id: 88930274}, (res) => {
                if (albums = res.response) {
                    druppAlbum = _.find(albums, {title: "Drupp Playlists Covers"});
                    if (druppAlbum) {
                        aid = druppAlbum.aid;
                        return resolve(aid);
                    } else {
                        VK.Api.call("photos.createAlbum", {
                            title: "Drupp Playlists Covers"
                        }, (res) => {
                            aid = res.aid;
                            return resolve(aid);
                        });
                    }
                }
            }); 
        });
    }
}

module.exports = new VKClass;