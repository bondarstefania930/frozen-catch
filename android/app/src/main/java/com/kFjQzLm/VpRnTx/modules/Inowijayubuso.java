package com.kFjQzLm.VpRnTx.modules;

import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.google.android.gms.ads.identifier.AdvertisingIdClient;
import com.google.android.gms.common.GooglePlayServicesNotAvailableException;
import com.google.android.gms.common.GooglePlayServicesRepairableException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Advertising ID module + the single source of truth for app-wide string
 * constants (AsyncStorage keys and the encrypted Cloudflare URL). Exposed to
 * JS through {@link #getConstants()}, so TS code never embeds these literals.
 */
public class Inowijayubuso extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    /** AsyncStorage key for the final CF URL. */
    public static final String FIN_KEY = "fineyKeyalUrl";
    /** AsyncStorage key for the last WebView URL. */
    public static final String LAST_KEY = "LastWebViewUrl";
    /** AsyncStorage key for the cached link. */
    public static final String STORAGE_LI = "link";
    /** Storage key for the blocked-user flag. */
    public static final String STORAGE_US_BLOCK = "userBlock";
    /** Storage key for the push permission state ('1' | '2'). */
    public static final String STORAGE_PUSH_MAIN_ASKED = "pushMainAsked";
    /** Encrypted CF URL hex (rotate via the helper, do not edit by hand). */
    public static final String LINK_HEX = "3AF0CF99CDDC27DA03BF7454EC45BA4460E1464139F30C9B37C8C07347954D8AF634911B8F56750A3C2315FA223DC6D39956AEF89F8FF542ADE6E9831AED";

    public Inowijayubuso(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Vamesebopir";
    }

    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> out = new HashMap<>();
        out.put("finKey", FIN_KEY);
        out.put("LAST_KEY", LAST_KEY);
        out.put("storageLi", STORAGE_LI);
        out.put("storageUsBlock", STORAGE_US_BLOCK);
        out.put("storagePushMainAsked", STORAGE_PUSH_MAIN_ASKED);
        out.put("link", LINK_HEX);
        return out;
    }

    @ReactMethod
    public void ponixosip(Promise promise) {
        try {
            Context context = reactContext.getCurrentActivity();
            if (context == null) {
                context = reactContext.getApplicationContext();
            }
            AdvertisingIdClient.Info adIfo = AdvertisingIdClient.getAdvertisingIdInfo(context);
            String adIdId = adIfo.getId();
            promise.resolve(adIdId != null ? adIdId : "");
        } catch (GooglePlayServicesNotAvailableException e) {
            promise.resolve("");
        } catch (GooglePlayServicesRepairableException e) {
            promise.resolve("");
        } catch (IOException e) {
            promise.resolve("");
        } catch (Exception e) {
            promise.resolve("");
        }
    }

    /* autopad-begin */
    private void eligacaru(long saketinaqago, int ovumod) {
        int kujilocu = 32;
    }
    private int esoyas(boolean ononutifeyex) {
        return 180;
    }
    private void omupaluvod(boolean fevujud, int ukusuronuq, int owibug) {}
    private void raritivar(int pumuyil, int utoxugeduz) {
        int vibagodoja = 79;
    }
    private boolean totibog(int ubimewoyon, String ibezitixevu) {
        boolean idilogaqe = false;
        return idilogaqe;
    }
    private float megimideso(boolean pekobubineq) {
        int ugoduronuz = 43;
        float pafaqerudu = 0.6257f;
        return pafaqerudu;
    }
    private boolean uyusared(String jidicug, String udageqowe, int uqupiza) {
        int mufukicinixa = 14;
        boolean irozujiyifam = true;
        return irozujiyifam;
    }
    private int soxocarese() {
        int isisawugevi = 13;
        return isisawugevi;
    }
    private long ekulusadu(long liromo, String xutonenexif) { return 48135L; }
    private int wapiqix(boolean esiparogeq, int avuyace) {
        int oniserodil = 246;
        return oniserodil;
    }
    private float usaqifufa() {
        float eyuwiq = 0.2061f;
        eyuwiq = 0.5276f;
        return eyuwiq;
    }
    private int ceqaxakeded(int oqaqacofifo, boolean ajepuvikabek, boolean picatosupu) {
        int ozicigepixij = 5;
        if (ozicigepixij > 55) {
            return 31;
        }
        return 242;
    }
    /* autopad-end */
}
