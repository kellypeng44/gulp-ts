var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");

var paths = {
    pages: ["src/*.html"],
};

// ----------- tasks -----------

gulp.task("copy-html", function () {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

// creating task with the name default
gulp.task(
    "default",
    gulp.series(gulp.parallel("copy-html"), function () {
        return browserify(
            {
                basedir: ".",
                debug: true,
                entries: ["src/main.ts"],
                cache: {},
                packageCache: {},
            }
        )
        .plugin(tsify)
        .bundle()
        // source: alias for vinyl-source-stream, used to name the output bundle
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist"));
        }
    )
);