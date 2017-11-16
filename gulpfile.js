require('dotenv').config({silent: true})

const fs = require('fs')
const gulp = require('gulp')
const yaml = require('js-yaml')
const awspublish = require('gulp-awspublish')
const rename = require('gulp-rename')
const log = require('log-utils')
const assertClean = require('git-assert-clean')
const inlineImagePath = require('gulp-rewrite-image-path')
const md5 = require('gulp-md5-plus')
const prompt = require('gulp-prompt')
const filter = require('gulp-filter')
const jsoncombine = require('gulp-jsoncombine')
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'))

const SIM = false

const awsStoryConfig = {
  bucketName: process.env.BUCKET_NAME,
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}

const awsAssetsConfig = {
  bucketName: process.env.ASSETS_BUCKET_NAME,
  region: process.env.ASSETS_AWS_DEFAULT_REGION,
  accessKeyId: process.env.ASSETS_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.ASSETS_AWS_SECRET_ACCESS_KEY
}

const yearString = config.projectInitDate.year
const monthString = config.projectInitDate.month
const configProjectNameProp = config.projectName
const convertedProjectName = configProjectNameProp.replace(/\s+/g, '-').toLowerCase()
const objectsLocation = `/machinist/dist/${yearString}/${monthString}/${convertedProjectName}/`
const publishedCdnMsg = `Published to: http://s3-${awsAssetsConfig.region}.amazonaws.com/${awsAssetsConfig.bucketName}/cdnassets/projects/`
const publishedStoryMsg = `Published to: http://s3-${awsStoryConfig.region}.amazonaws.com/${awsStoryConfig.bucketName}${objectsLocation}`

function cleanStaging () {
  assertClean(function (err) {
    if (err) {
      throw new Error(`${log.error} Please commit changes before publishing.`)
    }
  })
}

function checkProjectInitDate () {
  const reYear = new RegExp('^[12][0-9]{3}$')
  const reMonth = new RegExp('^(1[0-2]|0[1-9])$')

  if (!reYear.test(yearString) || typeof yearString !== 'string' || typeof monthString !== 'string' || !reMonth.test(monthString)) {
    throw new Error(`${log.error} Please enter the project initial year as YYYY (ex. "2017") and month as MM (ex. "01")`)
  }

  if (!config.projectInitDate.year || !config.projectInitDate.month) {
    throw new Error(`${log.error} You must supply projectInitDate with Year and Month in ./config.json`)
  }
}

gulp.task('publish-assets', function () {
  const publisherAssets = awspublish.create({
    region: awsAssetsConfig.region,
    params: {Bucket: awsAssetsConfig.bucketName},
    accessKeyId: awsAssetsConfig.accessKeyId,
    secretAccessKey: awsAssetsConfig.secretAccessKey,
    httpOptions: { timeout: 300000 }
  })

  const gzipFilter = filter(['cdnassets/**/*.{txt,csv,json,js,css}'], {restore: true})

  return gulp.src('cdnassets/**/*.{jpg,png,gif,mp3,ogg,flac,mp4,mov,avi,webm,zip,rar,webp,txt,csv,json,pdf}')
    .pipe(rename(function (path) {
      path.dirname = `/cdnassets/projects/${yearString}/${monthString}/${convertedProjectName}/${path.dirname}`
    }))
    .pipe(gzipFilter)
    .pipe(awspublish.gzip())
    .pipe(gzipFilter.restore)
    .pipe(publisherAssets.publish({}, {simulate: SIM, createOnly: true}))
    .pipe(publisherAssets.cache())
    .pipe(awspublish.reporter(''))
    .on('finish', function () {
      log.ok(publishedCdnMsg)
    })
})

gulp.task('publish-story', function () {
  const publisherStory = awspublish.create({
    region: awsStoryConfig.region,
    params: {Bucket: awsStoryConfig.bucketName},
    accessKeyId: awsStoryConfig.accessKeyId,
    secretAccessKey: awsStoryConfig.secretAccessKey,
    httpOptions: { timeout: 300000 }
  })
  cleanStaging()
  checkProjectInitDate()
  return gulp.src([
    config.dest + '/**',
    '!' + config.dest + '/**/*.{ai,html,jsx}'
  ])
    .pipe(prompt.confirm('Publish to production?'))
    .pipe(rename(function (path) {
      path.dirname = objectsLocation + path.dirname
    }))
    .pipe(publisherStory.publish({}, {simulate: SIM}))
    .pipe(publisherStory.sync(`machinist/dist/${yearString}/${monthString}/${convertedProjectName}`))
    .pipe(awspublish.reporter(''))
    .on('finish', function () {
      log.ok(publishedStoryMsg)
    })
})

gulp.task('md5Assets', function () {
  gulp.src('./assets/*.{jpg,png,gif,svg}')
    .pipe(md5(10, '.tmp/assets/*.html'))
    .pipe(gulp.dest('.tmp/assets'))
})

gulp.task('copyAssets', function () {
  gulp.src('.tmp/assets/**')
    .pipe(gulp.dest('./www/assets/'))
})

gulp.task('rewriteAssetPath', function () {
  gulp.src('./assets/*.html')
    .pipe(inlineImagePath({
      path: `${config.assetPath.domain}/machinist/dist/${yearString}/${monthString}/${convertedProjectName}`
    }))
    .pipe(gulp.dest('.tmp/assets'))
})

gulp.task('combineJson', function () {
  gulp.src([
    config.dest + '/embed.json',
    config.dest + '/styles/main.json'
  ])
  .pipe(jsoncombine('remoteData.json', function (data) {
    const result = {}

    result.embed = data.embed
    result.styles = data.main

    return Buffer.from(JSON.stringify(result))
  }))
  .pipe(gulp.dest(config.dest))
})
