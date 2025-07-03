package com.zaap.app.data.model


data class ConnectChildRequest(
    val childAddress: String,
    val walletAddress: String,
    val delegator: String,
    val token: String,
    val maxAmount: Long,
    val weeklyLimit: Long,
    val alias: String,
    val timestamp: Long
)

data class ChildDto(
    val address: String,
    val balance: Long,
    val weeklyLimit: Long
)

data class DelegatorDto(val delegatorAddress: String?)
