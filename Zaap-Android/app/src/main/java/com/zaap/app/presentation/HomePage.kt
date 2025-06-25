package com.zaap.app.presentation

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ElevatedButton
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.zaap.app.R

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

        item {
            QuickActions()
        }

        item {
            RewardsCard()
        }
        item {
            DetailedSection()
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

@Composable
fun Card(modifier: Modifier = Modifier) {

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

@Composable
fun QuickActions(modifier: Modifier = Modifier.padding(vertical = 10.dp)) {
    Box(modifier = modifier.fillMaxWidth()) {
        Row(horizontalArrangement = Arrangement.SpaceEvenly, modifier = Modifier.fillMaxWidth()) {

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                ElevatedButton(
                    onClick = {},
                    shape = ButtonDefaults.elevatedShape,
                    modifier = Modifier.size(60.dp),
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Icon(
                        painter = painterResource(R.drawable.qr_code_scanner_24dp),
                        contentDescription = "QR Code"
                    )
                }

                Text("Scan & Pay")
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                ElevatedButton(
                    onClick = {},
                    shape = ButtonDefaults.elevatedShape,
                    modifier = Modifier.size(60.dp),
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Icon(
                        painter = painterResource(R.drawable.south_west_),
                        contentDescription = "QR Code"
                    )
                }
                Text("Deposit")
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                ElevatedButton(
                    onClick = {},
                    shape = ButtonDefaults.elevatedShape,
                    modifier = Modifier.size(60.dp),
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Icon(
                        painter = painterResource(R.drawable.swap_vert_24dp),
                        contentDescription = "QR Code"
                    )
                }
                Text("Transfer")
            }


        }
    }
}

@Composable
fun RewardsCard(modifier: Modifier = Modifier) {
    ElevatedCard(
        modifier = Modifier
            .fillMaxWidth()
            .height(140.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text("Get Rewards on each payments !! ")
            Text("Tap to know more")
        }
    }
}

@Composable
fun DetailedSection(modifier: Modifier = Modifier) {
    Column(modifier = Modifier
        .padding(vertical = 10.dp)
        .fillMaxWidth()) {

        Box(modifier = Modifier
            .fillMaxWidth()
            .clickable {}
            .padding(vertical = 12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Check spending history")
                Icon(
                    Icons.AutoMirrored.Filled.ArrowForwardIos,
                    contentDescription = null,
                    Modifier.size(14.dp)
                )
            }
        }

        Box(modifier = Modifier
            .fillMaxWidth()
            .clickable {}
            .padding(vertical = 12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Saved Cards")
                Icon(
                    Icons.AutoMirrored.Filled.ArrowForwardIos,
                    contentDescription = null,
                    Modifier.size(14.dp)
                )
            }
        }
        Box(modifier = Modifier
            .fillMaxWidth()
            .clickable {}
            .padding(vertical = 12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Your monthly budget planning")
                Icon(
                    Icons.AutoMirrored.Filled.ArrowForwardIos,
                    contentDescription = null,
                    Modifier.size(14.dp)
                )
            }
        }

    }
}