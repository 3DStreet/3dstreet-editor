# 3DStreet Editor

An editor tool for 3DStreet scenes.

## License and Source
* This 3DStreet Editor repo is made available under the [AGPL 3.0 License](LICENSE).
* The editor is a fork of the [A-Frame Inspector]() available under its own license terms. Subsequent changes to this editor repo are Copyright 2022 3DStreet LLC and made available for your use under the [AGPL 3.0 License](LICENSE).

## Local Development

```bash
git clone https://github.com/3DStreet/3dstreet-editor.git
cd 3dstreet-editor
npm install
npm run start:dev
```

Then navigate to __[http://localhost:3333/](http://localhost:3333/)__

## Deployment instructions

* Ensure you have .env.production in /config/ (see /config/README.md)
* `npm run dist`
* `npm run prefirebase`
* `cd public`
* `firebase use [PROJECT]` // ensure PROJECT matches target environment
* `firebase deploy`