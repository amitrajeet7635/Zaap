package com.zaap.app.core.utils

import org.web3j.crypto.Credentials

object Web3Utils {
    fun getPublicAddressFromPrivateKey(privateKey: String): String {
        val credentials = Credentials.create(privateKey)
        return credentials.address
    }
}