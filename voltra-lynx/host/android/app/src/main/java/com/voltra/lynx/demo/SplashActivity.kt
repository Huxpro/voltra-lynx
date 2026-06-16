package com.voltra.lynx.demo

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.tiktok.sparkling.Sparkling
import com.tiktok.sparkling.SparklingContext

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        gotoSparklingPage()
    }

    private fun gotoSparklingPage() {
        val context = SparklingContext()
        context.scheme =
            "hybrid://lynxview_page?bundle=main.lynx.bundle&hide_nav_bar=1&screen_orientation=portrait"
        context.withInitData("{\"initial_data\":{}}")
        Sparkling.build(this, context).navigate()
        finish()
    }
}
