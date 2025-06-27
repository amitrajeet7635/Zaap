package com.zaap.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import com.zaap.app.R


val Fredoka = FontFamily(
    Font(R.font.fredoka_regular, FontWeight.Normal),
    Font(R.font.fredoka_bold, FontWeight.Bold),
    Font(R.font.fredoka_light, FontWeight.Light),
    Font(R.font.fredoka_medium, FontWeight.Medium),
    Font(R.font.fredoka_semibold, FontWeight.SemiBold),
)

val fredokaSemiExpanded = FontFamily(
    Font(R.font.fredoka_semiexpanded_bold, weight = FontWeight.Bold)
)


// Set of Material typography styles to start with
val Typography = Typography().copy(
    displayLarge = Typography().displayLarge.copy(
        fontFamily = Fredoka // Apply Fredoka to this specific style
        // Keep other properties from default displayLarge or customize as needed
    ), displayMedium = Typography().displayMedium.copy(
        fontFamily = Fredoka
    ), displaySmall = Typography().displaySmall.copy(
        fontFamily = Fredoka
    ), headlineLarge = Typography().headlineLarge.copy(
        fontFamily = Fredoka
    ), headlineMedium = Typography().headlineMedium.copy(
        fontFamily = Fredoka
    ), headlineSmall = Typography().headlineSmall.copy(
        fontFamily = Fredoka
    ), titleLarge = Typography().titleLarge.copy(
        fontFamily = Fredoka
    ), titleMedium = Typography().titleMedium.copy(
        fontFamily = Fredoka
    ), titleSmall = Typography().titleSmall.copy(
        fontFamily = Fredoka
    ), bodyLarge = Typography().bodyLarge.copy(
        fontFamily = Fredoka
    ), bodyMedium = Typography().bodyMedium.copy(
        fontFamily = Fredoka
    ), bodySmall = Typography().bodySmall.copy(
        fontFamily = Fredoka
    ), labelLarge = Typography().labelLarge.copy(
        fontFamily = Fredoka
    ), labelMedium = Typography().labelMedium.copy(
        fontFamily = Fredoka
    ), labelSmall = Typography().labelSmall.copy(
        fontFamily = Fredoka
    )
)