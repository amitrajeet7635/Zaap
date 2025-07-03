package com.zaap.app.data.repository

import android.util.Log
import com.zaap.app.core.network.ZaapBackendAPI
import com.zaap.app.data.model.ChildDto
import com.zaap.app.data.model.ConnectChildRequest
import com.zaap.app.data.model.DelegatorDto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject


class ZaapRepositoryImpl @Inject constructor(private val api: ZaapBackendAPI) {

    suspend fun connectChild(
        childAddress: String,
        walletAddress: String,
        delegator: String,
        token: String,
        maxAmount: Long,
        weeklyLimit: Long,
        alias: String,
        timestamp: Long
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val request = ConnectChildRequest(
                childAddress,
                walletAddress,
                delegator,
                token,
                maxAmount,
                weeklyLimit,
                alias,
                timestamp
            )
            val response = api.connectChild(request)
            response.isSuccessful
        } catch (e: Exception) {
            Log.d("Backend Error", "${e.message}")
            false
        }
    }

    suspend fun getChildren(): List<ChildDto> = withContext(Dispatchers.IO) {
        try {
            val response = api.getChildren()
            if (response.isSuccessful) {
                response.body() ?: emptyList()
            } else {
                emptyList()
            }
        } catch (e: Exception) {
            Log.d("Backend Error", "${e.message}")
            emptyList()
        }
    }

    suspend fun getDelegator(): DelegatorDto? = withContext(Dispatchers.IO) {
        try {
            val response = api.getDelegator()
            if (response.isSuccessful) {
                response.body()
            } else null
        } catch (e: Exception) {
            Log.d("Backend Error", "${e.message}")
            null
        }
    }

}