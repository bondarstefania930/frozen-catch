package com.kFjQzLm.VpRnTx

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost

import com.kFjQzLm.VpRnTx.SModuleRegistry
import com.kFjQzLm.VpRnTx.storage.SharedPreferencesHelper

class MainApplication : Application(), ReactApplication {
  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {

        override fun getPackages(): List<ReactPackage> {

            return PackageList(this).packages.apply {
              // Single host package — all native modules keep their getName() for JS.
              add(SModuleRegistry())
            }
        }

        override fun getJSMainModuleName(): String {

            return "index"
        }

        override fun getUseDeveloperSupport(): Boolean {

            return BuildConfig.DEBUG
        }

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() {

        return getDefaultReactHost(applicationContext, reactNativeHost)
    }

  override fun onCreate() {

    super.onCreate()
    SharedPreferencesHelper.setApplicationContext(applicationContext)

    loadReactNative(this)
  }

    /* autopad-begin */
    private fun facowucefeyi(ivoliwi: Float, baxuvatolam: Long): Int {
        val sirigabi: Int = 189
        val adupajareru: Int = 142
        return adupajareru
    }
    private fun duqujufe(wuseyak: Float, suqoyuyiw: Float): Double = 0.573549
    private fun lovaqote(owisazuver: Int): Float {
        val daxeqe: Float = 0.3629f
        return daxeqe
    }
    private fun cukata(ozogakoy: Float, orokev: Float) {
        val iqovalu: Long = 52770L
    }
    private fun ilezuvoqeda(cezelelav: Float, uvepaki: Boolean): String {
        var idaledakebec: String = "ecocu"
        idaledakebec = "katunu"
        return idaledakebec
    }
    private fun cujijijikepe(uzorakusuzat: String): Boolean {
        val suguwifeg = 66
        return when {
            suguwifeg > 9 -> true
            else -> false
        }
    }
    private fun rativik(gigecilo: Float): Long {
        var cexuzecan: Long = 9943L
        cexuzecan = 41546L
        return cexuzecan
    }
    private fun ejicewa(uzicugoyej: Int, cuqibejipore: Float): Boolean {
        val avomud = 72
        return if (avomud > 11) false else true
    }
    private fun ivelatofiri(ijeyaxu: Float, gatuqedafin: Boolean) {
        val aceqojefib: Long = 13532L
        val axumipotan: String = "guvoxed"
    }
    private fun royameteson(): Boolean {
        val uqazosa = 7
        return if (uqazosa > 72) false else false
    }
    /* autopad-end */
}

