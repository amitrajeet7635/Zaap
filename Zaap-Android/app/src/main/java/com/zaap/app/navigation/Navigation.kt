package com.zaap.app.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.zaap.app.presentation.HomePage
import com.zaap.app.presentation.features.ScanAndPay
import com.zaap.app.presentation.features.TransferMoney

@Composable
fun Navigation(modifier: Modifier = Modifier, navHostController: NavHostController) {
    NavHost(navController = navHostController, startDestination = "Home") {
        composable("Home") {
            HomePage(
                modifier = modifier, navHostController
            )
        }
        composable("TransferMoney") {
            TransferMoney()
        }
        composable("ScanAndPay") {
            ScanAndPay()
        }
    }
}