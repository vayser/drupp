"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Promise = require("bluebird"),
    _ = require("lodash");

var VKClass = (function () {
    function VKClass() {
        _classCallCheck(this, VKClass);
    }

    _prototypeProperties(VKClass, null, {
        getPhotoUploadServer: {
            value: function getPhotoUploadServer(album_id, group_id) {
                return new Promise(function (resolve, reject) {
                    VK.Api.call("photos.getUploadServer", { album_id: album_id, group_id: group_id }, function (res) {
                        if (res.response) {
                            return resolve(res.response.upload_url);
                        } else {
                            return reject(res.error);
                        }
                    });
                });
            },
            writable: true,
            configurable: true
        },
        getAid: {
            value: function getAid() {
                var albums, druppAlbum, aid;
                return new Promise(function (resolve, reject) {
                    VK.Api.call("photos.getAlbums", { owner_id: 88930274 }, function (res) {
                        if (albums = res.response) {
                            druppAlbum = _.find(albums, { title: "Drupp Playlists Covers" });
                            if (druppAlbum) {
                                aid = druppAlbum.aid;
                                return resolve(aid);
                            } else {
                                VK.Api.call("photos.createAlbum", {
                                    title: "Drupp Playlists Covers"
                                }, function (res) {
                                    aid = res.aid;
                                    return resolve(aid);
                                });
                            }
                        }
                    });
                });
            },
            writable: true,
            configurable: true
        }
    });

    return VKClass;
})();

module.exports = new VKClass();