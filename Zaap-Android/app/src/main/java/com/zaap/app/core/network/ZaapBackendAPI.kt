package com.zaap.app.core.network

import com.zaap.app.data.model.ChildDto
import com.zaap.app.data.model.ConnectChildRequest
import com.zaap.app.data.model.DelegatorDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ZaapBackendAPI {

    @POST("/api/connect-child")
    suspend fun connectChild(@Body body: ConnectChildRequest): Response<Unit>

    @GET("/api/children")
    suspend fun getChildren(): Response<List<ChildDto>>

    @GET("/api/delegator")
    suspend fun getDelegator(): Response<DelegatorDto>
}