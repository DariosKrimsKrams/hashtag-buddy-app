# Hashtag Buddy App

[![DeepScan grade](https://deepscan.io/api/teams/4787/projects/6535/branches/55183/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=4787&pid=6535&bid=55183)
[![](https://github.com/dariodomide/instaq-app/workflows/TSLint/badge.svg)](https://github.com/DarioDomiDE/instaq-app/actions?query=workflow%3ATSLint)
[![](https://github.com/dariodomide/instaq-app/workflows/NativeScript%20Build%20Android/badge.svg)](https://github.com/DarioDomiDE/instaq-app/actions?query=workflow%3A%22NativeScript+Build+Android%22)

Welcome to the repository of the Hashtag Buddy App for **Android** & **iOS**. This app help you to find the most relevant **Instagram hashtags**. It's a Mobile App build with Nativescript to run cross-platform.

## Links 
  * [Play Store](https://play.google.com/store/apps/details?id=com.hashtagbuddy.instagramtipstricks)
  * [App Store](https://apps.apple.com/app/hashtag-buddy/id1504694810)
  * [Website](https://hashtagbuddy.app)
  * [Code Quality](https://sonarcloud.io/dashboard?id=DarioDomiDE_hashtag-buddy-app)

## Technical Details

  * Optimized for iOS & Android
  * build with NativeScript 6+
  * using Angular 8+
  * TSLint
  * SCSS
  * used AccessModifier & datatypes everywhere
  * shared components & dto's
  
## Plugins
  * Image Gallery
  * LocalStorage
  * I18n
  * IAP
  * BackgroundHttp

## Commands

### Install

Follow [NativeScript Setup Guide](https://docs.nativescript.org/start/ns-setup-win) for installing NativeScript requirements to build and run NativeScript apps like this one. After NativeScript installation is complete run:

```
npm i -g nativescript@latest
npm i tns-core-modules@latest
tns platform remove android
tns platform add android@latest
tns platform remove ios
tns platform add ios@latest
```

To ensure code quality, run tslint using following command:

```
npm run tslint
```

### Update

```
tns info
tns doctor
npm i -g nativescript@latest
npm i tns-core-modules@latest
tns update
tns platform clean android
tns plugin update
npm i nativescript-dev-webpack@latest --save-dev
./node_modules/.bin/update-ns-webpack --deps --configs
npm i nativescript-angular@latest --save
./node_modules/.bin/update-app-ng-deps
npm i
npm audit fix
```
More detailed infos on [NativeScript Upgrade Instructions](https://docs.nativescript.org/releases/upgrade-instructions) page.

### Troubleshooting

```
npm rebuild node-sass
npm i nativescript-dev-webpack --save-dev
tns update
pod repo update
sudo gem install cocopods
tns platform clean ios
tns plugin update
rm -rf node_modules
rm -rf platforms
rm package-lock.json
npm i
tns plugin remove nativescript-imagepicker
tns plugin add nativescript-imagepicker
npm dedupe
```
