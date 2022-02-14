var gulp = require("gulp");
// var ts = require("gulp-typescript");
// var tsProject = ts.createProject("tsconfig.json");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var fancy_log = require("fancy-log");
var paths = {
    pages: ["src/*.html"],
};

var watchedBrowserify = watchify(
    browserify({
      basedir: ".",
      debug: true,
      entries: ["src/main.ts"],
      cache: {},
      packageCache: {},
    }).plugin(tsify)
);

function bundle() {
    return watchedBrowserify
      .bundle()
      .on("error", fancy_log)
      .pipe(source("bundle.js"))
      .pipe(gulp.dest("dist"));
}

// ----------- tasks -----------

gulp.task("copy-html", function () {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

gulp.task("default", gulp.series(gulp.parallel("copy-html"), bundle));
// browserify will run the bundle function every time one of your TypeScript files changes
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);