import { NativeScriptConfig } from '@nativescript/core'

export default {
  id: 'org.nativescript.app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    id: 'com.softwarekstatt.hashtagbuddy',
  },
  ios: {
    id: 'com.hashtagbuddy.instagramtipstricks',
  },
  appPath: 'src',
} as NativeScriptConfig
