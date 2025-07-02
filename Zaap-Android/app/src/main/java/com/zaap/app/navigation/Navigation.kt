package com.zaap.app.navigation

import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navDeepLink
import com.zaap.app.presentation.HomePage
import com.zaap.app.presentation.LoginScreen
import com.zaap.app.presentation.ParentConnect
import com.zaap.app.presentation.features.ScanAndPay
import com.zaap.app.presentation.features.ScanPayCheckout
import com.zaap.app.presentation.features.TransferMoney

@Composable
fun Navigation(
    modifier: Modifier = Modifier,
    navHostController: NavHostController,
    deepLinkUri: Uri? = null
) {
    NavHost(navController = navHostController, startDestination = "ParentConnect") {
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

        composable("Login", deepLinks = listOf(navDeepLink { uriPattern = "com.zaap.app//auth" })) {
            LoginScreen(
                resultUri = deepLinkUri,
                onLoginSuccess = {
                    navHostController.navigate("Home") {
                        popUpTo("Login") {
                            inclusive = true
                        }
                    }
                })

        }

        composable("ParentConnect") {
            ParentConnect()
        }
    }
}