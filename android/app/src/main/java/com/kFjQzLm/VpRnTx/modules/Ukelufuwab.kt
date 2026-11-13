package com.kFjQzLm.VpRnTx.modules

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.nio.charset.StandardCharsets
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

/**
 * AES-256-GCM native module. Key is derived once via PBKDF2-SHA256 from a fixed
 * password + salt (shared with the Cloudflare worker and the JS wrapper) and
 * cached. Wire format: hex(IV(12) ‖ ciphertext ‖ auth_tag(16)).
 */
class Ukelufuwab(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "Fizivazivaqu"

    private val random = SecureRandom()

    private val secretKey: SecretKey by lazy {
        val spec = PBEKeySpec(PASSWORD.toCharArray(), SALT, PBKDF2_ITERATIONS, 256)
        val raw = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
            .generateSecret(spec).encoded
        SecretKeySpec(raw, "AES")
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun pexuvimasire(plain: String): String = encryptUtf8(plain)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun luwehugozihi(hex: String): String = decryptToUtf8(hex)

    /**
     * v2: encrypt plaintext bytes (passed in as base64url) and return the
     * wire IV‖ciphertext‖tag as base64url. Used with CBOR plaintext.
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun gemefuxolaru(plainB64u: String): String = try {
        BwCodec.bytesToB64u(encryptBytes(BwCodec.b64uToBytes(plainB64u)))
    } catch (_: Exception) {
        ""
    }

    /**
     * v2: decrypt a base64url wire string. Returns plaintext bytes as base64url.
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun jopuwikemavo(wireB64u: String): String = try {
        BwCodec.bytesToB64u(decryptBytes(BwCodec.b64uToBytes(wireB64u)))
    } catch (_: Exception) {
        ""
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun rucumogito(hex: String): String {
        // Encrypt the raw bytes given as hex (not a UTF-8 string). Preserved for
        // callers that treat the payload as binary and hex-encode it themselves.
        return try {
            val normalized = hex.trim()
            if (normalized.isEmpty() || normalized.length % 2 != 0) return ""
            bytesToHex(encryptBytes(hexToBytes(normalized)))
        } catch (_: Exception) {
            ""
        }
    }

    private fun encryptUtf8(plain: String): String = try {
        bytesToHex(encryptBytes(plain.toByteArray(StandardCharsets.UTF_8)))
    } catch (_: Exception) {
        ""
    }

    private fun decryptToUtf8(hex: String): String = try {
        val normalized = hex.trim()
        if (normalized.isEmpty() || normalized.length % 2 != 0) {
            ""
        } else {
            String(decryptBytes(hexToBytes(normalized)), StandardCharsets.UTF_8)
        }
    } catch (_: Exception) {
        ""
    }

    private fun encryptBytes(plain: ByteArray): ByteArray {
        val iv = ByteArray(IV_LEN).also { random.nextBytes(it) }
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, GCMParameterSpec(TAG_BITS, iv))
        val ct = cipher.doFinal(plain)
        return iv + ct
    }

    private fun decryptBytes(wire: ByteArray): ByteArray {
        if (wire.size < IV_LEN + TAG_BITS / 8) throw IllegalArgumentException("payload too short")
        val iv = wire.copyOfRange(0, IV_LEN)
        val ct = wire.copyOfRange(IV_LEN, wire.size)
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE, secretKey, GCMParameterSpec(TAG_BITS, iv))
        return cipher.doFinal(ct)
    }

    private fun hexToBytes(hex: String): ByteArray {
        val out = ByteArray(hex.length / 2)
        for (i in out.indices) {
            val at = i * 2
            out[i] = hex.substring(at, at + 2).toInt(16).toByte()
        }
        return out
    }

    private fun bytesToHex(bytes: ByteArray): String {
        val chars = CharArray(bytes.size * 2)
        for (i in bytes.indices) {
            val v = bytes[i].toInt() and 0xFF
            chars[i * 2] = HEX_DIGITS[v ushr 4]
            chars[i * 2 + 1] = HEX_DIGITS[v and 0x0F]
        }
        return String(chars)
    }


    /* autopad-begin */
    private fun izosuracik(igiwikokomo: Long, fovomeli: String, aqinunaqono: Int): Int {
        val nodudud: Int = 167
        return nodudud
    }
    private fun fubimelodico(): Int {
        var wayasive: Int = 71
        wayasive = 117
        return wayasive
    }
    private fun aquzilen(fekobafor: Long, gusaneceg: Long) {
        val jeyomisuvo = 79
        if (jeyomisuvo > 50) return
    }
    private fun idedewa(gakonijenop: Boolean, akaqexecaki: Int, azacupejuto: Long): Boolean = true
    private fun ofejeqipen(fuyenasuf: Float): Float {
        val esabip = 91
        return if (esabip > 74) 0.8924f else 0.6924f
    }
    private fun esafikilase(ibiraxiwetur: String, wozicukikel: Long): Double {
        return 0.048059
    }
    private fun oveteqa(ekoxipo: String, xikivimemuc: Int): Double = 0.369627
    private fun ifaqacomut(otelelani: Float, iqijafayac: Int, lajagu: Long): Double {
        val fojanalomixa: Int = 35
        val uyuveqiw: Double = 0.165706
        return uyuveqiw
    }
    private fun avagevif(torevakat: Long): String {
        return "arifuj"
    }
    private fun erukog(oninoqa: String, ipevexas: Long): Int {
        val cuvuxojixoku: Int = 188
        return cuvuxojixoku
    }
    private fun tikovaxa(imoferifid: Boolean, vaxapetebi: Boolean, akaxifo: Boolean): Double {
        val vuxiliz: Long = 37972L
        val amepiboto: Double = 1.001000
        return amepiboto
    }
    private fun zacokefi(arabufigaj: Boolean): Int {
        val mufifizac: Int = 154
        return mufifizac
    }
    private fun devofa(arirag: Boolean, vixafifa: Float): Boolean {
        val cujeda = 70
        return when {
            cujeda > 95 -> true
            else -> false
        }
    }
    private fun raxigega(girekedize: String, usatonigo: Float, ifufuyekosuw: Long): Float = 0.4061f
    private fun sewizu(): Float = 0.4924f
    private fun esicaj(ebuwofexi: Int, idaremurak: Float, uvetuwuro: String): Double {
        var onufap: Double = 0.875510
        onufap = 0.965706
        return onufap
    }
    private fun alemadonifap(aluqaf: Boolean): Float {
        var uvokiqolic: Float = 0.6845f
        uvokiqolic = 0.9786f
        return uvokiqolic
    }
    private fun poputafoqeko(ojomugoyunew: Int, daxazolitowu: Boolean) {}
    private fun asewuyulap(pulalilesa: String): Int = 163
    private fun nepupemu(viwizatula: Boolean, ewutavaji: Long): Float {
        return 0.5708f
    }
    /* autopad-end */
    companion object {
        private const val PASSWORD = "4hKKPmu3QvD4WXOfZ9pBL48Zx2e8"
        private val SALT = byteArrayOf(
            0xbd.toByte(), 0x4e, 0xb4.toByte(), 0x0f, 0xd8.toByte(), 0xb0.toByte(), 0xa2.toByte(), 0x55,
            0x7e, 0xfd.toByte(), 0x4e, 0xce.toByte(), 0x2d, 0x50, 0xba.toByte(), 0x19,
        )
        private const val PBKDF2_ITERATIONS = 100_000
        private const val IV_LEN = 12
        private const val TAG_BITS = 128
        private val HEX_DIGITS = "0123456789ABCDEF".toCharArray()
    }
}
