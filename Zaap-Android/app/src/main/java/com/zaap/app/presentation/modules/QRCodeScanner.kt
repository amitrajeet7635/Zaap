package com.zaap.app.presentation.modules


import android.annotation.SuppressLint
import androidx.compose.foundation.Canvas
import androidx.compose.ui.graphics.Path
import android.util.Log
import androidx.camera.core.AspectRatio
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import java.util.concurrent.Executors

// Composable that integrates the camera preview and ML Kit Barcode Scanning.
// It takes a callback function to return the scanned QR code result.
@Composable
fun Scanner(onQrCodeScanned: (String) -> Unit) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    // Remember the camera provider to manage camera lifecycle.
    val cameraProviderFuture = remember {
        ProcessCameraProvider.getInstance(context)
    }

    // AndroidView allows embedding an Android View (like PreviewView) inside Compose.
    AndroidView(
        factory = { ctx ->
            PreviewView(ctx).apply {
                this.scaleType = PreviewView.ScaleType.FILL_CENTER
            }
        },
        modifier = Modifier.fillMaxSize(),
        update = { previewView ->
            // This block is executed when the view is created or recomposed.
            cameraProviderFuture.addListener({
                val cameraProvider = cameraProviderFuture.get()
                bindCameraUseCases(
                    cameraProvider,
                    lifecycleOwner,
                    previewView,
                    onQrCodeScanned
                )
            }, ContextCompat.getMainExecutor(context))
        }
    )

    Canvas(modifier = Modifier.fillMaxSize()) {
        val borderWidth = 4.dp.toPx() // Thickness of the border lines
        val cornerLength = 40.dp.toPx() // Length of each corner line
        val boxSizeRatio = 0.7f // The scanning box will take 70% of the canvas width/height

        val canvasWidth = size.width
        val canvasHeight = size.height

        // Calculate the size of the inner scanning box
        val boxWidth = canvasWidth * boxSizeRatio
        val boxHeight = canvasWidth * boxSizeRatio // Make it a square box, based on width

        // Calculate the top-left offset to center the box
        val offsetX = (canvasWidth - boxWidth) / 2
        val offsetY = (canvasHeight - boxHeight) / 2

        val path = Path()

        // Top-left corner
        path.moveTo(offsetX, offsetY + cornerLength)
        path.lineTo(offsetX, offsetY)
        path.lineTo(offsetX + cornerLength, offsetY)

        // Top-right corner
        path.moveTo(offsetX + boxWidth - cornerLength, offsetY)
        path.lineTo(offsetX + boxWidth, offsetY)
        path.lineTo(offsetX + boxWidth, offsetY + cornerLength)

        // Bottom-right corner
        path.moveTo(offsetX + boxWidth, offsetY + boxHeight - cornerLength)
        path.lineTo(offsetX + boxWidth, offsetY + boxHeight)
        path.lineTo(offsetX + boxWidth - cornerLength, offsetY + boxHeight)

        // Bottom-left corner
        path.moveTo(offsetX + cornerLength, offsetY + boxHeight)
        path.lineTo(offsetX, offsetY + boxHeight)
        path.lineTo(offsetX, offsetY + boxHeight - cornerLength)

        // Draw the path with a stroke
        drawPath(
            path = path,
            color = Color(0xFFffcc90), // Match the header color
            style = Stroke(width = borderWidth)
        )

        // Optionally, draw a semi-transparent overlay outside the scanning box
        // This makes the scanning area stand out more.
        drawRect(
            color = Color.Black,
            alpha = 0.5f,
            size = Size(canvasWidth, canvasHeight)
        )
        // Draw a transparent rectangle in the middle to "cut out" the scanning area
        drawRect(
            color = Color.Transparent,
            topLeft = Offset(offsetX, offsetY),
            size = Size(boxWidth, boxHeight),
            blendMode = BlendMode.Clear // Clears the pixels in this area
        )
    }

    // DisposableEffect ensures resources are released when the composable leaves the composition.
    DisposableEffect(Unit) {
        onDispose {
            // Unbind camera use cases when the scanner is no longer needed.
            cameraProviderFuture.get().unbindAll()
        }
    }
}

// Binds camera use cases (Preview and ImageAnalysis) to the lifecycle.
private fun bindCameraUseCases(
    cameraProvider: ProcessCameraProvider,
    lifecycleOwner: LifecycleOwner,
    previewView: PreviewView,
    onQrCodeScanned: (String) -> Unit
) {
    val cameraSelector = CameraSelector.Builder()
        .requireLensFacing(CameraSelector.LENS_FACING_BACK) // Use the back camera.
        .build()

    val preview = Preview.Builder()
        .setTargetAspectRatio(AspectRatio.RATIO_4_3) // Set aspect ratio for preview.
        .build()
        .also {
            it.setSurfaceProvider(previewView.surfaceProvider) // Connect preview to the PreviewView.
        }

    // Configure Barcode Scanner options (only QR codes for this example).
    val options = BarcodeScannerOptions.Builder()
        .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
        .build()

    val barcodeScanner = BarcodeScanning.getClient(options)
    val analysisExecutor = Executors.newSingleThreadExecutor() // Executor for image analysis.

    val imageAnalysis = ImageAnalysis.Builder()
        .setTargetAspectRatio(AspectRatio.RATIO_4_3) // Set aspect ratio for analysis.
        .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST) // Process only the latest frame.
        .build()
        .also {
            it.setAnalyzer(analysisExecutor) { imageProxy ->
                // Analyze the image frame for barcodes.
                processImageProxy(barcodeScanner, imageProxy, onQrCodeScanned)
            }
        }

    // Unbind existing use cases before binding new ones to prevent conflicts.
    cameraProvider.unbindAll()

    try {
        // Bind the camera to the lifecycle with the defined use cases.
        cameraProvider.bindToLifecycle(
            lifecycleOwner,
            cameraSelector,
            preview,
            imageAnalysis
        )
    } catch (exc: Exception) {
        Log.e("ScanAndPayScanner", "Use case binding failed", exc)
    }
}

// Processes an ImageProxy frame for barcode detection using ML Kit.
@SuppressLint("UnsafeOptInUsageError") // Suppress warning for experimental ImageProxy method
private fun processImageProxy(
    barcodeScanner: com.google.mlkit.vision.barcode.BarcodeScanner,
    imageProxy: ImageProxy,
    onQrCodeScanned: (String) -> Unit
) {
    // Get the media image from the ImageProxy.
    val mediaImage = imageProxy.image
    if (mediaImage != null) {
        // Create an InputImage from the media image.
        val image = InputImage.fromMediaImage(
            mediaImage,
            imageProxy.imageInfo.rotationDegrees
        )

        // Process the image with the barcode scanner.
        barcodeScanner.process(image)
            .addOnSuccessListener { barcodes ->
                // If barcodes are detected, iterate through them.
                if (barcodes.isNotEmpty()) {
                    for (barcode in barcodes) {
                        // Log the raw value of the barcode.
                        Log.d("ScanAndPayScanner", "Barcode detected: ${barcode.rawValue}")
                        // Invoke the callback with the scanned QR code value.
                        barcode.rawValue?.let {
                            onQrCodeScanned(it)
                            // Optionally, stop analysis after the first successful scan
                            // imageAnalysis.clearAnalyzer() if you want to stop scanning after one QR code.
                        }
                    }
                }
            }
            .addOnFailureListener { e ->
                // Log any failures during barcode scanning.
                Log.e("ScanAndPayScanner", "Barcode scanning failed", e)
            }
            .addOnCompleteListener {
                // Close the image proxy to release the image buffer, crucial for continuous analysis.
                imageProxy.close()
            }
    }
}
