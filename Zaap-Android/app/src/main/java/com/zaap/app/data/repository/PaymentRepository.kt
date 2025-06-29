package com.zaap.app.data.repository

import com.zaap.app.data.model.PaymentDetails

interface PaymentRepository {
    suspend fun fetchPaymentDetails(scannedQrCodeId: String): PaymentDetails?
}