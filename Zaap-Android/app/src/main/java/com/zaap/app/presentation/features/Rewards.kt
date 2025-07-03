package com.zaap.app.presentation.features

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController

@Composable
fun Rewards(modifier: Modifier = Modifier, navHostController: NavHostController) {

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF99D9C1))) {
        Box(
            modifier = Modifier
                .fillMaxWidth().padding(20.dp)
                .fillMaxHeight(0.1f)
                .background(Color.Transparent),
        ) {
            Text(
                "Rewards",
                fontSize = 22.sp,
                fontWeight = FontWeight.Medium,
                color = Color.Black,
                textAlign = TextAlign.Center, modifier = Modifier.align(Alignment.Center)
            )
                Box(
                    modifier = Modifier .align(Alignment.CenterStart).clip(RoundedCornerShape(50.dp)).glassEffect(50.dp)
                        .padding(8.dp).clickable { navHostController.popBackStack() }
                ) {
                    Icon(
                        Icons.Default.ArrowBackIosNew,
                        contentDescription = null,
                        tint = Color.Black,
                        modifier = Modifier.align(Alignment.Center)
                    )
                }



        }
        Column(modifier = Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.Center) {


            Text("Earn Cashbacks & Rewards on every spend !", fontSize = 42.sp, fontWeight = FontWeight.Normal, lineHeight = 46.sp, color = Color.Black)
            Spacer(modifier = Modifier.height(24.dp))

            Box(modifier = Modifier.clip(RoundedCornerShape(50.dp)).glassEffect(50.dp).padding(10.dp)) {
                Text(
                    "Coming soon !",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Normal,
                    color = Color.Black,

                )
            }

        }
    }
}

fun Modifier.glassEffect(roundedCorner: Dp) = this
    .background(
        brush = Brush.verticalGradient(
            colors = listOf(
                Color.White.copy(alpha = 0.25f), Color.White.copy(alpha = 0.15f)
            )
        )
    )
    .border(
        width = 1.dp, brush = Brush.verticalGradient(
            colors = listOf(
                Color.White.copy(alpha = 0.4f), Color.White.copy(alpha = 0.1f)
            )
        ), shape = RoundedCornerShape(roundedCorner)
    )
