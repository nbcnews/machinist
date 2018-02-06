[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Machinist

Opinionated scaffolding and static site generator for storytelling.

- [Metalsmith](http://www.metalsmith.io/)
- [Handlebars](http://handlebarsjs.com/)
- [StandardJS](https://github.com/feross/standard)
- [Sass](https://github.com/sass/sass)
- [Stylelint Standard](https://github.com/stylelint/stylelint-config-standard)
- [Webpack 3](https://github.com/webpack/webpack)
- [Babel Preset Env](https://github.com/babel/babel/tree/master/packages/babel-preset-env)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [HTMLHint](https://github.com/yaniswang/HTMLHint)
- [Editorconfig](http://editorconfig.org/)
- [ai2html](http://ai2html.org/)
- [ArchieML](http://archieml.org/)

## Quick Start

*See [Setup](#setup) for recommended local install.*

1. Install [Node.js](https://nodejs.org/) (v8.x required)
1. `npm install -g @nbcnews/machinist`
1. `machinist init <project-name>`
1. `npm i`
1. `npm run dev`
1. Visit [`http://localhost:3000`](http://localhost:3000)

## Features

- Included optional CSS/Markup/JS for story components, see `./src/data/models/story.aml`
- Add structured data globally via JSON or YAML in the `./src/globaldata/`
- Add structured data to a specific file, see [Structured Data](#structured-data)
- Google Doc to JSON using ArchieML
- Dropbox Paper to JSON using ArchieML
- An ai2html pipeline

## Setup

You can either scaffold using the globally installed Machinist or scaffold locally.

Install locally (recommended)

1. `cd` into an empty project directory
1. `npm install @nbcnews/machinist`
1. `$(npm bin)/machinist init <project-name>`
1. `npm install`

Install globally 

1. `npm install -g @nbcnews/machinist`
1. `cd` into an empty project directory
1. `machinist init <project-name>`
1. `npm install`

## How To Use

Publishing, Google Doc, and Dropbox Paper workflows require credentials in `./env`. You can copy `.env.example` and rename to `.env`.

### Develop

Runs your project locally at `localhost:3000` with [BrowserSync](https://github.com/Browsersync/browser-sync). Edit contents of `./layouts`, `./lib`, `./partials`, and `./src`.

```sh
npm run dev
```

Develop with debugging.

```sh
npm run dev:debug
```

#### Dropbox Paper Data (recommended)

Create a new Paper document.

Get the file ID from the URL. It should look like: `S7sSIlM2E0g6p3OXhhts4`. Add that as the value for `dropboxPaperJson.fileId` in `config.yml`.

To ingest the Dropbox Paper you will need to have access to it. [Generate an access token for your own account](https://blogs.dropbox.com/developers/2014/05/generate-an-access-token-for-your-own-account/) and add the token to `./env`.

```sh
npm run doc-ingest
```

#### Google Doc Data

Create a new doc or optionally duplicate the [example project](https://docs.google.com/document/d/1bj563rIzGL95pvfWORPk-4ukUhRU-GYR55QGx9emyjY/edit) on Google Docs. 

Get the file ID from the URL. It should look like: `1bj563rIzGL95pvfWORPk-4ukUhRU-GYR55QGx9emyjY`. Add that as the value for `googleDocJson.fileId` in `config.yml`. 

To ingest the Google doc you will need to have access to it. [Generate credentials](https://github.com/bradoyler/googledoc-to-json#getting-credentials) and add credentials to `./env`.

```sh
npm run doc-ingest
```

#### Structured Data

The `./data/models/` folder can have structured data written in YAML, JSON, or AML. In the front matter for the page you can add that data to the page's metadata.

Single file:

```html
----
layout: story.hbs
model: story.aml # Specify the file with your data
----

<h1>{{model.headline}}</h1>
```

Multiple files:

```html
----
layout: story.hbs
model: # Specify the files with your data
  key1: story.aml # Access by the key set
  key2: data.yaml # Access by the key set
----

<h1>{{model.key1.headline}}</h1>
<p>{{model.key2.source}}</p>
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

Build with debugging.

```sh
npm run build:debug
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

```sh
git clone https://github.com/nbcnews/machinist.git
npm install
npm run dev
```
