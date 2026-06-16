plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)
}

android {
    namespace = "voltra"
    compileSdk = 36

    defaultConfig {
        minSdk = 26
        targetSdk = 35
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
    defaultConfig {
        buildConfigField("String", "VOLTRA_VERSION", "\"0.1.0\"")
    }
}

dependencies {
    // Sparkling SDK (provides Lynx SDK classes: LynxModule, LynxMethod, LynxEnv, etc.)
    compileOnly(libs.sparkling)

    // Jetpack Glance
    api(libs.glance)
    api(libs.glance.appwidget)

    // Compose runtime (required for Glance)
    api(libs.compose.runtime)

    // WorkManager (periodic server-driven widget updates)
    api(libs.work.runtime.ktx)

    // DataStore (credential storage)
    api(libs.datastore.preferences)

    // AndroidX Core (FileProvider for image sharing between processes)
    implementation(libs.androidx.core.ktx)

    // Google Tink (encryption for credentials)
    implementation(libs.tink.android)

    // Coroutines
    implementation(libs.kotlinx.coroutines.android)

    // Kotlinx Serialization
    implementation(libs.kotlinx.serialization.json)

    // Unit tests
    testImplementation(libs.junit)
}
