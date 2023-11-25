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

Note: If you are deploying to a development server and want to use development (not production) firebase credentials, you'll need to copy your .env.development credentials to .env.production for the `npm run dist` step to ensure the output dist build uses the intended keys. (In other words, when running npm run dist it always uses firebase app credentials from .env.production, so be careful not to mistakingly deploy production firebase keys to a development server.)

## Release checklist (for Editor only)

* after the above deployment instructions works on dev server (not deploy to production server yet)
* bump the version on package.json & package-lock.json (for example from 0.4.1 to 0.4.2)
* Use command line to create new tag for new version `git tag 0.4.2` and `git push --tags`
* Make sure all of the above is committed and pushed to the repo
* Then do production deployment following above instructions with .env.production environment
* Create a new GitHub release here: https://github.com/3DStreet/3dstreet-editor/releases/new. Choose the tag you used above. (If needed for the title simply use the new version such as "1.1" or "1.1.0")
* Click to automatically "generate release notes." Consider summarizing a few key changes to put at the top.
* Update CHANGELOG.md with a quick summary of the auto generated release notes under the "Major improvement" heading.
