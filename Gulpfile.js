var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var g = require("gulp-load-plugins")();
var root = require("path").normalize(__dirname);
var browserify = require('browserify');
var reactify = require('reactify');


destFolder = "dist";

var SRC_LIB = "client-src"

var DEST = {
    JS: destFolder + "/js",
    CSS: destFolder + "/css",
    FONTS: destFolder + "/fonts",
    IMG: destFolder + "/img"
}

gulp.task("babel", function () {
  return gulp.src([SRC_LIB + "/**/*.js", SRC_LIB + "/**/*.jsx"])
    .pipe(g.babel())
    .on('error', function(data){
        console.log(data.message);
        this.emit("end");
    })
    .pipe(gulp.dest("build"));
});

gulp.task('browserify', ["babel"], function() {
    var b = browserify();
    b.add("./build/js/app.js")
    return b.bundle()
        .pipe(source("app.js"))
        .pipe(gulp.dest(DEST.JS));
});

gulp.task("less", function () {
    gulp.src(root + "/" + SRC_LIB + "/less/app.less")
    .pipe(g.sourcemaps.init())
    .pipe(g.less({
        // plugins: [autoprefix, cleancss],
        paths: [root]
    }))
    .on('error', console.error.bind(console))
    .pipe(g.sourcemaps.write())
    .pipe(gulp.dest(DEST.CSS))
});

gulp.task('connect', function() {
    g.connect.server({
        root: root,
        fallback: "index.html",
        livereload: true,
        port: 3000
    });
});

gulp.task('live-reload', function () {
    gulp.src([root + '/*.html'])
    .pipe(g.connect.reload());
});

gulp.task('watch', function () {
    liveReloadFiles = [root + '/**/*.html', root + "/" + DEST.CSS + "/app.css", root + "/" + DEST.JS + "/app.js"]

    gulp.watch(liveReloadFiles, ['live-reload'])
    gulp.watch([root + "/" + SRC_LIB + "/less/**/*.less"], ['less'])
    gulp.watch([root + "/" + SRC_LIB + "/**/*.js", root + "/" + SRC_LIB + "/**/*.jsx"], ['browserify'])
});

gulp.task('default', ['connect', 'less', 'browserify', 'watch']);
