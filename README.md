# Instap App

Welcome to the repository of the Instaq App for **Android** & **iOS**. This app is a side-project of mine about uploading photos to find the most relevant hashtags for **Instagram**.

![](https://lh3.googleusercontent.com/OZUZg7HOsBW0PnxeihHcVTGczo_EPuZkwp8DT9DdZA_AICt0q_GbLSYOFG--VlesHw=s180-rw)

## Links 
  * [Play Store](https://play.google.com/store/apps/details?id=com.innocliq.instaq)
  * App Store (coming soon)

## Features

  * NativeScript 6+
  * Angular 8+
  * Optimized for iOS & Android
  * tslint
  * scss
  * used AccessModifier & Types everywhere
  * shared components & dto's

## Installation

Follow [NativeScript Setup Guide](https://docs.nativescript.org/start/ns-setup-win) for installing NativeScript requirements to build and run NativeScript apps like this one.

Afer NativeScript installation is complete run:

```
npm i
tns platform add android/ios
```

To ensure code quality, run tslint from time to time using following command:

```
npm run tslint
```

## Publishing app

Check and install dependencies

```
tns info
npm i -g nativescript@latest
npm install tns-core-modules@latest --save
tns platform clean android/ios
```

run on device with

```
tns run android/ios
```

build with 

```
tns build Android --copy-to instaq.apk
```
