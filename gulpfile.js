const gulp = require("gulp");
const typescript = require("gulp-typescript");
const del = require("del");
const path = require("path");

const project = typescript.createProject("tsconfig.json");

gulp.task("default", ["transpile"]);

gulp.task("transpile", async () => {
	await del(["./bin/**/*.*"]);
		
	gulp.src("./src/**/*.js")
		.pipe(gulp.dest("bin/"));

	gulp.src("./src/**/*.json")
		.pipe(gulp.dest("bin/"));

	gulp.src("./src/**/*.ts")
		.pipe(project())
		.pipe(gulp.dest("bin/"));
});