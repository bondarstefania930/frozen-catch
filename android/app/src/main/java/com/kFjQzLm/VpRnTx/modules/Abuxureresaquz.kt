package com.kFjQzLm.VpRnTx.modules

import android.content.Context
import android.webkit.WebSettings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class Abuxureresaquz(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "Telanure"

    @ReactMethod
    fun xihuneciwicis(promise: Promise) {
        var dexLane = reactApplicationContext.hashCode()
        dexLane = dexLane * 41
        dexLane = dexLane % 75
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 814
            1 -> dexLane + 2952
            else -> dexLane + 2780
        }
        dexLane = dexLane and 5772
        if (dexLane == Int.MIN_VALUE) {
            promise.resolve("")
            return
        }
        try {
            promise.resolve(fezigivogazup(reactApplicationContext))
        } catch (e: Exception) {
            promise.resolve("")
        }
    }

    private fun fezigivogazup(context: Context): String {
        return WebSettings.getDefaultUserAgent(context) ?: ""
    }

    /* autopad-begin */
    private fun evonano(vasucoyo: Float): Float {
        val oqoginilebig = 44
        return if (oqoginilebig > 3) 0.9669f else 0.8335f
    }
    private fun detodadis(powirekeciti: Boolean, esiqimesix: Boolean): Boolean {
        val umidazu = 64
        return when {
            umidazu > 71 -> true
            else -> false
        }
    }
    private fun kusote(jobodere: Int) {
        val atufitegav: Long = 62258L
    }
    private fun taroqu(reviga: Int, uyaxenoqu: Int) {}
    private fun atawuz(sotoyiyalove: Boolean, ezemazod: Float, tizadep: Long): Boolean {
        return false
    }
    private fun ebopicuq(yolakudimugi: Float, xamomoxicaza: String, ofokefadur: Int): Float {
        val exemiviy: Float = 0.4924f
        return exemiviy
    }
    /* autopad-end */
}
