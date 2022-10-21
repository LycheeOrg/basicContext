var name = require("./package.json").moduleName,
	fs = require("fs"),
	gulp = require("gulp"),
	plugins = require("gulp-load-plugins")();
sass = require("gulp-sass")(require("sass"));

var head = fs.readFileSync("./node_modules/@electerious/modulizer/head.js", {
		encoding: "utf8",
	}),
	foot = fs.readFileSync("./node_modules/@electerious/modulizer/foot.js", {
		encoding: "utf8",
	});

var catchError = function (err) {
	console.log(err.toString());
	this.emit("end");
};

gulp.task("styles", function () {
	gulp
		.src("./src/styles/main.scss")
		.pipe(sass().on("error", catchError))
		.on("error", catchError)
		.pipe(plugins.concat(name + ".min.css", { newLine: "\n" }))
		.pipe(plugins.autoprefixer("last 2 version", "> 1%"))
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest("./dist"));

	gulp
		.src("./src/styles/themes/*.scss")
		.pipe(sass().on("error", catchError))
		.on("error", catchError)
		.pipe(
			plugins.rename(function (path) {
				path.basename += ".min";
			})
		)
		.pipe(plugins.autoprefixer("last 2 version", "> 1%"))
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest("./dist/themes"));

	return gulp
		.src("./src/styles/addons/*.scss")
		.pipe(sass().on("error", catchError))
		.on("error", catchError)
		.pipe(
			plugins.rename(function (path) {
				path.basename += ".min";
			})
		)
		.pipe(plugins.autoprefixer("last 2 version", "> 1%"))
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest("./dist/addons"));
});

gulp.task("scripts", function () {
	return gulp
		.src("./src/scripts/*.js")
		.pipe(plugins.header(head, { name: name }))
		.pipe(plugins.footer(foot))
		.pipe(plugins.babel())
		.on("error", catchError)
		.pipe(plugins.concat(name + ".min.js", { newLine: "\n" }))
		.pipe(plugins.uglify())
		.on("error", catchError)
		.pipe(gulp.dest("./dist"));
});

gulp.task("default", gulp.series(gulp.parallel("styles", "scripts")));

gulp.task("watch", gulp.series("default"), function () {
	gulp.watch("./src/styles/**/*.scss", ["styles"]);
	gulp.watch("./src/scripts/**/*.js", ["scripts"]);
});
