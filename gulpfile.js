// build core
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// scripts
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var tslint = require('gulp-tslint');
var trimlines = require('gulp-trimlines');

// styles
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');

// fonticon
var fontIcon = require("gulp-font-icon");
var htmlGen = fontIcon.htmlGen;

// pages & templates
var nunjucksRender = require('gulp-nunjucks-render');

// utils
var del = require('del');
var gulpif = require('gulp-if');
var minimist = require('minimist');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

// environments and options
var environments = {
	dev: 'development',
	pro: 'production'
}
var defaultOptions = {
	string: 'env',
	default: { env: process.env.NODE_ENV || environments.dev }
}
var options = minimist(process.argv.slice(2), defaultOptions);

// lint task
gulp.task('lint', function() {
	return gulp.src('src/ts/*.ts')
	.pipe(trimlines())
	.pipe(tslint({
		formatter: "stylish",
		"no-trailing-whitespace": true
	}))
	.pipe(tslint.report());
});

// scripts task
gulp.task('scripts', ['lint'], function() {
	var libs = [
		'src/js/vendor/modernizr.min.js',
		'src/js/vendor/jquery.lazyload.js',
		'src/js/vendor/jquery.scrollmagic.js',
		'src/js/vendor/jquery.shareSelectedText.js',
		'src/js/vendor/jquery.lazyload.youtube.js',
		'src/js/vendor/jquery.easy-autocomplete.min.js',
		'src/js/vendor/jquery.waypoints.min.js',
		'src/js/vendor/jquery.counterup.min.js',
		'src/js/vendor/parsley.min.js',
		'src/js/vendor/underscore.min.js',
		//'src/js/vendor/bodymovin.lottie.min.js',
		'src/js/custom.js'
	]; 

	if (options.env == environments.dev) {
		libs.splice(3, 0, 'src/js/vendor/jquery.scrollmagic.debug.addIndicators.js');
	}

	gulp.src(libs)
	.pipe(sourcemaps.init())
	.pipe(concat('custom-mvc.js'))
	.pipe(rename('custom-mvc.js'))
	.pipe(gulpif(options.env == environments.pro, uglify()))
	.pipe(gulpif(options.env == environments.dev, sourcemaps.write('/')))
	.pipe(gulp.dest('dist/assets/js/')); 

	browserify({basedir: './', debug: true})
	.add('src/ts/scripts.ts')
	.plugin(tsify, {project: "src/ts/tsconfig.json"})
	.bundle()
	.on('error', function(error) {console.error(error.toString());})
	.pipe(source('app-mvc.js'))
	.pipe(buffer())
	.pipe(gulpif(options.env == environments.pro, uglify()))
	.pipe(gulp.dest('dist/assets/js/'))
	.pipe(reload({stream: true}));
});



// scripts-forms task
gulp.task('scripts-forms', ['lint'], function() {
	var libsForms = [
		'src/js/vendor/autosize.min.js',
		'src/js/vendor/jquery.modal.js',
		'src/js/vendor/jquery.idle.js',
		'src/js/vendor/jquery.ui.date.picker.min.js',
		'src/js/forms/auto-complete.js',
		'src/js/forms/timeout.js',
		'src/js/forms/master.js',
		'src/js/forms/postcode.js',
		'src/js/forms/calendar.js',
		'src/js/products/cpr-search.js',
		'src/js/products/justgiving-api.js'
	];
  
	gulp.src(libsForms)
	.pipe(sourcemaps.init())
	.pipe(concat('forms-mvc.js'))
	.pipe(rename('forms-mvc.js'))
	.pipe(gulpif(options.env == environments.pro, uglify()))
	.pipe(gulpif(options.env == environments.dev, sourcemaps.write('/')))
	.pipe(gulp.dest('dist/assets/js/'))
	.pipe(reload({stream: true}));

});


// styles task
gulp.task('styles', function() {
	return gulp.src('src/sass/styles.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(gulpif(options.env == environments.dev, sourcemaps.write()))
		.pipe(rename('styles-mvc.css'))
		.pipe(gulpif(options.env == environments.pro, cleanCSS({compatibility: 'ie9'})))
		.pipe(gulp.dest('dist/assets/css/'))
		.pipe(reload({stream: true}));
});

// styles [legacy] task
// custom selected styles for legacy site export
gulp.task('styles-legacy', function() {
	return gulp.src('src/sass/styles-legacy.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(gulpif(options.env == environments.dev, sourcemaps.write()))
		.pipe(rename('styles-legacy.css'))
		.pipe(gulpif(options.env == environments.pro, cleanCSS({compatibility: 'ie9'})))
		.pipe(gulp.dest('dist/assets/css/'))
		.pipe(reload({stream: true}));
});


// images task
gulp.task('images', function() {
	return gulp.src('src/images/**/*.{jpg,jpeg,png,gif,svg}')
	.pipe(gulp.dest('dist/assets/img/'))
	.pipe(reload({stream: true}));
});

gulp.task("fonticon", function() {
	const options = {
		fontName: "bhf_icons",
		fontAlias: "bhfi",
		normalize: true,
		fontHeight: 1001,
		prependUnicode: true,
		centerHorizontally: true
	};

	return gulp.src(["src/icons/*.svg"])
		.pipe(htmlGen(options))
		.pipe(fontIcon(options))
		.pipe(rename(function(filePathBits) {
			filePathBits.basename = filePathBits.basename.replace(/.*-/, '');
			return filePathBits;
		}))
		.pipe(gulp.dest("dist/assets/fonts/"))
		.pipe(reload({stream: true}));
});

gulp.task("fonts", function() {
	return gulp.src('src/sass/fonts/*')
	.pipe(gulp.dest('dist/assets/fonts/'))
	.pipe(reload({stream: true}));
});

// html task
gulp.task('pages', function() {
	return gulp.src('src/pages/*.html')
	.pipe(nunjucksRender({
		path:['src/components/']
	}))
	.pipe(gulp.dest('dist/'))
	.pipe(reload({stream: true}));
});

// build dist
gulp.task('build', function(cb) {
	// runSequence(['styles', 'styles-legacy', 'scripts', 'images', 'pages'], cb);
	runSequence(['styles', 'styles-legacy', 'scripts', 'scripts-forms', 'images', 'pages'], ``);
});

// server the distribution
gulp.task('serve', ['pages'], function() {
	browserSync.init(null, {
		server: {
			baseDir: "dist/"
		},
		online: true
	});
});

// watch task
gulp.task('watch', ['serve'], function() {
	//gulp.watch('src/js/custom.js', ['scripts']);
	gulp.watch(['src/ts/**/*.ts', 'src/ts/**/*.tsx', 'src/js/*.js', 'src/js/**/*.js'], ['scripts']);
	gulp.watch('src/js/**/*.js', ['scripts-forms']);
	gulp.watch('src/sass/**/*.scss', ['styles']);
	gulp.watch('src/sass/**/*.scss', ['styles-legacy']);
	gulp.watch('src/images/**/*', ['images']);
	gulp.watch(['src/components/*.njk', 'src/components/**/*.njk', 'src/components/**/**/*.njk', 'src/pages/*.html'], ['pages']);
	gulp.watch('src/icons/*.svg', ['fonticon']);
	gulp.watch('src/sass/fonts/*', ['fonts']);
});

// clean up
gulp.task('clean', function() {
	del.sync(['dist/', 'tmp/']);
});

// default task
gulp.task('default', ['clean', 'lint', 'scripts', 'scripts-forms', 'fonticon', 'fonts', 'styles', 'images', 'serve', 'watch']);
