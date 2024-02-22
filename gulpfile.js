const { src, dest, series, parallel, watch } = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  pug = require('gulp-pug'),
  plumber = require('gulp-plumber'),
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  htmlmin = require('gulp-htmlmin'),
  jsmin = require('gulp-jsmin'),
  sync = require('browser-sync').create();

const pathIn = './src/pug/index.pug'
const pathOut = './src'


function sassCompiler() {
  sync.init({
    server: './src'
  })
  watch(['./src/*.html', './src/scss/*.scss', './src/js/*.js']).on('change', sync.reload)

  watch('./src/scss/style.scss', { delay: 300 }, () => {
    return src('./src/scss/style.scss')
      .pipe(plumber())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        cascade: false,
        browsers: ['last 10 version']
      }))
      .pipe(cssmin())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest('./src/css/'))
  })
}
exports.sassCompiler = sassCompiler;

function pagAndSass() {
  sync.init({
    server: './src'
  })
  watch([
    './src/*.html',
    './src/js/*.js',
    './src/scss/*.scss',
    './src/pug/*.pug',
    './src/css/*.css',
  ]).on('change', sync.reload)

  watch('./src/scss/style.scss', { delay: 300 }, () => {
    return src('./src/scss/style.scss')
      .pipe(plumber())
      .pipe(sass().on('error', sass.logError))
      .pipe(
        autoprefixer({
          cascade: false,
          browsers: ['last 10 version'],
        })
      )
      .pipe(cssmin())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest('./src/css/'))
  })
  
  watch(pathIn, { delay: 300 }, () => {
    return src(pathIn).pipe(pug({})).pipe(dest(pathOut))
  })

}
exports.pagAndSass = pagAndSass;


function htmlMinifyToDist() {
  return src('./src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('./dist/'))
}
function replaceCssToDist() {
  return src('./src/css/*.css')
    .pipe(dest('./dist/css/'))
}
function jsMinifyToDist() {
  return src('./src/js/*.js')
    .pipe(jsmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('./dist/js/'))
}
function replaceImgsToDist() {
  return src('./src/img/**')
    .pipe(plumber())
    .pipe(dest('./dist/img/'))
}
function replaceProjectLogo() {
  return src('./src/*.ico')
    .pipe(plumber())
    .pipe(dest('./dist/'))
}

exports.dist = series(htmlMinifyToDist, replaceCssToDist, jsMinifyToDist, replaceImgsToDist, replaceProjectLogo);