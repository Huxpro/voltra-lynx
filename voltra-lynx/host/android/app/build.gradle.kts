plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.voltra.lynx.demo"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.voltra.lynx.demo"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        ndk {
            abiFilters.addAll(listOf("armeabi-v7a", "arm64-v8a"))
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        buildConfig = true
    }

    // Load Lynx bundles from the dev server dist or local assets
    sourceSets {
        getByName("main").apply {
            val useNativeAssets =
                System.getenv("VOLTRA_USE_NATIVE_ASSETS")?.equals("true", ignoreCase = true)
                    ?: false
            if (useNativeAssets) {
                assets.setSrcDirs(listOf("src/main/assets"))
            } else {
                // Default: use the example-app dist output
                assets.setSrcDirs(listOf("src/main/assets"))
            }
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)

    // Sparkling SDK (bundles Lynx SDK)
    implementation(libs.sparkling)
    implementation(libs.sparkling.method)
    implementation(libs.okhttp)

    // Fresco (image loading, required by Sparkling)
    implementation(libs.fresco)
    implementation(libs.fresco.animated.gif)
    implementation(libs.fresco.animated.webp)
    implementation(libs.fresco.webp.support)
    implementation(libs.fresco.animated.base)

    // Voltra native library
    implementation(project(":voltra"))

    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
}
