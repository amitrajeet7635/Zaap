package com.zaap.app.navigation

import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navDeepLink
import com.zaap.app.data.local.datastore.UserSessionManager
import com.zaap.app.presentation.HomePage
import com.zaap.app.presentation.LoginScreen
import com.zaap.app.presentation.features.ConnectToParentQRScan
import com.zaap.app.presentation.features.ParentConnect
import com.zaap.app.presentation.features.Rewards
import com.zaap.app.presentation.features.ScanAndPay
import com.zaap.app.presentation.features.ScanPayCheckout
import com.zaap.app.presentation.features.TransferMoney

@Composable
fun Navigation(
    modifier: Modifier = Modifier,
    navHostController: NavHostController,
    deepLinkUri: Uri? = null
) {

    val context = LocalContext.current
    var startDestination by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        val isLoggedIn = UserSessionManager.isLoggedIn(context)
        startDestination = if (isLoggedIn) "Home" else "Login"
    }

    startDestination?.let {
        NavHost(navController = navHostController, startDestination = it) {
            composable("Home") {
                HomePage(
                    modifier = modifier, navHostController
                )
            }
            composable("TransferMoney") {
                TransferMoney()
            }
            composable("ScanAndPay") {
                ScanAndPay(navHostController = navHostController)
            }
            composable("ScanPayCheckout") {
                ScanPayCheckout(navHostController = navHostController)
            }

            composable(
                "Login",
                deepLinks = listOf(navDeepLink { uriPattern = "com.zaap.app//auth" })
            ) {
                LoginScreen(
                    resultUri = deepLinkUri,
                    onLoginSuccess = {
                        navHostController.navigate("ParentConnect") {
                            popUpTo("Login") {
                                inclusive = true
                            }
                        }
                    })

            }

            composable("ParentConnect") {
                ParentConnect(navHostController = navHostController)
            }

            composable("ConnectToParentQRScan") {
                ConnectToParentQRScan()
            }

            composable("Rewards") {
                Rewards(navHostController = navHostController)
            }
        }
    }
}