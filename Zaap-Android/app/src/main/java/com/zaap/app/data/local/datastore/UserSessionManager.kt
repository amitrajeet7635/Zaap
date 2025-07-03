package com.zaap.app.data.local.datastore

import android.content.Context
import androidx.datastore.preferences.core.edit
import kotlinx.coroutines.flow.first

object UserSessionManager {

    suspend fun saveUser(
        context: Context,
        email: String?,
        name: String?,
        profileImage: String?,
        privateKey: String?,
        publicKey: String?
    ) {
        context.dataStore.edit { prefs ->
            email?.let { prefs[UserPreferencesKeys.EMAIL] = it }
            name?.let { prefs[UserPreferencesKeys.NAME] = it }
            profileImage?.let { prefs[UserPreferencesKeys.PROFILE_IMAGE] = it }
            privateKey?.let { prefs[UserPreferencesKeys.PRIVATE_KEY] = it }
            publicKey?.let { prefs[UserPreferencesKeys.PUBLIC_KEY] = it }
        }
    }

    suspend fun getUser(context: Context): UserData {
        val prefs = context.dataStore.data.first()
        return UserData(
            email = prefs[UserPreferencesKeys.EMAIL],
            name = prefs[UserPreferencesKeys.NAME],
            profileImage = prefs[UserPreferencesKeys.PROFILE_IMAGE],
            privateKey = prefs[UserPreferencesKeys.PRIVATE_KEY],
            publicKey = prefs[UserPreferencesKeys.PUBLIC_KEY]
        )
    }

    suspend fun clearUser(context: Context) {
        context.dataStore.edit { it.clear() }
    }

    suspend fun isLoggedIn(context: Context): Boolean {
        val prefs = context.dataStore.data.first()
        return prefs[UserPreferencesKeys.EMAIL] != null
    }
}

data class UserData(
    val email: String?,
    val name: String?,
    val profileImage: String?,
    val privateKey: String?,
    val publicKey: String?
)
