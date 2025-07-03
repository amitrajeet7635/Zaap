package com.zaap.app.presentation

import android.annotation.SuppressLint
import android.app.Activity
import android.content.ContextWrapper
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.web3auth.core.Web3Auth
import com.web3auth.core.types.BuildEnv
import com.web3auth.core.types.ExtraLoginOptions
import com.web3auth.core.types.LoginParams
import com.web3auth.core.types.Network
import com.web3auth.core.types.Provider
import com.web3auth.core.types.Web3AuthOptions
import com.zaap.app.BuildConfig
import com.zaap.app.R
import com.zaap.app.core.utils.Web3Utils
import com.zaap.app.data.local.datastore.UserSessionManager
import com.zaap.app.presentation.viewmodel.AuthViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@Composable
fun getActivity(): Activity {
    val context = LocalContext.current
    return remember(context) {
        var ctx = context
        while (ctx is ContextWrapper) {
            if (ctx is Activity) return@remember ctx
            ctx = ctx.baseContext
        }
        throw IllegalStateException("Activity not found in context chain.")
    }
}

@SuppressLint("ContextCastToActivity")
@Composable
fun LoginScreen(
    resultUri: Uri?, viewModel: AuthViewModel = hiltViewModel(), onLoginSuccess: () -> Unit
) {

    @SuppressLint("ContextCast") val activity = getActivity()

    var email by remember { mutableStateOf("") }


    viewModel.userInfo
    viewModel.errorMessage
    val ClientId = BuildConfig.Web3Auth_ClientID

    val web3Auth = remember(activity) {
        Web3Auth(
            Web3AuthOptions(
                ClientId,
                Network.SAPPHIRE_DEVNET,
                BuildEnv.PRODUCTION,
                Uri.parse("com.zaap.app://auth")
            ), activity
        )
    }


    LaunchedEffect(resultUri) {
        if (resultUri != null) {
            web3Auth.setResultUrl(resultUri)
            web3Auth.initialize().whenComplete { _, error ->
                if (error == null) {
                    val userInfo = web3Auth.getUserInfo()
                    viewModel.setUser(userInfo)

                    CoroutineScope(Dispatchers.IO).launch {
                        val privateKey = web3Auth.getPrivkey()
                        val publicKey = Web3Utils.getPublicAddressFromPrivateKey(privateKey)
                        UserSessionManager.saveUser(
                            context = activity,
                            email = userInfo?.email,
                            name = userInfo?.name,
                            profileImage = userInfo?.profileImage,
                            privateKey = privateKey,
                            publicKey = publicKey
                        )
                        withContext(Dispatchers.Main) {
                            onLoginSuccess()
                        }
                    }
                } else {
                    viewModel.setError(error.message)
                }
            }
        }
    }

    fun login(loginParams: LoginParams) {
        web3Auth.login(loginParams).whenComplete { result, error ->
            if (error == null && result.userInfo != null) {
                val userInfo = result.userInfo
                viewModel.setUser(userInfo)
                CoroutineScope(Dispatchers.IO).launch {
                    val privateKey = web3Auth.getPrivkey()
                    val publicKey = Web3Utils.getPublicAddressFromPrivateKey(privateKey)
                    UserSessionManager.saveUser(
                        context = activity,
                        email = userInfo?.email,
                        name = userInfo?.name,
                        profileImage = userInfo?.profileImage,
                        privateKey = privateKey,
                        publicKey = publicKey
                    )
                    withContext(Dispatchers.Main) {
                        onLoginSuccess()
                    }
                }
            } else {
                viewModel.setError(error.message)
            }
        }
    }


//    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
//        Column(horizontalAlignment = Alignment.CenterHorizontally) {
//            Button(onClick = {}) {
//                Text("Login")
//            }
//
//            userInfo?.let {
//                Text("Welcome, ${it.name ?: "Unknown"}")
//            }
//
//            if (!errorMessage.isNullOrEmpty()) {
//                Text("Error: $errorMessage", color = Color.Red)
//            }
//        }
//    }
    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF9cacff)), contentAlignment = Alignment.Center) {
        Column(
            modifier = Modifier
                .padding(24.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Color.White)
                .padding(horizontal = 24.dp, vertical = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // App Logo
            Text(
                text = "Zaap",
                fontSize = 40.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF3366FF)
            )

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "Sign in",
                fontSize = 20.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.Black
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Row of social icons
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                SocialLoginButton(iconRes = R.drawable.google) { login(LoginParams(Provider.GOOGLE)) }
                SocialLoginButton(iconRes = R.drawable.facebook) { login(LoginParams(Provider.FACEBOOK)) }
                SocialLoginButton(iconRes = R.drawable.x) { login(LoginParams(Provider.TWITTER)) }
                SocialLoginButton(iconRes = R.drawable.github) { login(LoginParams(Provider.GITHUB)) }

            }

            Spacer(modifier = Modifier.height(12.dp))
            OrDivider()
            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                shape = CircleShape,
                textStyle = TextStyle.Default.copy(color = Color.Black),
                placeholder = { Text("Continue with Email", color = Color.Gray) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color.LightGray,
                    unfocusedBorderColor = Color.LightGray,
                    disabledBorderColor = Color.LightGray,
                    focusedTextColor = Color.Black,
                    unfocusedTextColor = Color.Black,
                    cursorColor = Color.Black,
                    focusedContainerColor = Color.Transparent,
                    unfocusedContainerColor = Color.Transparent,
                    disabledContainerColor = Color.Transparent
                ),
                keyboardOptions = KeyboardOptions.Default.copy(imeAction = ImeAction.Done),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)


            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    if (email.isNotBlank()) login(
                        LoginParams(
                            Provider.EMAIL_PASSWORDLESS,
                            extraLoginOptions = ExtraLoginOptions(login_hint = email)
                        )
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                shape = RoundedCornerShape(50),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3366FF)),
                enabled = email.isNotBlank() // only enable when something is typed
            ) {
                Text(
                    "Verify Email",
                    color = if (email.isNotBlank()) Color.Black else Color.LightGray,
                    fontSize = 16.sp
                )
            }

            Spacer(modifier = Modifier.height(16.dp))


        }
    }
}


@Composable
fun SocialLoginButton(iconRes: Int, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .size(48.dp)
            .clip(CircleShape)
            .background(Color(0xFFF2F2F2))
            .clickable { onClick() }, contentAlignment = Alignment.Center
    ) {
        Icon(
            painter = painterResource(id = iconRes),
            contentDescription = null,
            modifier = Modifier.size(24.dp),
            tint = Color.Black
        )
    }
}

@Composable
fun OrDivider(
    modifier: Modifier = Modifier,
    text: String = "OR",
    color: Color = Color.Gray,
    thickness: Dp = 0.5.dp
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        HorizontalDivider(
            modifier = Modifier.weight(1f), thickness = thickness, color = color
        )
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 12.dp),
            color = color,
            fontSize = 14.sp
        )
        HorizontalDivider(
            modifier = Modifier.weight(1f), thickness = thickness, color = color
        )
    }
}


