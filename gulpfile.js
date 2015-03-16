/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var taskListing = require('gulp-task-listing');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tag_version = require('gulp-tag-version');

gulp.task('lint', function() {
  return gulp.src("src/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

var tddTasks = [];
var testTasks = [];

['jasmine13', 'jasmine2'].forEach(function(jasmine) {
  var karma = require('./test/' + jasmine + '/node_modules/karma/').server;
  var tddTask = 'tdd:' + jasmine;
  var testTask = 'test:' + jasmine;
  var configFile =  __dirname + '/test/' + jasmine + '/karma.conf.js';

  tddTasks.push(tddTask);
  testTasks.push(testTask);

  gulp.task(tddTask, function(done) {
    var options = {
      configFile: configFile
    };

    var onDone = function() {
      done();
    };

    karma.start(options, onDone);
  });

  gulp.task(testTask, function(done) {
    var options = {
      configFile: configFile,
      singleRun: true,
      browsers: ['PhantomJS']
    };

    var onDone = function() {
      done();
    };

    karma.start(options, onDone);
  });
});

['minor', 'major', 'patch'].forEach(function(level) {
  gulp.task('release:' + level, ['build'], function() {
    gulp.src(['./bower.json', './package.json'])

      // bump the version number in those files 
      .pipe(bump({type: level}))

      // save it back to filesystem 
      .pipe(gulp.dest('./'))

      // commit the changed version number 
      .pipe(git.commit('release: bumps package version'))
 
      // read only one file to get the version number 
      .pipe(filter('package.json'))

      // tag it in the repository
      .pipe(tag_version());
  });
});

gulp.task('release', ['release:minor']);
gulp.task('tdd', tddTasks);
gulp.task('test', testTasks);
gulp.task('build', ['lint', 'test']);
gulp.task('default', ['build']);
