package com.zaap.app.presentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun HomePage(modifier: Modifier = Modifier) {
    val statusBarHeightDp = with(LocalDensity.current) {
        WindowInsets.statusBars.getTop(this).toDp()
    }

    LazyColumn(modifier = Modifier.padding(horizontal = 20.dp)) {
        item {
            TopBar(modifier = modifier, statusBarHeightDp)
        }

        item {
            Card()
        }

    }

}


@Composable
fun TopBar(modifier: Modifier = Modifier, statusBarHeightDp: Dp) {

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(statusBarHeightDp + 10.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.Bottom,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text("Hey Ashish", fontSize = 14.sp)
            Icon(Icons.Default.AccountCircle, contentDescription = "Profile", tint = Color.White)
        }

    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Card(modfier: Modifier = Modifier) {

    Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
        ElevatedCard(
            modifier = Modifier
                .height(160.dp)
                .fillMaxWidth(0.9f)
                .padding()
        ) {
            Column(Modifier.padding(20.dp)) {
                Text("Hey Alex")
                Text("Here's how you Zaaped this month")
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Spent")
                    Text("Received")
                }
                Spacer(modifier = Modifier.height(10.dp))
                LinearProgressIndicator(
                    progress = { 0.6f },
                    strokeCap = StrokeCap.Round,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp),
                    drawStopIndicator = {})
            }
        }
    }
}