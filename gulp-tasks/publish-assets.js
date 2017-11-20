const gulp = require('gulp')
const awspublish = require('gulp-awspublish')
const rename = require('gulp-rename')
const log = require('log-utils')
const filter = require('gulp-filter')
// const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'))

const SIM = false

// AWS config for generic NBC News CDN, nodeassets.nbcnews.com
// TODO: only use env vars for secret keys
const awsConfig = {
  bucketName: process.env.ASSETS_BUCKET_NAME,
  region: process.env.ASSETS_AWS_DEFAULT_REGION,
  accessKeyId: process.env.ASSETS_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.ASSETS_AWS_SECRET_ACCESS_KEY
}

// Pushes the contents in ./cdnassets to nodeassets.nbcnews.com which is the generic CDN for NBC News
function publish (config) {
  return function () {
    const initDate = config.projectInitDate
    const dashedProjectName = config.projectName.replace(/\s+/g, '-').toLowerCase()
    const publisherAssets = awspublish.create({
      region: awsConfig.region,
      params: {Bucket: awsConfig.bucketName},
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      httpOptions: { timeout: 300000 }
    })

    const publishMsg = `Published to: http://s3-${awsConfig.region}.amazonaws.com/${awsConfig.bucketName}/cdnassets/projects/`
    const gzipFilter = filter(['cdnassets/**/*.{txt,csv,json,js,css}'], {restore: true})

    return gulp.src('cdnassets/**/*.{jpg,png,gif,mp3,ogg,flac,mp4,mov,avi,webm,zip,rar,webp,txt,csv,json,pdf}')
      .pipe(rename(function (path) {
        path.dirname = `/cdnassets/projects/${initDate.year}/${initDate.month}/${dashedProjectName}/${path.dirname}`
      }))
      .pipe(gzipFilter)
      .pipe(awspublish.gzip())
      .pipe(gzipFilter.restore)
      .pipe(publisherAssets.publish({}, {simulate: SIM, createOnly: true}))
      .pipe(publisherAssets.cache())
      .pipe(awspublish.reporter(''))
      .on('finish', function () {
        log.ok(publishMsg)
      })
  }
}

module.exports = publish
