package com.zaap.app.presentation.features

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
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
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun TransferMoney(modifier: Modifier = Modifier) {

    var amount by remember { mutableStateOf("") }

    Box(modifier = modifier.fillMaxSize()) {
        Box(modifier = Modifier
            .fillMaxWidth()
            .fillMaxHeight(0.3f)
            .background(Color(0xFFffcc90)), contentAlignment = Alignment.Center) {

            Text(
                "Transfer",
                fontSize = 28.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.Black,
                textAlign = TextAlign.Center
            )

        }

        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                AmountInputField(amount = amount, onValueChange = { amount = it })
        }

        Box(modifier = Modifier.fillMaxSize()){
            DoneButton(modifier = Modifier.align(Alignment.BottomEnd).padding(20.dp).padding(bottom = 20.dp))
        }}
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
            keyboardType = KeyboardType.Number,
            imeAction = ImeAction.Done
        ),
        textStyle = androidx.compose.ui.text.TextStyle(
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
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
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
        }
    )
}


@Composable
fun DoneButton(modifier: Modifier = Modifier) {
    Box(modifier = modifier.clip(RoundedCornerShape(20.dp)).clickable{}.background(Color(0xFF7A89D8)).size(60.dp), contentAlignment = Alignment.Center){
        Image((Icons.AutoMirrored.Filled.ArrowForward), contentDescription = "Done")
    }
}
