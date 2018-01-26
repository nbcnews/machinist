const publishStory = require('./gulp-tasks/publish-story')
const publishAssets = require('./gulp-tasks/publish-assets')

module.exports.assets = (config) => {
  publishAssets(config)()
}

module.exports.story = (config) => {
  publishStory(config)()
}
