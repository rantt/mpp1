var gulp = require('gulp'),
    request = require('request'),
    fs = require('fs'),
    nodemon = require('gulp-nodemon'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');
    usemin = require('gulp-usemin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    htmlmin = require('gulp-htmlmin'),
    rev = require('gulp-rev'),
    rsync = require('gulp-rsync'),
    browserSync = require('browser-sync');

// // Copy or Rename rsync-config.json.example to rsync-config.json
// // and add your servers settings for rsync
// var config = require('./rsync-config.json');

// Start Server from src directory 
gulp.task('dev-server', function() {
    browserSync({
        server: {
            baseDir: "./src/"
        }
    });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'src/server.js',

    // watch core server file(s) that require server restart on change
    watch: ['src/server.js']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});



gulp.task('server', ['nodemon'], function() {
  browserSync.init({
    files: ['src/*.js','src/public/*','src/public/css/*'],
    proxy:  "http://localhost:3000",
    port: 8080,
    browser: ['google chrome']
  });
});


// Start Server from dist directory 
gulp.task('dist-server', function() {
    browserSync({
        server: {
            baseDir: "./dist/"
        }
    });
});


//Download Phaser and Phaser.debug plugin
gulp.task('init',['get-phaser', 'get-debug']);

gulp.task('get-phaser', function () {
  request('https://raw.github.com/photonstorm/phaser/master/build/phaser.min.js').pipe(fs.createWriteStream('src/public/js/lib/phaser.min.js'));
  request('https://raw.github.com/photonstorm/phaser/master/build/phaser.map').pipe(fs.createWriteStream('src/public/js/lib/phaser.map'));
});

gulp.task('get-debug', function() {
  request('https://github.com/englercj/phaser-debug/releases/download/v1.1.0/phaser-debug.js').pipe(fs.createWriteStream('src/public/js/lib/phaser-debug.js'));
});

// Clear out dist directory
gulp.task('clean', function(cb) {
  del('dist/**', cb);
});

//Copy Assets
gulp.task('copy',['clean'], function(){
  gulp.src(['assets/atlas/*','assets/fonts/*', 'assets/maps/*', 'assets/audio/*', 'js/lib/phaser.*'], {cwd: './src', base: './src'})
    .pipe(gulp.dest('./dist/'));
  gulp.src('screenshots/*').pipe(gulp.dest('./dist/screenshots/'));
});

// Concatenate & Minify JS/CSS/HTML
gulp.task('build',['copy', 'imagemin'], function () {
  return gulp.src('./src/index.html')
    .pipe(usemin({
      css: [cssnano()],
      html: [htmlmin({collapseWhitespace: true})],
      js: [uglify(), rev()]
    }))
    .pipe(gulp.dest('dist/'));
});

//Compress Images
gulp.task('imagemin', function () {
  return gulp.src('src/assets/images/*.png')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/assets/images/'));
});

//Lint Task
gulp.task('lint', function() {
  return gulp.src(['gulpfile.js', 'src/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// WatchFiles For Changes
gulp.task('watch', function() {
  gulp.watch(['src/js/*.js','src/index.html'], ['lint', browserSync.reload]);
});

// Deploy Source to server
gulp.task('deploy', function() {
  return gulp.src('dist')
    .pipe(rsync({
      root: 'dist',
      username:  config.rsync.username,
      hostname:  config.rsync.hostname,
      destination:  config.rsync.destination,
      recursive: true,
      clean: true,
      progress: true,
      incremental: true
    }));
});

gulp.task('default', ['server', 'watch']);

