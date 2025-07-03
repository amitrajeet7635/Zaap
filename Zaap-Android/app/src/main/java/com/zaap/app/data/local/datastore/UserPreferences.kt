package com.zaap.app.data.local.datastore

import android.content.Context
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore

private const val DATASTORE_NAME = "user_prefs"
val Context.dataStore by preferencesDataStore(DATASTORE_NAME)

object UserPreferencesKeys {
    val EMAIL = stringPreferencesKey("email")
    val NAME = stringPreferencesKey("name")
    val PROFILE_IMAGE = stringPreferencesKey("profile_image")
    val PRIVATE_KEY = stringPreferencesKey("private_key")
}
