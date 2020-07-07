# Black MD Cares

React Native App: How to run react native app. You must have node.js and depencies installed & use following command tools

1. npm install -g react-native-cli
2. npm install
3. react-native link
4. react-native run-android
5. react-native run-ios
6. [Generating Signed APK](https://facebook.github.io/react-native/docs/signed-apk-android)

```
   $ cd android
   $ ./gradlew assembleRelease
```

7. react-native link react-native-firebase
8. logging

```
   $ react-native log-android
   $ react-native log-ios
```

9. install Firebase in iOS

```
   pod init
   pod 'Firebase/Core'
      Podfile
      platform :ios, '9.0'
      pod 'Firebase/Core'
      pod 'Firebase/Auth'
      pod 'Firebase/Firestore'
   pod install
```

Check firebase console to update data and view stats

BUGS:

10. [node_modules/react-native/third-party/glog-0.3.4/configure](https://github.com/facebook/react-native/issues/14382)
11. [Remove and add again libfishhook.a from Xcode and the path issue will resolve.](https://github.com/facebook/react-native/issues/19569)
12. [Removed Airmaps.xcodeproj and libairmaps if it exist in Libraries folder and Build Settings respectively.](https://github.com/react-community/react-native-maps/issues/718)
