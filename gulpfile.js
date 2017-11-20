require('dotenv').config({silent: true})

const fs = require('fs')
const gulp = require('gulp')
const yaml = require('js-yaml')
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'))

// TODO: use 'require-dir', at some point
const buildTasks = require('./gulp-tasks/build')
const publishStory = require('./gulp-tasks/publish-story')
const publishAssets = require('./gulp-tasks/publish-assets')

gulp.task('rewriteAssetPath', buildTasks.rewriteAssetPath(config))
gulp.task('md5Assets', buildTasks.md5Assets)
gulp.task('copyAssets', buildTasks.copyAssets)
gulp.task('combineJson', buildTasks.combineJson(config))

gulp.task('publish-cdnassets', publishAssets(config))
gulp.task('publish-dist-s3', publishStory(config))
