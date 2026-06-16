package com.voltra.lynx.demo

import android.app.Application
import com.facebook.drawee.backends.pipeline.Fresco
import com.facebook.imagepipeline.core.ImagePipelineConfig
import com.facebook.imagepipeline.memory.PoolConfig
import com.facebook.imagepipeline.memory.PoolFactory
import com.lynx.tasm.LynxEnv
import com.tiktok.sparkling.hybridkit.HybridKit
import com.tiktok.sparkling.hybridkit.config.BaseInfoConfig
import com.tiktok.sparkling.hybridkit.config.SparklingHybridConfig
import com.tiktok.sparkling.hybridkit.config.SparklingLynxConfig

class VoltraApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        initFresco()
        initSparkling()
        registerVoltraModule()
    }

    private fun initFresco() {
        val factory = PoolFactory(PoolConfig.newBuilder().build())
        val builder = ImagePipelineConfig.newBuilder(applicationContext).setPoolFactory(factory)
        Fresco.initialize(applicationContext, builder.build())
    }

    private fun initSparkling() {
        HybridKit.init(this)
        val baseInfoConfig = BaseInfoConfig(isDebug = BuildConfig.DEBUG)
        val lynxConfig = SparklingLynxConfig.build(this) {
            setTemplateProvider(BuiltinTemplateProvider(this@VoltraApplication))
        }
        val hybridConfig = SparklingHybridConfig.build(baseInfoConfig) {
            setLynxConfig(lynxConfig)
        }
        HybridKit.setHybridConfig(hybridConfig, this)
        HybridKit.initLynxKit()
    }

    private fun registerVoltraModule() {
        LynxEnv.inst().registerModule("VoltraModule", voltra.VoltraLynxModule::class.java)
    }
}
