package com.zaap.app.presentation.features

import android.widget.Toast
import androidx.compose.foundation.Image
import com.zaap.app.R
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.airbnb.lottie.compose.LottieAnimation
import com.airbnb.lottie.compose.LottieCompositionSpec
import com.airbnb.lottie.compose.LottieConstants
import com.airbnb.lottie.compose.rememberLottieComposition
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.zaap.app.ui.theme.MatteBlack

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun ParentConnect(modifier: Modifier = Modifier.background(Color(0xFFE76C53)), navHostController: NavHostController) {

    val permissionState =
        rememberPermissionState(android.Manifest.permission.CAMERA)
    var shouldNavigate by remember { mutableStateOf(false) }

    LaunchedEffect(permissionState.status.isGranted, shouldNavigate) {
        if (shouldNavigate && permissionState.status.isGranted) {
            navHostController.navigate("ConnectToParentQRScan")
            shouldNavigate = false // reset
        }
    }


    val qr_pairing_animation by rememberLottieComposition(spec = LottieCompositionSpec.RawRes(R.raw.qrpair))
    Box(
        modifier = modifier
            .fillMaxSize()
            .padding(20.dp)
    ) {

        Column(modifier = Modifier.fillMaxSize(), verticalArrangement = Arrangement.Center) {

            Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.TopCenter) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) {}) {
                    Image(
                        painter = painterResource(R.drawable.family),
                        contentDescription = "Zaap Circle",
                        modifier = Modifier.size(50.dp)
                    )
                    Spacer(Modifier.width(7.dp))
                    Column() {
                        Text(
                            "Zaap",
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color.Black
                        )
                        Text(
                            "CircleLink",
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color.Black
                        )
                    }
                }
            }

            Spacer(Modifier.height(60.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 20.dp),
                contentAlignment = Alignment.Center
            ) {
                Text("Link your Parent Wallet", color = Color.Black, fontSize = 22.sp, fontWeight = FontWeight.Medium)
            }

            Spacer(Modifier.height(10.dp))



            Column(horizontalAlignment = Alignment.Start) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(vertical = 8.dp)
                ) {

                    Box(
                        modifier = Modifier
                            .background(Color.Transparent)
                            .size(24.dp)
                            .border(width = 2.dp, color = Color.Black, shape = CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "1", color = Color.Black, fontSize = 14.sp, fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Text(
                        text = "Open your parent's dashboard", color = Color.Black, fontSize = 16.sp
                    )
                }


                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(vertical = 8.dp)
                ) {

                    Box(
                        modifier = Modifier
                            .background(Color.Transparent)
                            .size(24.dp)
                            .border(width = 2.dp, color = Color.Black, shape = CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "2", color = Color.Black, fontSize = 14.sp, fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Text(
                        text = "Click to show QR code", color = Color.Black, fontSize = 16.sp
                    )
                }


                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(vertical = 8.dp)
                ) {

                    Box(
                        modifier = Modifier
                            .background(Color.Transparent)
                            .size(24.dp)
                            .border(width = 2.dp, color = Color.Black, shape = CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "3", color = Color.Black, fontSize = 14.sp, fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Text(
                        text = "Scan the QR Code", color = Color.Black, fontSize = 16.sp
                    )
                }
            }

            Spacer(Modifier.height(40.dp))

            Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                LottieAnimation(qr_pairing_animation, iterations = LottieConstants.IterateForever, modifier = Modifier.alpha(0.8f))
            }

            Spacer(Modifier.height(40.dp))

            Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                Button(onClick = {
                    if (!permissionState.status.isGranted){
                        permissionState.launchPermissionRequest()
                        shouldNavigate = true
                    } else {
                        navHostController.navigate("ConnectToParentQRScan")
                    }
                }, modifier = Modifier.fillMaxWidth(0.9f), colors = ButtonDefaults.buttonColors(MatteBlack)) {
                    Text(text = "Scan QR", fontSize = 18.sp, fontWeight = FontWeight.Medium, color = Color.White)
                }
            }
        }
    }
}
