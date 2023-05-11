# firebase-tools deploy error

This repo is a minimal example to show the firebase deploy error.

## To test
1. Change --project mailvideo-test to your project name in package.json
2. Run `pnpm build-deploy`
3. Notice that it works.
4. Change firebase-tools to 12.0.0 or later in package.json
5. Run `pnpm build-deploy`
6. Notice that it fails with the following error:

```
Error: Failed to find location of Firebase Functions SDK. Please file a bug on Github (https://github.com/firebase/firebase-tools/).
```

Note: It will also fail when cd into `app/dist` and run
```
firebase deploy --only functions:hello_world --project {projectName}
```
I thought if you ran firebase without pnpm prefix it would use the global firebase-tools, but it doesn't seem to work that way.