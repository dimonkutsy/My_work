'use strict';

let gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    plumber = require("gulp-plumber"),
    cssmin = require("gulp-cssmin"),
    jsmin = require("gulp-uglify"),
    notify = require("gulp-notify"),
    reload = browserSync.reload;

let path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    dev: {
        html: 'dev/',
        js: 'dev/js/',
        css: 'dev/css/',
        img: 'dev/img/',
        fonts: 'dev/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        style: 'src/css/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: {
        build: './build',
        dev: './dev'
    }
};

let osbrowser;
if (process.platform === 'darwin') {
    osbrowser = "google chrome";
} else if (process.platform === 'win32')  {
    osbrowser = "chrome";
}

let config = {
    server: {
        baseDir: "./dev"
    },
    browser: osbrowser,
    //browser: "firefox",
    //browser: "safari",
    host: 'localhost',
    notify: false,
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean.dev, cb);
    rimraf(path.clean.build, cb);
});


//dev tasks
gulp.task('html:dev', function () {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.dev.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:dev', function () {
    return gulp.src(path.src.js)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dev.js))
        .pipe(reload({stream: true}));
});

gulp.task('css:dev', function () {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded' , sourceMap: true}).on("error", notify.onError()))
        .pipe(prefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dev.css))
        .pipe(browserSync.stream());
});

gulp.task('image:dev', function () {
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.dev.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:dev', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dev.fonts))
});

gulp.task('dev',
    gulp.parallel(
        'html:dev',
        'js:dev',
        'css:dev',
        'fonts:dev',
        'image:dev')
);


//build tasks
gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(jsmin())
        .pipe(gulp.dest(path.build.js))
});

gulp.task('css:build', function () {
    return gulp.src(path.src.style)
        .pipe(plumber())
        .pipe(sass({
            includePaths: ['src/css/'],
        }))
        .pipe(cssmin())
        .pipe(prefixer())
        .pipe(gulp.dest(path.build.css))
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build',
    gulp.parallel(
    'html:build',
    'js:build',
    'css:build',
    'fonts:build',
    'image:build')
);

gulp.task('watch', function() {
    gulp.watch([path.watch.style], gulp.parallel('css:dev'));
    gulp.watch([path.watch.js], gulp.parallel('js:dev'));
    gulp.watch([path.watch.html], gulp.parallel('html:dev'));
    gulp.watch([path.watch.img], gulp.parallel('image:dev'));
    gulp.watch([path.watch.fonts], gulp.parallel('fonts:dev'));
});
gulp.task('default', gulp.parallel('dev', 'webserver', 'watch'));
