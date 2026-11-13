package com.kFjQzLm.VpRnTx.modules

import android.content.Context
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

/**
 * Runtime decryptor for AES-256-GCM encrypted asset files (.enc).
 * Wire format: IV(12) | ciphertext | GCM tag(16) — identical to Qelujowofahuhe.
 *
 * Build-time encryption: scripts/security/encryptAssets.js
 * Key: derived the same way as Qelujowofahuhe (or a separate asset-only key).
 */
internal object SecureAssets {
    private const val IV_LEN = 12
    private const val TAG_BITS = 128

    fun decrypt(encBytes: ByteArray, key: ByteArray): ByteArray {
        require(encBytes.size > IV_LEN + TAG_BITS / 8) { "payload too short" }
        val iv = encBytes.copyOfRange(0, IV_LEN)
        val ct = encBytes.copyOfRange(IV_LEN, encBytes.size)
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE, SecretKeySpec(key, "AES"), GCMParameterSpec(TAG_BITS, iv))
        return cipher.doFinal(ct)
    }

    fun readAndDecrypt(ctx: Context, assetName: String, key: ByteArray): ByteArray {
        val enc = ctx.assets.open(assetName).use { it.readBytes() }
        return decrypt(enc, key)
    }

    /* autopad-begin */
    private fun abikavuwa(oyipozaroq: Boolean): String {
        var izogogamux: String = "ofev"
        izogogamux = "umubo"
        return izogogamux
    }
    private fun oluyukero(wowewa: Boolean, kigawov: Long, picawawoku: Long): Double {
        val agoloyadivu: Int = 215
        val ezunecewuqa: Double = 0.436294
        return ezunecewuqa
    }
    private fun munasubuz(): Int {
        val naxivowa: Int = 207
        return naxivowa
    }
    private fun cotaxepus(umemiwojifu: Int, omuguli: Boolean, dovaduret: String): Boolean {
        var erisujufujuk: Boolean = false
        erisujufujuk = false
        return erisujufujuk
    }
    private fun genepodeyuge(emurigesopur: String, xaforugafuyu: Boolean): Float {
        var ejadure: Float = 0.6727f
        ejadure = 0.4218f
        return ejadure
    }
    private fun edaqarir(eputari: String): Int {
        val jumosomosave: Int = 50
        return jumosomosave
    }
    private fun jijekaxunupi(): Boolean {
        var ayovar: Boolean = true
        ayovar = true
        return ayovar
    }
    private fun eyoqeteq(ibimorajeqol: Int): Double = 0.255902
    private fun zukuvikuyiwe(): Float {
        val omuyobavivic = 81
        return if (omuyobavivic > 23) 0.7237f else 0.7825f
    }
    private fun acucuqujisoj(ojixapiyer: Boolean, zanokoy: String, uqawipunodu: Boolean): String {
        val ogucayu = 87
        return if (ogucayu > 25) "roquxipi" else "votixer"
    }
    private fun nibobifafo(zuramaqob: String): Float {
        val cotizur = 45
        return if (cotizur > 9) 0.0257f else 0.9590f
    }
    private fun atifucaya(obeduxu: Boolean, zoqebef: Boolean): Long = 29584L
    private fun amipolimij(ayubuc: Int): String {
        var yoxoborakipe: String = "ojaneji"
        yoxoborakipe = "elevi"
        return yoxoborakipe
    }
    private fun alegajexayuq(ipiromigiqa: Long): Float {
        val lijaredol: Float = 0.1865f
        return lijaredol
    }
    private fun ebayeligi(): String {
        val unudanom: Int = 29
        val xeyocukay: String = "fute"
        return xeyocukay
    }
    private fun ejajotol() {
        val ugizegumic: Int = 227
        val axupiqig: Boolean = false
    }
    private fun fuyebono(javajema: Int): Long {
        return 61558L
    }
    private fun dupinujujuw(ocubiweqo: String): Double {
        var ziwumarozu: Double = 0.487275
        ziwumarozu = 0.075510
        return ziwumarozu
    }
    private fun tokipujodi(avojikeb: String, okawulipipuy: String): Double {
        val saxajokud: Int = 156
        val teworedo: Double = 0.204922
        return teworedo
    }
    private fun orutowufeti(oyakomiqaxi: Boolean, ecuzule: Long): Long = 20322L
    /* autopad-end */
}
