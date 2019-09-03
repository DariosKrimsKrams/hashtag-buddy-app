# Instap App

Welcome to the repository of the Instaq App for **Android** & **iOS**. This app is a side-project of mine about uploading photos to find the most relevant hashtags for **Instagram**.

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
  * used AccessModifier & datatypes
  * shared components & dto's
  * RESTful API
  * LocalStorage

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
```

## Install dependencies

```
npm i -g nativescript@latest
npm i tns-core-modules@latest
tns platform add android/ios
```

Update Instruction

```
tns info
npm i -g nativescript@latest
npm i tns-core-modules@latest
tns update
tns platform clean android/ios
```
More detailed infos: https://docs.nativescript.org/releases/upgrade-instructions

