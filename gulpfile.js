"use strict";

const name = require("./package.json").moduleName;
const gulp = require("gulp");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");

const catchError = function (err) {
	console.log(err.toString());
	this.emit("end");
};

gulp.task("scripts", function () {
	return browserify({
		entries: "./src/scripts/basicContext.js",
		standalone: name,
	})
		.transform(
			babelify.configure({
				presets: ["@babel/preset-env"],
			})
		)
		.bundle()
		.on("error", catchError)
		.pipe(source(name + ".min.js"))
		.pipe(buffer())
		.pipe(uglify())
		.on("error", catchError)
		.pipe(gulp.dest("./dist"));
});

gulp.task("styles", function () {
	return gulp
		.src("./src/styles/main.scss")
		.pipe(sass())
		.on("error", catchError)
		.pipe(rename((path) => (path.basename = name + ".min")))
		.pipe(autoprefixer("last 2 version", "> 1%"))
		.pipe(csso({ restructure: false }))
		.pipe(gulp.dest("./dist"));
});

gulp.task("addons", function () {
	return gulp
		.src("./src/styles/addons/*.scss")
		.pipe(sass())
		.on("error", catchError)
		.pipe(rename((path) => (path.basename = path.basename + ".min")))
		.pipe(autoprefixer("last 2 version", "> 1%"))
		.pipe(csso({ restructure: false }))
		.pipe(gulp.dest("./dist/addons"));
});

gulp.task("themes", function () {
	return gulp
		.src("./src/styles/themes/*.scss")
		.pipe(sass())
		.on("error", catchError)
		.pipe(rename((path) => (path.basename = path.basename + ".min")))
		.pipe(autoprefixer("last 2 version", "> 1%"))
		.pipe(csso({ restructure: false }))
		.pipe(gulp.dest("./dist/themes"));
});

gulp.task(
	"default",
	gulp.series(gulp.parallel("scripts", "styles", "addons", "themes"))
);
