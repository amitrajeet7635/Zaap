package com.zaap.app.data.model

data class ConnectParentQRScanData (
    val delegator: String,
    val token: String,
    val maxAmount: Double,
    val weeklyLimit: Long,
    val alias: String,
    val timestamp: Long
)