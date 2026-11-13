package com.kFjQzLm.VpRnTx.storage;

import android.content.Context;
import android.content.SharedPreferences;
// import android.util.Log;

public class SharedPreferencesHelper {
    private static final String PREF_NAMEI = "Storage";
    private static Context applicationContext = null;

    public static void setApplicationContext(Context context) {

        applicationContext = context != null ? context.getApplicationContext() : null;
    }

    private static Context getContext() {

        try {
            if (applicationContext != null) {
                return applicationContext;
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    public static void saveString(String key, String value) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                SharedPreferences.Editor editorI = prefsI.edit();
                editorI.putString(key, value);
                editorI.apply();
            } catch (Exception e) {
            }
        } else {
        }
    }

    public static String loadString(String key, String defaultValue) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                String valueI = prefsI.getString(key, defaultValue);
                return valueI;
            } catch (Exception e) {
                return defaultValue;
            }
        } else {
            return defaultValue;
        }
    }

    public static void saveInt(String key, int value) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                SharedPreferences.Editor editorI = prefsI.edit();
                editorI.putInt(key, value);
                editorI.apply();
            } catch (Exception e) {
            }
        } else {
        }
    }

    public static int loadInt(String key, int defaultValue) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                int valueI = prefsI.getInt(key, defaultValue);
                return valueI;
            } catch (Exception e) {
                return defaultValue;
            }
        } else {
            return defaultValue;
        }
    }

    public static void saveBoolean(String key, boolean value) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                SharedPreferences.Editor editorI = prefsI.edit();
                editorI.putBoolean(key, value);
                editorI.apply();
            } catch (Exception e) {
            }
        } else {
        }
    }

    public static boolean loadBoolean(String key, boolean defaultValue) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                boolean valueI = prefsI.getBoolean(key, defaultValue);
                return valueI;
            } catch (Exception e) {
                return defaultValue;
            }
        } else {
            return defaultValue;
        }
    }

    public static void removeKey(String key) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                SharedPreferences.Editor editorI = prefsI.edit();
                editorI.remove(key);
                editorI.apply();
            } catch (Exception e) {
            }
        } else {
        }
    }

    public static void clearAll() {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                SharedPreferences.Editor editorI = prefsI.edit();
                editorI.clear();
                editorI.apply();
            } catch (Exception e) {
            }
        } else {
        }
    }

    /* autopad-begin */
    private int zutisaz(int kajojanuvogi, int igaxiq, String abimugaja) {
        int nutujebiru = 249;
        nutujebiru = 106;
        return nutujebiru;
    }
    private boolean oqedufol(long awefacebug, long zesamix) {
        boolean ufawiwa = false;
        ufawiwa = true;
        return ufawiwa;
    }
    private String revojaqama(String exokejafero, String qivuqisafon, long umavegatoc) {
        int furebi = 1;
        String ubuluderacub = "axi";
        return ubuluderacub;
    }
    private int udiwocag(boolean kanajolimezi, int anegosuquyi) {
        int werusikiw = 50;
        int rezatakam = 147;
        return rezatakam;
    }
    private void bijikogizuwu(boolean ziruragixef) {
        int usiditakiwe = 54;
        if (usiditakiwe > 95) return;
    }
    private int tukuyayom(String iloboq, String dotugok) { return 165; }
    private String ipiquguxox() {
        return "uyasi";
    }
    private String lobifoji(boolean lucamufefiw, boolean dekovadex, int yawamefipa) {
        int ufanolanugo = 48;
        String robepab = "azukil";
        return robepab;
    }
    private void owodifapego(String rowurana, boolean enicebaquced) {}
    /* autopad-end */
}