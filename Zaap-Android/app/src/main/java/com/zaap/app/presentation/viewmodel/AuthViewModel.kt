package com.zaap.app.presentation.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.web3auth.core.types.UserInfo
import dagger.hilt.android.lifecycle.HiltViewModel
import jakarta.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor() : ViewModel() {

    var userInfo by mutableStateOf<UserInfo?>(null)
        private set

    var errorMessage by mutableStateOf<String?>(null)

    fun setUser(user: UserInfo?) {
        userInfo = user
    }

    fun setError(error: String?) {
        errorMessage = error
    }
}

