package com.zaap.app.presentation.features

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.zaap.app.presentation.modules.ScanAndPayScanner
import com.zaap.app.presentation.viewmodel.ScanDataViewModel

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun ScanAndPay(
    modifier: Modifier = Modifier,
    navHostController: NavHostController,
    scanDataViewModel: ScanDataViewModel = hiltViewModel()
) {

    var scannedResult by remember { mutableStateOf<String?>(null) }
    val permissionState = rememberPermissionState(android.Manifest.permission.CAMERA)

    if (!permissionState.status.isGranted) {
        Box(
            modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center
        ) {
            Text("Camera permission required to scan QR codes.")
            // You could add a button here to request permission again
        }
    } else {
        Column(modifier = modifier.fillMaxSize()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxHeight(0.2f)
                    .background(Color(0xFFffcc90)), contentAlignment = Alignment.Center
            ) {

                Text(
                    "Scan & Pay",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.SemiBold,
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
                ScanAndPayScanner { result ->
                    scanDataViewModel.setScannedData(result)
                    navHostController.navigate("ScanPayCheckout")
                }
            }
        }
    }
}

