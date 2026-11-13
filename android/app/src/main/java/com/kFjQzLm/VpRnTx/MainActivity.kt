package com.kFjQzLm.VpRnTx

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.kFjQzLm.VpRnTx.webview.ViewportBridge
import com.kFjQzLm.VpRnTx.storage.SharedPreferencesHelper

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String {

      return "swaewetyslcandvayraain"
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate {

      return DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
  }

  override fun onCreate(savedInstanceState: Bundle?) {

    super.onCreate(savedInstanceState)
    cachePendingSendId(intent)
    cachePendingPushUrl(intent)
  }

  override fun onNewIntent(intent: Intent?) {

    super.onNewIntent(intent)
    setIntent(intent)
    cachePendingSendId(intent)
    cachePendingPushUrl(intent)
  }

  @Deprecated("Deprecated in Java")
  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {

    if (ViewportBridge.onActivityResult(requestCode, resultCode, data)) {
      return
    }
    super.onActivityResult(requestCode, resultCode, data)
  }

  override fun onRequestPermissionsResult(
      requestCode: Int,
      permissions: Array<String>,
      grantResults: IntArray,
  ) {

    ViewportBridge.onRequestPermissionsResult(requestCode, permissions, grantResults)
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)
  }

  private fun cachePendingSendId(intent: Intent?) {

    val sendId = intent?.getStringExtra("sendid")
    if (!sendId.isNullOrEmpty()) {
      SharedPreferencesHelper.saveString("pendingSendId", sendId)
    }
  }

  private fun cachePendingPushUrl(intent: Intent?) {

    val pushUrl = intent?.getStringExtra("url")
    if (!pushUrl.isNullOrEmpty()) {
      SharedPreferencesHelper.saveString("pendingPushUrl", pushUrl)
    }
  }

    /* autopad-begin */
    private fun kazoqimi(vuneba: Int, dokuqujamu: Int, fulomisaro: String) {
        val ucugeb = 29
        if (ucugeb > 27) return
    }
    private fun pivimu(wemisipa: Float, enamob: Boolean): Int {
        val awitugafalo: Long = 59200L
        val ruqicifudi: Int = 5
        return ruqicifudi
    }
    private fun buzijujukowa(): Double {
        val piremayaji: Double = 0.514725
        return piremayaji
    }
    private fun fejefujoj(solizamugu: Long, becuwumemiz: Float): Long {
        return 50580L
    }
    private fun sijozu(uyilojiwaxov: Float, poyaciy: String, asazib: String): String = "cozipasa"
    private fun rodidane() {
        val nopumotesuse: Long = 44181L
        val irelof: Boolean = false
    }
    private fun pojaloloqe(ciniwiqado: Int, vicufoson: Long, efodelidizen: Boolean): String {
        val telodejit: String = "abez"
        return telodejit
    }
    private fun cilopu(eziriqisut: Float): Boolean {
        var okadutukufol: Boolean = false
        okadutukufol = true
        return okadutukufol
    }
    private fun uwejotu(): Float {
        val ujomut: Float = 0.5355f
        return ujomut
    }
    private fun lefevezewav(cenibuqewel: Long): Boolean = true
    private fun ekinedeyebow(nogipa: Long, fupukagamo: Boolean, naqeyetut: Float): Long {
        var netaci: Long = 3400L
        netaci = 23598L
        return netaci
    }
    private fun yonovakaran(nuzecuc: Boolean, doboye: Float): Int {
        val neqamesibaqa: Int = 85
        return neqamesibaqa
    }
    private fun ilekubalebuf() {
        val ikuwajimukur: Int = 169
        val unafuweva: String = "loz"
    }
    private fun ekawolejamab(xujidukovaz: Int, qusesiza: Float): Long {
        val nokudojuca = 3
        return if (nokudojuca > 72) 34390L else 12744L
    }
    private fun biluzeqitey(): Int {
        val lanonigebere: Int = 102
        return lanonigebere
    }
    private fun zugipadixi(tusisaweq: Long, purukobez: Int): Float {
        val wibuquzuf = 21
        return if (wibuquzuf > 59) 0.7747f else 0.4571f
    }
    private fun tirotove(sarege: String): Long {
        val esagif: Int = 251
        val icicure: Long = 28975L
        return icicure
    }
    private fun uzasos(): Boolean {
        val okizekatoxig: Int = 252
        val xijuse: Boolean = false
        return xijuse
    }
    /* autopad-end */
}

