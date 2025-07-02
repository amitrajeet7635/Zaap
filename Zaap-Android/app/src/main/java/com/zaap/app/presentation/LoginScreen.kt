package com.zaap.app.presentation

import android.annotation.SuppressLint
import android.app.Activity
import android.content.ContextWrapper
import android.net.Uri
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.hilt.navigation.compose.hiltViewModel
import com.web3auth.core.Web3Auth
import com.web3auth.core.types.BuildEnv
import com.web3auth.core.types.LoginParams
import com.web3auth.core.types.Network
import com.web3auth.core.types.Provider
import com.web3auth.core.types.Web3AuthOptions
import com.zaap.app.presentation.viewmodel.AuthViewModel

@Composable
fun getActivity(): Activity {
    val context = LocalContext.current
    return remember(context) {
        var ctx = context
        while (ctx is ContextWrapper) {
            if (ctx is Activity) return@remember ctx
            ctx = ctx.baseContext
        }
        throw IllegalStateException("Activity not found in context chain.")
    }
}

@SuppressLint("ContextCastToActivity")
@Composable
fun LoginScreen(
    resultUri: Uri?,
    viewModel: AuthViewModel = hiltViewModel(),
    onLoginSuccess: () -> Unit
) {


    @SuppressLint("ContextCast") val activity = getActivity()

    val userInfo = viewModel.userInfo
    val errorMessage = viewModel.errorMessage

    val web3Auth = remember(activity) {
        Web3Auth(
            Web3AuthOptions(
                "WEB3AuthClientID",
                Network.SAPPHIRE_DEVNET,
                BuildEnv.PRODUCTION,
                Uri.parse("com.zaap.app://auth")
            ), activity
        )
    }


    LaunchedEffect(resultUri) {
        if (resultUri != null) {
            web3Auth.setResultUrl(resultUri)
            web3Auth.initialize().whenComplete { _, error ->
                if (error == null) {
                    viewModel.setUser(web3Auth.getUserInfo())
                    onLoginSuccess()
                } else {
                    viewModel.setError(error.message)
                }
            }
        }
    }


    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Button(onClick = {
                web3Auth.login(LoginParams(Provider.GOOGLE)).whenComplete { result, error ->
                    if (error == null) {
                        viewModel.setUser(result.userInfo)
                        onLoginSuccess()
                    } else {
                        viewModel.setError(error.message)
                    }
                }
            }) {
                Text("Login")
            }

            userInfo?.let {
                Text("Welcome, ${it.name ?: "Unknown"}")
            }

            if (!errorMessage.isNullOrEmpty()) {
                Text("Error: $errorMessage", color = Color.Red)
            }
        }
    }
}


