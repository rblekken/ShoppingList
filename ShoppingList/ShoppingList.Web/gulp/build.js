'use strict';

var gulp = require('gulp');
var bower = require('gulp-bower');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
}); 

gulp.task('partials', function () {
  return gulp.src([
    paths.src + '/{app,components}/**/*.html',
    paths.tmp + '/{app,components}/**/*.html'
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'app'
    }))
    .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: paths.tmp + '/partials',
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var configFilter = $.filter('web*.config');
  var assets;

  return gulp.src(paths.tmp + '/serve/*.html')
      .pipe($.inject(partialsInjectFile, partialsInjectOptions))
      .pipe(assets = $.useref.assets())
      .pipe($.rev())
      .pipe(jsFilter)
      .pipe($.ngAnnotate())
      .pipe($.uglify({ preserveComments: $.uglifySaveLicense }))
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
      .pipe($.replace('../bootstrap/fonts', 'fonts'))
      .pipe($.csso())
      .pipe(cssFilter.restore())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(htmlFilter)
      .pipe($.minifyHtml({
          empty: true,
          spare: true,
          quotes: true
      }))
      .pipe(htmlFilter.restore())
      .pipe(gulp.dest(paths.dist + '/'))
      .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('images', function () {
    return gulp.src(paths.src + '/assets/images/**/*')
    .pipe(gulp.dest(paths.dist + '/assets/images/'));
});

gulp.task('bower_images', function () {
    return gulp.src('bower_components/**/*.png')
    .pipe($.flatten())
    .pipe(gulp.dest(paths.dist + '/images/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('fontawesome', function () {
    return gulp.src('bower_components/font-awesome/fonts/*.{eot,svg,ttf,woff}')
     .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('i18n', function () {
    return gulp.src('bower_components/angular-i18n/angular-locale_*.js')
     .pipe($.uglify({ preserveComments: $.uglifySaveLicense }))
     .pipe(gulp.dest(paths.dist + '/angular/i18n/'));
});

gulp.task('moment', function () {
    return gulp.src('bower_components/moment/locale/{nb,sv}.js')
     .pipe($.uglify({ preserveComments: $.uglifySaveLicense }))
     .pipe(gulp.dest(paths.dist + '/angular/moment/'))
     .pipe(gulp.dest(paths.src + '/components/moment/'));
});

gulp.task('iis', function () {
    return gulp.src(['web.config', 'robots.txt'])
     .pipe(gulp.dest(paths.dist));
});

gulp.task('misc', function () {
    return gulp.src([
        paths.src + '/**/*.ico',
        paths.src + '/**/*.json'
    ])
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/**/*', paths.tmp + '/'], done);
});

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('./bower_components'));
});

gulp.task('build', ['html', 'images', 'bower_images', 'fonts', 'fontawesome', 'misc', 'i18n']);
