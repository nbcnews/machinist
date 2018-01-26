[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Machinist

Opinionated scaffolding generator for storytelling.

- [Metalsmith](http://www.metalsmith.io/)
- [Handlebars](http://handlebarsjs.com/)
- [StandardJS](https://github.com/feross/standard)
- [Sass](https://github.com/sass/sass)
- [Stylelint Standard](https://github.com/stylelint/stylelint-config-standard)
- [Webpack2](https://github.com/ianrose/metalsmith-webpack2)
- [Babel Preset es2015](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015)
- [Babel Preset Stage 0](https://github.com/babel/babel/tree/master/packages/babel-preset-stage-0)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [HTMLHint](https://github.com/yaniswang/HTMLHint)
- [Editorconfig](http://editorconfig.org/)
- [ai2html](http://ai2html.org/)
- [ArchieML](http://archieml.org/)

## Quick Start

1. Install [Node.js](https://nodejs.org/) (v8.x required)
1. `npm install -g @nbcnews/machinist`
1. `machinist init <project-name>`
1. `npm i`
1. `npm run dev`
1. Visit [`http://localhost:3000`](http://localhost:3000)

## Features

- Boilerplate CSS/Markup/JS for story components
- Add structured data globally via JSON or YAML in the `./src/globaldata/`
- Add structured data to a specific Markdown file by adding in the frontmatter `model: file-name.json`, with `file-name.json` living in `./src/models/`
- Google Doc to JSON using ArchieML
- Dropbox Paper to JSON using ArchieML
- An ai2html pipeline

## Setup

First install Machinist globally `npm install -g @nbcnews/machinist`

1. `cd` into an empty project directory
1. `machinist init <project-name>`
1. `npm i`

## How To Use

Publishing, Google Doc, and Dropbox Paper workflows require credentials in `./env`. You can copy `.env.example` and rename to `.env`.

### Develop

Runs your project locally at `localhost:3000` with BrowserSync. Edit contents of `./layouts`, `./lib`, `./partials`, and `./src`.

```sh
npm run dev
```

Develop with debugging.

```sh
npm run debug
```

#### Dropbox Paper Data (recommended)

Create a new Paper document.

Get the file ID from the URL. It should look like: `S7sSIlM2E0g6p3OXhhts4`

To ingest the Dropbox Paper you will need to have access to it. [Generate an access token for your own account](https://blogs.dropbox.com/developers/2014/05/generate-an-access-token-for-your-own-account/) and add the token to `./env`.

```sh
$ npm run doc-ingest
```

#### Google Doc Data

Create a new doc or optionally duplicate the [example project](https://docs.google.com/document/d/1bj563rIzGL95pvfWORPk-4ukUhRU-GYR55QGx9emyjY/edit) on Google Docs. 

Get the file ID from the URL. It should look like: `1bj563rIzGL95pvfWORPk-4ukUhRU-GYR55QGx9emyjY`. Add that as the value for `fileId` in `googleDocJson` in `config.yml`. 

To ingest the Google doc you will need to have access to it on Google. Either it's your doc or it's been shared with you. You will need to set up your credentials [following this helpful guide](https://github.com/bradoyler/googledoc-to-json#getting-credentials). Add the Google Docs configuration to `./env`.

To ingest the latest content from the Google Doc.

```sh
$ npm run doc-ingest
```

#### ai2html Workflow

Can be changed, but by default:

- Duplicate or rename `assets/##-ai2html-machinist-template.ai` for your graphic
- Install `./assets/ai2html.jsx` for Illustrator. [Docs](http://ai2html.org/#how-to-install-ai2html)
- If you are using ArchieML for data, you can use the following to place the graphic in the story

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

### Publish assets

Publish static assets in the `cdnassets` folder, like images, videos and vendor scripts, to the CDN.

```sh
npm run publish:cdn
```

### Lint

Lints your styles, scripts, and generated markup.

```sh
npm run lint
```

### Format

Fix auto-fixable errors in your styles and scripts.

```sh
npm run format
```

## Contribute


