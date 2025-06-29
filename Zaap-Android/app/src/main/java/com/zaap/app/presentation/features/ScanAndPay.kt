package com.zaap.app.presentation.features

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions
import com.zaap.app.presentation.modules.ScanAndPayScanner

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun ScanAndPay(modifier: Modifier = Modifier) {

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
                    scannedResult = result
                }

                scannedResult?.let { result ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth(0.8f) // 80% width of its parent
                            .padding(16.dp)
                            .align(Alignment.BottomCenter), // Position at the bottom center
                        shape = RoundedCornerShape(12.dp), // Rounded corners
                        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp), // Shadow
                        colors = CardDefaults.cardColors(containerColor = Color.White) // White background for the card
                    ) {
                        Column(
                            modifier = Modifier
                                .padding(20.dp)
                                .fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "Scanned QR Code:",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.DarkGray
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = result,
                                fontSize = 16.sp,
                                color = Color.Black,
                                textAlign = TextAlign.Center
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "Processing payment...", // Placeholder for actual payment logic
                                fontSize = 14.sp, color = Color.Gray
                            )
                        }
                    }
                }
            }
        }
    }
}


@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun ScanAndPay(onCodeScanned: (String) -> Unit) {
    val permissionState = rememberPermissionState(android.Manifest.permission.CAMERA)
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    val options = GmsBarcodeScannerOptions.Builder().setBarcodeFormats(
            Barcode.FORMAT_QR_CODE,
        ).enableAutoZoom().build()



    if (permissionState.status.isGranted) {

    } else {
        Box(
            Modifier.fillMaxSize(), contentAlignment = Alignment.Center
        ) {
            Text("Camera permission required", color = Color.Red)
        }
    }
}


//@Composable
//fun CameraPreviewView(modifier: Modifier = Modifier) {
//    val context = LocalContext.current
//    val lifecycleOwner = LocalLifecycleOwner.current
//
//    AndroidView(
//        modifier = modifier,
//        factory = { ctx ->
//            val previewView = PreviewView(ctx)
//
//            val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
//            cameraProviderFuture.addListener({
//                val cameraProvider = cameraProviderFuture.get()
//
//                val preview = Preview.Builder().build().also {
//                    it.setSurfaceProvider(previewView.surfaceProvider)
//                }
//
//                val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
//
//                try {
//                    cameraProvider.unbindAll()
//                    cameraProvider.bindToLifecycle(
//                        lifecycleOwner, cameraSelector, preview
//                    )
//                } catch (e: Exception) {
//                    e.printStackTrace()
//                }
//
//            }, ContextCompat.getMainExecutor(ctx))
//
//            previewView
//        }
//    )
//}
