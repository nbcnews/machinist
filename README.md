# Machinist - {{projectName}}

An opinionated boilerplate for storytelling.

- [Metalsmith](http://www.metalsmith.io/)
- [Handlebars](http://handlebarsjs.com/)
- [StandardJS](https://github.com/feross/standard)
- [Sass](https://github.com/sass/sass)
- [Stylelint Standard](https://github.com/stylelint/stylelint-config-standard)
- [Webpack](https://github.com/christophercliff/metalsmith-webpack)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [HTMLHint](https://github.com/yaniswang/HTMLHint)
- [Editorconfig](http://editorconfig.org/)

## Features

- Add structured data globally in JSON or YAML in the `./src/globaldata/`
- Add structured data to a specific Markdown file by adding in the frontmatter `model: file_name.json`, with `file_name.json` living in `./src/models/`

## Requirements

- [node.js](https://nodejs.org/en/)

## How to Setup

### 1. Clone

```
git clone https://github.com/nbcnews/machinist.git
```

### 2. Install Dependencies

```
$ npm install
```
### 3. Configure Project

Edit the `./config.json` as you see fit.

```json
{
  "name": "Person or Org",
  "title": "Global Title",
  "titleSeperator": "|",
  "domain": "blank.org",
  "url": "http://blank.org",
  "description": "Global Description",
  "keywords": null,
  "dest": "./www/",
  "src": "./src/",
  "assetPath": {
    "development": "/",
    "stage": "/",
    "production": "/"
  },
  "googleVerification": null,
  "analytics": {
    "provider": false,
    "google": {
      "trackingId": "GA-######"
    }
  },
  "twitter": {
    "username": "@username"
  },
  "facebook": {
    "username": null,
    "appId": null,
    "publisher": null
  },
  "openGraph": {
    "image": null
  },
  "googleDocJson": {
    "fileId": "<Google Doc ID>",
    "output": "./src/data/models/googledoc.json"
  }
}
```

#### Google Doc Data

To get the latest content from the Google Doc.

```
npm run doc-ingest
```

#### Publishing

To push to s3 put your s3 credientials in `./env`

## How to use

### Develop

Runs your project locally at `localhost:3000` with BrowserSync. Edit contents of `./layouts`, `./lib`, `./partials`, and `./src`.

```
npm run dev
```

Develop with Metalsmith debugging.

```
npm run debug
```

 

### Build

Generates your dist to be deployed in the folder `./www`.

```
npm run build
```

### Publish

Generates your dist be deployed and publishes the dist to s3.

```
npm run publish
```

### Lint

Lints your styles, scripts, and markup.

```
npm run lint
```

### Format

Fix lint errors in your styles and scripts.

```
npm run format
```

## Helpful Packages

- https://github.com/sachinchoolur/lightGallery (NBC News Digital has a license)
- https://github.com/c3js/c3
- https://github.com/sachinchoolur/lightslider
- https://github.com/sjwilliams/scrollstory
- https://github.com/imakewebthings/waypoints
- https://github.com/d3/d3
