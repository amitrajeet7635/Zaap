package com.zaap.app.core.network

import com.google.gson.internal.GsonBuildConfig
import com.zaap.app.core.network.ZaapBackendAPI
import com.zaap.app.data.repository.ZaapRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://zaap-backend.vercel.app/") // ✅ Your API Base URL here
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    fun provideZaapApi(retrofit: Retrofit): ZaapBackendAPI {
        return retrofit.create(ZaapBackendAPI::class.java)
    }

    @Provides
    @Singleton
    fun provideZaapRepository(api: ZaapBackendAPI): ZaapRepositoryImpl {
        return ZaapRepositoryImpl(api)
    }
}
