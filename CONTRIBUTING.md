## Content Updates

*If you need more detailed instructions and explanations look at [./README.md](README.md)*

### Setup env vars:
- setup env vars
```sh
cp .env.example .env
```
- then acquire AWS keys and add to `.env` file

#### Edit story meta data:
- edit the meta data for the story via `./config.yml`

Atom users can:
```sh
atom ./config.yml
```

VS Code users can:
```sh
code ./config.yml
```

#### Edit story content:

- Edit story contents in either the Google Doc or Dropboxpaper document that is set in `./config.yml`

- To pull down edits:
```sh
npm run doc-ingest
```
- will update `./src/data/models/googledoc.json` and/or `./src/data/models/dropboxpaper.json`
- the model for the published story is set in the YAML frontmatter in `./src/embed.html`
- the model for the local environment story is set in the YAML frontmatter in `./src/index.html` (will most likely be the same as the `embed.html`)

#### Publishing updates to S3
- build & publish
```sh
npm run publish
```

- acquire and enter the production flag
- confirm publish
