package com.zaap.app.presentation.features

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

@Composable
fun TransferMoney(modifier: Modifier = Modifier) {

    var amount by remember { mutableStateOf("") }
    val pagerState = rememberPagerState(initialPage = 0) { 2 }
    var walletAddress by remember { mutableStateOf("") }
    val coroutineScope = rememberCoroutineScope()

    Box(modifier = modifier.fillMaxSize()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.3f)
                .background(Color(0xFFffcc90)),
            contentAlignment = Alignment.Center
        ) {

            Text(
                "Transfer",
                fontSize = 32.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.Black,
                textAlign = TextAlign.Center
            )

        }

        HorizontalPager(state = pagerState, modifier = Modifier.fillMaxSize()) { page ->
            when (page) {
                0 -> WalletAddressInput(walletAddress) { walletAddress = it }
                1 -> AmountInputField(amount = amount, onValueChange = { amount = it })
            }
        }

        Box(modifier = Modifier.fillMaxSize()) {
            DoneButton(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(20.dp)
            ) {
                if (pagerState.currentPage == 0 && walletAddress.startsWith("0x") && walletAddress.length == 42) {
                    // Go to next page
                    coroutineScope.launch {
                        pagerState.animateScrollToPage(1)
                    }
                } else if (pagerState.currentPage == 1) {
                    // Send Transaction Logic Here
                    println("Send $amount to $walletAddress")
                }
            }
        }


    }
}

@Composable
fun WalletAddressInput(address: String, onValueChange: (String) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(bottom = 60.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            "Enter Wallet Address",
            fontSize = 28.sp,
            color = Color.LightGray,
            fontWeight = FontWeight.Medium
        )
        Spacer(modifier = Modifier.height(16.dp))
        BasicTextField(
            value = address,
            onValueChange = {
                if (it.length <= 42) onValueChange(it)
            },
            singleLine = true,
            cursorBrush = SolidColor(Color.LightGray),
            textStyle = TextStyle(
                fontSize = 18.sp, color = Color.White, textAlign = TextAlign.Center
            ),
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .background(Color.DarkGray, RoundedCornerShape(8.dp))
                .padding(16.dp)
        )
    }
}


@Composable
fun AmountInputField(amount: String, onValueChange: (String) -> Unit) {
    BasicTextField(
        value = amount,
        onValueChange = {
            // Accept only digits (optional)
            if (it.all { char -> char.isDigit() }) {
                onValueChange(it)
            }
        },
        singleLine = true,
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Number, imeAction = ImeAction.Done
        ),
        textStyle = TextStyle(
            fontSize = 48.sp,
            fontWeight = FontWeight.Normal,
            color = Color.LightGray,
            textAlign = TextAlign.Center
        ),
        cursorBrush = SolidColor(Color.LightGray),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        decorationBox = { innerTextField ->
            Box(
                modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center
            ) {
                if (amount.isEmpty()) {
                    Text(
                        text = "$0",
                        fontSize = 48.sp,
                        fontWeight = FontWeight.Normal,
                        color = Color.LightGray
                    )
                }
                innerTextField()
            }
        })
}


@Composable
fun DoneButton(modifier: Modifier = Modifier, onClick: () -> Unit) {
    Box(modifier = modifier
        .clip(RoundedCornerShape(20.dp))
        .clickable { onClick() }
        .background(Color(0xFF7A89D8))
        .size(60.dp), contentAlignment = Alignment.Center) {
        Image((Icons.AutoMirrored.Filled.ArrowForward), contentDescription = "Done")
    }
}
