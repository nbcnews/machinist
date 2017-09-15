[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Machinist - {{projectName}}

An opinionated boilerplate for storytelling.

- [Metalsmith](http://www.metalsmith.io/)
- [Handlebars](http://handlebarsjs.com/)
- [StandardJS](https://github.com/feross/standard)
- [Sass](https://github.com/sass/sass)
- [Stylelint Standard](https://github.com/stylelint/stylelint-config-standard)
- [Webpack2](https://github.com/ianrose/metalsmith-webpack2)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [HTMLHint](https://github.com/yaniswang/HTMLHint)
- [Editorconfig](http://editorconfig.org/)
- [ai2html](http://ai2html.org/)
- [ArchieML](http://archieml.org/)

## Features

- Common storytelling components
- Add structured data globally in JSON or YAML in the `./src/globaldata/`
- Add structured data to a specific Markdown file by adding in the frontmatter `model: file_name.json`, with `file_name.json` living in `./src/models/`
- Google Doc to JSON using ArchieML
- An ai2html pipeline
- Boilerplate CSS/Markup for story components

## Requirements

- [node.js](https://nodejs.org/en/)

## Setup

### 1. Clone

```
$ git clone https://github.com/nbcnews/machinist.git
```

### 2. Scaffold Project

Setup will run `npm install`

```sh
$ nvm use # (.nvmrc 8)
$ npm run setup new-project-name
$ npm run git-init
```

Edit the `./config.json` as you see fit.


#### Google Doc Data

Create a new doc or optionally duplicate the [example project](https://docs.google.com/document/d/1bj563rIzGL95pvfWORPk-4ukUhRU-GYR55QGx9emyjY/edit) on Google Docs. 

Get the file ID from the URL. It should look like: `1bj563rIzGL95pvfWORPk-4ukUhRU-GYR55QGx9emyjY`. Add that as the value for `fileId` in `googleDocJson` in `config.json`. 

To ingest the Google doc you will need to have access to it on Google. Either it's your doc or it's been shared with you. You will need to set up your credentials [following this helpful guide](https://github.com/bradoyler/googledoc-to-json#getting-credentials). Add the google docs configuration as `configs/config_gdocs.json`. 

To ingest the latest content from the Google Doc.

```sh
$ npm run doc-ingest
```

#### Publishing

To push to s3 put your s3 credientials in `./env`

## How to use

### Develop

Runs your project locally at `localhost:3000` with BrowserSync. Edit contents of `./layouts`, `./lib`, `./partials`, and `./src`.

```sh
npm run dev
```

Develop with Metalsmith debugging.

```sh
npm run debug
```

#### ai2html

Can be changed, but by default:

- Duplicate or Rename `assets/##-ai2html-machinist-template.ai` for your graphic
- Install `ai2html.jsx` for Illustrator. [Docs](http://ai2html.org/#how-to-install-ai2html)
- Uncomment `ai2html-resizer.js` in `src/scripts/main.js`
- If using Google Doc for data, use the following ArchieML to place the graphic in the body

```
{.ai2html}
title: Optional title
subtitle: Optional subtitle
fileName: name-of-the-ai2html.html
caption: Optional caption
source: Optional Source
{}
```

- Design and Develop
- `npm run publish` will update ai2html image paths and rev assets

### Build

Generates your dist to be deployed in the folder `./www`.

```sh
npm run build
```

### Publish

Generates your dist be deployed and publishes the dist to s3.

```sh
npm run publish
```

### Lint

Lints your styles, scripts, and markup.

```sh
npm run lint
```

### Format

Fix lint errors in your styles and scripts.

```sh
npm run format
```
