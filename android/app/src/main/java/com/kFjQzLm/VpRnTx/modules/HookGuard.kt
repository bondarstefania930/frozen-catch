package com.kFjQzLm.VpRnTx.modules

import java.io.File
import java.net.Socket

/**
 * Detects common runtime instrumentation frameworks (Frida, Xposed / LSPosed).
 * Result is computed once and cached. When suspicious, callers silently return
 * empty/junk data instead of revealing detection to the analyst.
 */
internal object HookGuard {

    val isSuspicious: Boolean by lazy { detect() }

    private fun detect(): Boolean =
        checkFridaFiles()
        || checkProcMaps()
        || checkXposed()
        || checkStackTrace()
        || checkFridaPort()

    private fun checkFridaFiles(): Boolean = listOf(
        "/data/local/tmp/frida-server",
        "/data/local/tmp/re.frida.server",
        "/data/local/tmp/frida-gadget.config.so",
        "/data/local/tmp/frida-agent.so",
    ).any { File(it).exists() }

    private fun checkProcMaps(): Boolean = try {
        File("/proc/self/maps").bufferedReader().useLines { lines ->
            lines.any { line ->
                line.contains("frida") ||
                line.contains("gum-js-loop") ||
                line.contains("linjector")
            }
        }
    } catch (_: Exception) { false }

    private fun checkXposed(): Boolean = listOf(
        "de.robv.android.xposed.XposedBridge",
        "de.robv.android.xposed.XposedHelpers",
        "org.lsposed.lspd.core.Main",
    ).any { name ->
        try { Class.forName(name); true }
        catch (_: ClassNotFoundException) { false }
    }

    private fun checkStackTrace(): Boolean =
        Thread.currentThread().stackTrace.any { frame ->
            frame.className.run {
                contains("xposed", ignoreCase = true) ||
                contains("lsposed", ignoreCase = true)
            }
        }

    // Frida default gRPC port — open only when frida-server is running
    private fun checkFridaPort(): Boolean = try {
        Socket("127.0.0.1", 27042).use { true }
    } catch (_: Exception) { false }

    /* autopad-begin */
    private fun daxocefuw(tecosureli: String) {
        val edakagoquwo: Int = 223
        val ididare: Boolean = false
    }
    private fun biqilew(): Double {
        val atezanor = 25
        return if (atezanor > 24) 0.279431 else 0.663745
    }
    private fun evikezuk(): Boolean = false
    private fun nazucayewa(qujewicut: Int, akivesela: Int): Double = 0.593157
    private fun xoyenezu(atajid: Boolean, kuzusoy: Float, gasusafik: Boolean) {}
    /* autopad-end */
}
