# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.

# React Native core
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep interface com.facebook.react.** { *; }
-dontwarn com.facebook.react.**
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Keep native methods
-keepclasseswithmembers class * {
    native <methods>;
}

# Keep React Native ViewManagers and Modules
-keepclassmembers class * extends com.facebook.react.uimanager.ViewManager {
    <fields>;
    <methods>;
}
-keepclassmembers class * extends com.facebook.react.bridge.ReactContextBaseJavaModule {
    <fields>;
    <methods>;
}
-keepclassmembers class * extends com.facebook.react.bridge.JavaScriptModule {
    <fields>;
    <methods>;
}
-keepclassmembers class * implements com.facebook.react.bridge.NativeModule {
    <fields>;
    <methods>;
}
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# JSC & Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class org.webkit.** { *; }

# OkHttp & Okio
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# React Native Vector Icons
-keep class com.oblador.vectoricons.** { *; }
-dontwarn com.oblador.vectoricons.**

# React Native Gesture Handler & Screens
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.rnscreens.** { *; }
-dontwarn com.swmansion.gesturehandler.**
-dontwarn com.swmansion.rnscreens.**

# React Native Async Storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-dontwarn com.reactnativecommunity.asyncstorage.**

# Image Crop Picker & Image Picker
-keep class com.reactnative.ivpusic.imagepicker.** { *; }
-keep class com.imagepicker.** { *; }
-dontwarn com.reactnative.ivpusic.imagepicker.**
-dontwarn com.imagepicker.**

# View Shot
-keep class fr.greweb.reactnativeviewshot.** { *; }
-dontwarn fr.greweb.reactnativeviewshot.**

# Share
-keep class cl.json.** { *; }
-dontwarn cl.json.**

# Document Picker
-keep class com.reactnativedocumentpicker.** { *; }
-dontwarn com.reactnativedocumentpicker.**

# Audio Recorder Player
-keep class com.dooboolab.audiorecorderplayer.** { *; }
-dontwarn com.dooboolab.audiorecorderplayer.**

# DateTimePicker
-keep class com.reactcommunity.rndatetimepicker.** { *; }
-dontwarn com.reactcommunity.rndatetimepicker.**

# React Native FS
-keep class com.rnfs.** { *; }
-dontwarn com.rnfs.**

# Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }
-dontwarn com.th3rdwave.safeareacontext.**
