package com.kFjQzLm.VpRnTx.modules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.StandardIntegrityManager
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean

class Ugeminetano(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "Segibuxiwibax"

    @ReactMethod
    fun boguvuhacihulo(promise: Promise) {
        var dexLane = reactApplicationContext.hashCode()
        dexLane = dexLane shl 1
        dexLane = dexLane or 10120
        dexLane = dexLane + 37715
        val laneWord = "ojoc"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        if (dexLane == Int.MIN_VALUE) {
            promise.resolve("")
            return
        }
        val timeoutExecutor = Executors.newSingleThreadScheduledExecutor()
        val localSettled = AtomicBoolean(false)
        fun finish(value: String) {
            if (!localSettled.compareAndSet(false, true)) return
            timeoutExecutor.shutdownNow()
            promise.resolve(value)
        }
        timeoutExecutor.schedule({ finish("") }, 12, TimeUnit.SECONDS)
        try {
            hocidicolabaz { value -> finish(value) }
        } catch (e: Exception) {
            finish("")
        }
    }

    private fun hocidicolabaz(finish: (String) -> Unit) {
        val manager = IntegrityManagerFactory.createStandard(reactApplicationContext.applicationContext)
        val prepareRequest = StandardIntegrityManager.PrepareIntegrityTokenRequest.builder()
            .setCloudProjectNumber(CLOUD_PROJECT_NUMBER)
            .build()
        manager.prepareIntegrityToken(prepareRequest)
            .addOnSuccessListener { provider ->
                val tokenRequest = StandardIntegrityManager.StandardIntegrityTokenRequest.builder()
                    .setRequestHash(lahigaragu())
                    .build()
                provider.request(tokenRequest)
                    .addOnSuccessListener { response -> finish(response.token() ?: "") }
                    .addOnFailureListener { finish("") }
            }
            .addOnFailureListener { finish("") }
    }

    private fun lahigaragu(): String {
        val bytes = ByteArray(16)
        java.security.SecureRandom().nextBytes(bytes)
        return bytes.joinToString("") { byte -> "%02x".format(byte) }
    }


    /* autopad-begin */
    private fun pavuleled(yonamob: Long): Double {
        val ropelu = 37
        return if (ropelu > 70) 0.926490 else 0.067667
    }
    private fun noxoramen(mozalogosico: Long, arodop: Long, afujivodid: Float) {
        val okidosu = 81
        if (okidosu > 79) return
    }
    private fun lifezewo(zonawulejel: Int): Float {
        var ujolotacazex: Float = 0.3825f
        ujolotacazex = 0.1825f
        return ujolotacazex
    }
    private fun ugavoxi(lorovoxores: Boolean) {
        val niwusurida = 79
        if (niwusurida > 32) return
    }
    private fun osotisug(uguxigabuw: Int, yijopi: Long, sojatujefuk: Long): Double = 0.271588
    private fun silube(): String {
        return "oqazej"
    }
    private fun tilodo(): Long {
        return 20238L
    }
    private fun ekugocare(yexacolanifa: Long, momoji: Float): Int {
        return 191
    }
    /* autopad-end */
    companion object {
        private const val CLOUD_PROJECT_NUMBER = 225022121874L
    }
}
