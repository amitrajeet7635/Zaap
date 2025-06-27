package com.zaap.app.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.GenericShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedButton
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.material3.VerticalDivider
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.airbnb.lottie.compose.LottieAnimation
import com.airbnb.lottie.compose.LottieCompositionSpec
import com.airbnb.lottie.compose.LottieConstants
import com.airbnb.lottie.compose.rememberLottieComposition
import com.zaap.app.R
import com.zaap.app.ui.theme.MatteBlack
import com.zaap.app.ui.theme.fredokaSemiExpanded

@Composable
fun HomePage(modifier: Modifier = Modifier) {
    val statusBarHeightDp = with(LocalDensity.current) {
        WindowInsets.statusBars.getTop(this).toDp()
    }

    LazyColumn(modifier = Modifier.padding(horizontal = 0.dp)) {
        item {
            Column(
                Modifier
                    .clip(RoundedCornerShape(bottomEnd = 40.dp, bottomStart = 40.dp))
                    .background(Color(0xFF9cacff))
            ) {
                TopBar(modifier = Modifier, statusBarHeightDp)
                Card()
            }
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

        item {
            BrandingLogo(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 5.dp)
                    .height(180.dp)
            )
        }
    }
}


@Composable
fun TopBar(modifier: Modifier = Modifier, statusBarHeightDp: Dp) {

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(statusBarHeightDp + 50.dp)
            .padding()
            .padding(20.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.Bottom,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(
                "Hey Ashish,", fontSize = 18.sp, color = Color.Black, fontWeight = FontWeight.Medium
            )
            Icon(Icons.Default.AccountCircle, contentDescription = "Profile", tint = Color.Black)
        }

    }
}

@Composable
fun Card(modifier: Modifier = Modifier) {

    val composition by rememberLottieComposition(LottieCompositionSpec.RawRes(R.raw.cute_cat))
    val peekShape = GenericShape { size, _ ->
        lineTo(size.width, 0.5f)
        lineTo(size.width, 0.5f)
        lineTo(size.width, size.height / 2)
        lineTo(0f, size.height / 2)
        close()
    }
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 24.dp),
    ) {
        BoxWithConstraints(
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight()
        ) {

            val screenWidth = maxWidth

            val pandaSize = screenWidth * 0.22f
            val pandaOffsetY = (-pandaSize * 0.75f)
            Box(
                modifier = Modifier
                    .size(pandaSize)
                    .offset(x = 0.dp, y = pandaOffsetY)
                    .align(Alignment.TopStart)
                    .clipToBounds()
            ) {
                LottieAnimation(
                    composition,
                    modifier = Modifier.fillMaxSize(),
                    iterations = LottieConstants.IterateForever
                )
            }
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(Color.Transparent),
                modifier = Modifier
                    .fillMaxWidth(0.9f)
                    .align(Alignment.Center)

            ) {
                Column(
                    Modifier
                        .fillMaxSize()
                        .glassEffect(16.dp)
                        .padding(20.dp)
                ) {


                    Text(
                        "Here's how you Zaaped this month",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.Black,
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 10.dp)
                    ) {

                        Column(Modifier.fillMaxWidth(0.5f), horizontalAlignment = Alignment.Start) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .width(126.dp)
                                    .clip(RoundedCornerShape(50)) // pill shape
                                    .background(Color(0x63F6F6F6)) // light background
                                    .padding(horizontal = 8.dp, vertical = 6.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(CircleShape)
                                        .background(Color(0xFF9CACFF)), // purple circle
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        painter = painterResource(R.drawable.arrow_up),
                                        contentDescription = "Expense",
                                        tint = Color.Black,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.width(8.dp)) // spacing between icon and text

                                Text(
                                    text = "Expense",
                                    color = Color.Black,
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 14.sp,
                                )

                            }
                            Text(
                                "$ 1200",
                                Modifier.padding(horizontal = 5.dp),
                                color = Color.Black,
                                fontSize = 24.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }

                        Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.End) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .width(126.dp)
                                    .clip(RoundedCornerShape(50)) // pill shape
                                    .background(Color(0x63F6F6F6)) // light background
                                    .padding(horizontal = 8.dp, vertical = 6.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(CircleShape)
                                        .background(Color(0xFF9CACFF)), // purple circle
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        painter = painterResource(R.drawable.arrow_down),
                                        contentDescription = "Transfer",
                                        tint = Color.Black,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.width(8.dp)) // spacing between icon and text

                                Text(
                                    text = "Received",
                                    color = Color.Black,
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 14.sp
                                )

                                Spacer(modifier = Modifier.width(8.dp))
                            }
                            Text(
                                "$ 2100",
                                Modifier.padding(horizontal = 5.dp),
                                color = Color.Black,
                                fontSize = 24.sp,
                                fontWeight = FontWeight.SemiBold
                            )

                        }
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    LinearProgressIndicator(
                        color = Color(0xFFFFFFFF),
                        trackColor = Color(0xFF7A89D8),
                        progress = { 0.6f },
                        strokeCap = StrokeCap.Square,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(50.dp))
                            .height(12.dp),
                        drawStopIndicator = {})
                }
            }
        }
    }
}

@Composable
fun QuickActions(modifier: Modifier = Modifier.padding(vertical = 10.dp)) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(118.dp)
            .clip(RoundedCornerShape(40.dp))
            .background(Color(0xFFffcc90))
            .padding(12.dp)
    ) {

        Row(
            horizontalArrangement = Arrangement.SpaceAround,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 5.dp)
        ) {

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                ElevatedButton(
                    colors = ButtonDefaults.elevatedButtonColors(MatteBlack),
                    onClick = {},
                    shape = ButtonDefaults.elevatedShape,
                    modifier = Modifier.size(60.dp),
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Icon(
                        painter = painterResource(R.drawable.qr_code_scanner_24dp),
                        tint = Color.White,
                        contentDescription = "QR Code"
                    )
                }

                Text(
                    "Scan & Pay",
                    color = Color.Black,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium
                )
            }

            VerticalDivider(
                thickness = 1.5.dp, modifier = Modifier
                    .fillMaxHeight()
                    .padding(vertical = 5.dp)
            )

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                ElevatedButton(
                    onClick = {},
                    shape = ButtonDefaults.elevatedShape,
                    modifier = Modifier.size(60.dp),
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Icon(
                        painter = painterResource(R.drawable.south_west_),
                        contentDescription = "Deposit",
                        tint = Color.White
                    )
                }
                Text(
                    "Deposit", color = Color.Black, fontSize = 14.sp, fontWeight = FontWeight.Medium
                )
            }

            VerticalDivider(
                thickness = 1.5.dp, modifier = Modifier
                    .fillMaxHeight()
                    .padding(vertical = 5.dp)
            )


            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                ElevatedButton(
                    onClick = {},
                    shape = ButtonDefaults.elevatedShape,
                    modifier = Modifier.size(60.dp),
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Icon(
                        painter = painterResource(R.drawable.swap_vert_24dp),
                        contentDescription = "transfer",
                        tint = Color.White
                    )
                }
                Text(
                    "Transfer",
                    color = Color.Black,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium
                )
            }

        }

//            Row(
//                horizontalArrangement = Arrangement.SpaceEvenly,
//                modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp)
//            ) {
//
//                Column(horizontalAlignment = Alignment.CenterHorizontally) {
//                    ElevatedButton(
//                        onClick = {},
//                        shape = ButtonDefaults.elevatedShape,
//                        modifier = Modifier.size(60.dp),
//                        contentPadding = PaddingValues(0.dp)
//                    ) {
//                        Icon(
//                            painter = painterResource(R.drawable.link),
//                            contentDescription = "Linked Accounts",
//                            tint = Color.White
//                        )
//                    }
//
//                    Text(
//                        "Linked Accounts",
//                        color = Color.Black,
//                        fontSize = 14.sp,
//                        fontWeight = FontWeight.Medium
//                    )
//                }
//
//                Column(horizontalAlignment = Alignment.CenterHorizontally) {
//                    ElevatedButton(
//                        onClick = {},
//                        shape = ButtonDefaults.elevatedShape,
//                        modifier = Modifier.size(60.dp),
//                        contentPadding = PaddingValues(0.dp)
//                    ) {
//                        Icon(
//                            painter = painterResource(R.drawable.heart_handshake),
//                            contentDescription = "Referrals",
//                            tint = Color.White
//                        )
//                    }
//                    Text(
//                        "Refer & Earn",
//                        color = Color.Black,
//                        fontSize = 14.sp,
//                        fontWeight = FontWeight.Medium
//                    )
//                }
//
//
//            }
    }
}


@Composable
fun RewardsCard(modifier: Modifier = Modifier) {
    ElevatedCard(
        shape = RoundedCornerShape(40.dp),
        colors = CardDefaults.elevatedCardColors(Color(0xFF80d8b8)),
        modifier = Modifier.fillMaxWidth()

    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text(
                "Get Rewards on each payments ! ",
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = Color.Black
            )
            Text(
                "Tap to know more",
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = Color.Black
            )
        }
    }
}

@Composable
fun DetailedSection(modifier: Modifier = Modifier) {
    Column(
        modifier = Modifier
            .padding(vertical = 10.dp)
            .fillMaxWidth()
    ) {

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


@Composable
fun BrandingLogo(modifier: Modifier = Modifier) {
    Box(modifier = modifier.fillMaxSize(), contentAlignment = Alignment.BottomCenter) {
        Text(
            "Zaap",
            fontSize = 70.sp,
            textAlign = TextAlign.Center,
            color = Color(0x43575757),
            fontFamily = fredokaSemiExpanded,
            fontStyle = FontStyle.Italic,
            fontWeight = FontWeight.Bold,
            modifier = Modifier
        )
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

fun Modifier.darkGlassEffect() = this
    .background(
        brush = Brush.verticalGradient(
            colors = listOf(
                Color.Black.copy(alpha = 0.3f), Color.Black.copy(alpha = 0.1f)
            )
        )
    )
    .border(
        width = 1.dp, brush = Brush.verticalGradient(
            colors = listOf(
                Color.White.copy(alpha = 0.2f), Color.White.copy(alpha = 0.05f)
            )
        ), shape = RoundedCornerShape(20.dp)
    )