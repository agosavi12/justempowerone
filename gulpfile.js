const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");

//sass
gulp.task("sass", function (done) {
  return gulp
    .src("./src/sass/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(cssnano())
    .pipe(sourcemaps.write("."))
    .pipe(
      rename(function (path) {
        if (!path.extname.endsWith(".map")) {
          path.basename += ".min";
        }
      })
    )
    .pipe(gulp.dest("./dist/css"));
  done();
});

// javascript
gulp.task("javascript", function (done) {
  return gulp
    .src([
      "./src/js/*jquery.min.js",
      "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
    ])
    .pipe(concat("bundle.js"))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("./dist/js"));
  done();
});

// image optimisation
gulp.task("imagemin", function (done) {
  return gulp
    .src("./src/img/**/*.+(png|jpg|jpeg|gif|svg)")
    .pipe(cache(imagemin()))
    .pipe(gulp.dest("./dist/img/"));
  done();
});

// watch sass with browseer sync
gulp.task("watch", function () {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });

  gulp
    .watch(
      [
        "./src/sass/**/*.scss",
        "**/*.html",
        "./src/js/**/*.js",
        "./src/img/**/*.+(png|jpg|jpeg|gif|svg)",
      ],
      gulp.series(["sass", "javascript", "imagemin"])
    )
    .on("change", browserSync.reload);
});

gulp.task("clear-cache", function (done) {
  return cache.clearAll(done);
});

// gulp default
gulp.task("default", gulp.series(["watch"]));
