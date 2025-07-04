package com.zaap.app.presentation.features

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.gson.Gson
import com.zaap.app.data.local.datastore.UserData
import com.zaap.app.data.local.datastore.UserSessionManager
import com.zaap.app.data.model.ConnectParentQRScanData
import com.zaap.app.presentation.modules.Scanner
import com.zaap.app.presentation.viewmodel.ConnectToParentViewModel

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun ConnectToParentQRScan(modifier: Modifier = Modifier, viewModel: ConnectToParentViewModel = hiltViewModel(), navHostController: NavHostController) {

    val context = LocalContext.current
    val connectStatus by viewModel.connectStatus.collectAsState()
    val error by viewModel.error.collectAsState()


    LaunchedEffect(connectStatus) {
        when (connectStatus) {
            true -> {
                navHostController.navigate("Home") {popUpTo("Home")}
                Toast.makeText(context, "Child connected successfully", Toast.LENGTH_SHORT).show()
            }
            false -> {
                Toast.makeText(context, error ?: "Failed to connect child", Toast.LENGTH_SHORT).show()
                navHostController.navigate("ParentConnect") {popUpTo("ParentConnect"){inclusive = true} }
            }
            null -> Unit
        }
    }

    var userData by remember { mutableStateOf<UserData?>(null) }

    LaunchedEffect(Unit) {
        userData = UserSessionManager.getUser(context)
    }

    val childAddress = userData?.publicKey.toString()


    Column(modifier = modifier.fillMaxSize()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.2f)
                .background(Color(0xFFE76C53)),
            contentAlignment = Alignment.Center
        ) {

            Text(
                "Scan QR",
                fontSize = 32.sp,
                fontWeight = FontWeight.Medium,
                color = Color.Black,
                textAlign = TextAlign.Center
            )
        }

        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black),
            contentAlignment = Alignment.Center
        ) {
            Scanner { result ->
                println("QR Result: $result")

                try {
                    val qrData = Gson().fromJson(result, ConnectParentQRScanData::class.java)
                    println("Child - ${childAddress}")
                    viewModel.connectChild(
                        childAddress = childAddress,
                        delegator = qrData.delegator,
                        token = qrData.token,
                        maxAmount = qrData.maxAmount.toLong(),
                        weeklyLimit = qrData.weeklyLimit,
                        alias = qrData.alias,
                        timestamp = qrData.timestamp
                    )
                } catch (e: Exception) {
                    println(e.message)
                    Toast.makeText(context, "Invalid QR code", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
