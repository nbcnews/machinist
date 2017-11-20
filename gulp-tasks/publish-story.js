const gulp = require('gulp')
const awspublish = require('gulp-awspublish')
const rename = require('gulp-rename')
const log = require('log-utils')
const assertClean = require('git-assert-clean')
const prompt = require('gulp-prompt')

const SIM = false

// AWS config for publishing generated story
// TODO: only use env vars for secret keys
const awsConfig = {
  bucketName: process.env.BUCKET_NAME,
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}

// Checks that there are no lingering files in stage. Safeguard that is run on `npm run publish`
function cleanStaging () {
  assertClean(function (err) {
    if (err) {
      throw new Error(`${log.error} Please commit changes before publishing.`)
    }
  })
}

// Checks that a valid project data has been added to ./config.yml
function checkProjectInitDate (config) {
  const initDate = config.projectInitDate
  const reYear = new RegExp('^[12][0-9]{3}$')
  const reMonth = new RegExp('^(1[0-2]|0[1-9])$')

  if (!reYear.test(initDate.year) || typeof initDate.year !== 'string' || typeof initDate.month !== 'string' || !reMonth.test(initDate.month)) {
    throw new Error(`${log.error} Please enter the project initial year as YYYY (ex. "2017") and month as MM (ex. "01")`)
  }

  if (!initDate.year || !initDate.month) {
    throw new Error(`${log.error} You must supply projectInitDate with Year and Month in ./config.json`)
  }
}

// Pushes the contents of ./www, the generated output, to s3 as configured in ./config.yml
// Excludes Adobe Illustrator Files, HTML and JSX which are related to the ai2html workflow
// gulp.task('publish-dist-s3')

function publish (config) {
  return function () {
    const initDate = config.projectInitDate
    const dashedProjectName = config.projectName.replace(/\s+/g, '-').toLowerCase()
    const objectsLocation = `/machinist/dist/${initDate.year}/${initDate.month}/${dashedProjectName}/`
    const publisherStory = awspublish.create({
      region: awsConfig.region,
      params: {Bucket: awsConfig.bucketName},
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      httpOptions: { timeout: 300000 }
    })
    cleanStaging()
    checkProjectInitDate(config)
    return gulp.src([
      config.dest + '/**',
      '!' + config.dest + '/**/*.{ai,html,jsx}'
    ])
      .pipe(prompt.confirm('Publish to production?'))
      .pipe(rename(function (path) {
        const objectsLocation = `/machinist/dist/${initDate.year}/${initDate.month}/${dashedProjectName}/`
        path.dirname = objectsLocation + path.dirname
      }))
      .pipe(publisherStory.publish({}, {simulate: SIM}))
      .pipe(publisherStory.sync(`machinist/dist/${initDate.year}/${initDate.month}/${dashedProjectName}`))
      .pipe(awspublish.reporter(''))
      .on('finish', function () {
        const publishMsg = `Published to: http://s3-${awsConfig.region}.amazonaws.com/${awsConfig.bucketName}${objectsLocation}`
        log.ok(publishMsg)
      })
  }
}

module.exports = publish
