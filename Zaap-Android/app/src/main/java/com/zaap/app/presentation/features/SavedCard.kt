package com.zaap.app.presentation.features

import android.R
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBackIosNew
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.zaap.app.data.local.datastore.UserData
import com.zaap.app.data.local.datastore.UserSessionManager
import com.zaap.app.presentation.glassEffect
import com.zaap.app.ui.theme.MatteBlack

@Composable
fun SavedCards(modifier: Modifier = Modifier, navHostController: NavHostController) {
    val context = LocalContext.current
    var userData by remember { mutableStateOf<UserData?>(null) }

    LaunchedEffect(Unit) {
        userData = UserSessionManager.getUser(context)
    }

    Box(modifier = Modifier
        .fillMaxSize()
        .background(MatteBlack)) {
        Column(Modifier.padding(20.dp)) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxHeight(0.1f)
                    .background(Color.Transparent),
            ) {
                Text(
                    "Saved Cards",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.White,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.align(Alignment.Center)
                )
                Box(
                    modifier = Modifier
                        .align(Alignment.CenterStart)
                        .clip(RoundedCornerShape(50.dp))
                        .clickable { navHostController.popBackStack() }
                        .glassEffect(50.dp)
                        .padding(8.dp)
                        ) {
                    Icon(
                        Icons.Default.ArrowBackIosNew,
                        contentDescription = null,
                        tint = Color.Black,
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
            }

            Spacer(modifier = Modifier.height(40.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(RoundedCornerShape(18.dp))
                    .background(Color(0xFF7A89D8))
            ) {
                Text(userData?.name.toString(), modifier = Modifier.padding(20.dp).align(Alignment.TopStart), color = Color.Black, fontWeight = FontWeight.Medium, fontSize = 14.sp)
                Text(userData?.publicKey.toString(), modifier = Modifier.padding(20.dp).align(Alignment.BottomStart), color = Color.Black, fontWeight = FontWeight.Medium, fontSize = 6.sp)

                Text("Balance : $234.67", modifier = Modifier.padding(20.dp).align(Alignment.Center), color = Color.Black, fontWeight = FontWeight.Medium, fontSize = 22.sp)

                Text("Metamask", modifier = Modifier.padding(20.dp).align(Alignment.BottomEnd), color = Color.Black, fontWeight = FontWeight.SemiBold)

            }
            Spacer(modifier = Modifier.height(40.dp))

            Text("Metamask Card is not availbale in your region", modifier = Modifier.padding(20.dp), color = Color.White, fontWeight = FontWeight.Medium, fontSize = 22.sp)

        }


    }

}

