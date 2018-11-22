// Gulp stuff
const gulp      = require('gulp');
const replace   = require('gulp-replace');
const minify    = require('gulp-minify');
const fs        = require('fs');
const recursive = require("recursive-readdir");
const sequence  = require('run-sequence');
const Promise   = require('bluebird');

const dir   = 'lib/methods/';
const regex = /require\('(.*)'\);/g;

/**
 * REPLACE CODE WITH FILE CONTENT
 * @param match
 * @param group
 * @return {XML|void|*|string}
 */
const read = (match, group) => {
  // methods are auto generated
  const root = (group === 'methods') ? './tmp' : './lib';
  // Read the content of the file
  const data = fs.readFileSync(`${root}/${group}.js`, 'utf8');
  // Since we are writing it all as modules
  return data.replace('module.exports = ', '');
};

/**
 * PARSE ALL METHODS FROM LIB
 * @type {string}
 */
let method_data = '';

function set_method_data () {
  return new Promise(function (resolve, reject) {
    recursive(dir, (err, files) => {
      const methods = {};
      // `files` is an array of file paths
      files.forEach(file => {
        // Get the file contents
        let content = fs.readFileSync(file, 'utf8');

        const start_string = 'module.exports =';
        const start_pos = content.indexOf(start_string) + start_string.length;

        content = content.substr(start_pos).trim();

        // Since we are writing it all as modules
        file = file.replace(dir, '').replace('.js', '');
        // Object path to method
        const paths  = file.split('/');
        // method name
        const name   = paths.pop();

        let key = '';
        for (let i = 0; i < paths.length; i++) {
          key = `${key}.${paths[i]}`;
          // Skip if this key is already defined
          if (methods.hasOwnProperty(key)) {
            continue;
          }
          methods[`modules${key}`] = `{};`;
        }

        const method = `${key}.${name}`;

        methods[`modules${method}`] = `${content};`;
      });

      // Final content
      for (const prop in methods) {
        method_data = `${method_data}\n${prop} = ${methods[prop]}`;
      }
      resolve();
    });
  });
}



/**
 * GULP TASKS
*/
gulp.task('set_method_data', set_method_data);

gulp.task('methods', () => {
  // Generate methods.js
  return gulp.src(['./lib/methods.js'])
    .pipe(replace('[[MODULES]]', method_data))
    .pipe(gulp.dest('tmp/'));
});

gulp.task('parse', () => {
  return gulp.src(['./api.js'])
    // Replace test module
    .pipe(replace(regex, read))
    .pipe(gulp.dest('tmp/'));
});

gulp.task('plain', () => {
  return gulp.src(['./tmp/api.js'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('min', () => {
  return gulp.src(['./tmp/api.js'])
    // Minify the result
    .pipe(minify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('dev', (callback) => sequence('set_method_data', 'methods', 'parse', 'plain', callback));
gulp.task('default', (callback) => sequence('set_method_data', 'methods', 'parse', 'min', callback));
