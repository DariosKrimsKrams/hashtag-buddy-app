# Instap App

[![DeepScan grade](https://deepscan.io/api/teams/4787/projects/6535/branches/55183/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=4787&pid=6535&bid=55183)
[![](https://github.com/dariodomide/instaq-app/workflows/TSLint/badge.svg)](https://github.com/DarioDomiDE/instaq-app/actions?query=workflow%3ATSLint)
[![](https://github.com/dariodomide/instaq-app/workflows/NativeScript%20Build%20Android/badge.svg)](https://github.com/DarioDomiDE/instaq-app/actions?query=workflow%3A%22NativeScript+Build+Android%22)

Welcome to the repository of the Instaq App for **Android** & **iOS**. This app is my side-project about helping people to find the most relevant hashtags for **Instagram**.

![](https://lh3.googleusercontent.com/UorfLyAg3i91YgbDioeiURsL6EsFWBGs_BF7Nsxck4rq5PYbXkv7KCKgmC069hTTXzI=s180-rw)

## Links 
  * [Play Store](https://play.google.com/store/apps/details?id=com.innocliq.instaq)
  * App Store (coming soon)

## Features

  * Native Mobile App
  * Optimized for iOS & Android
  * build with NativeScript 6+
  * using Angular 8+
  * TSLint
  * SCSS Support
  * used AccessModifier & datatypes everywhere
  * shared components & dto's
  
## Plugins
  * Image Gallery
  * LocalStorage
  * I18n
  * IAP

## Installation

Follow [NativeScript Setup Guide](https://docs.nativescript.org/start/ns-setup-win) for installing NativeScript requirements to build and run NativeScript apps like this one.

Afer NativeScript installation is complete run:

```
npm i
tns platform add android/ios
```

To ensure code quality, run tslint using following command:

```
npm run tslint
```

run on device with

```
tns run Android/iOS
tns build Android --copy-to instaq.apk
tns run Android
```

## Dependencies

### Install

```
npm i -g nativescript@latest
npm i tns-core-modules@latest
tns platform remove android
tns platform add android
tns platform remove ios
tns platform add ios
```

### Update Instruction

```
tns info
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
