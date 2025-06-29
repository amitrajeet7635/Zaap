package com.zaap.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.zaap.app.data.model.PaymentDetails
import dagger.hilt.android.lifecycle.HiltViewModel
import jakarta.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.filterNotNull
import kotlinx.coroutines.launch

@HiltViewModel
class ScanPayCheckoutViewModel @Inject constructor() : ViewModel() {

//    val scannedData: StateFlow<String?> = scanDataViewModel.scannedData

    private val _paymentDetails = MutableStateFlow<PaymentDetails?>(null)
    val paymentDetails: StateFlow<PaymentDetails?> = _paymentDetails.asStateFlow()

    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _hasError = MutableStateFlow(false)
    val hasError: StateFlow<Boolean> = _hasError.asStateFlow()

//    init {
//        viewModelScope.launch {
//            scannedData
//                .filterNotNull() // Only proceed if scannedData is not null
//                .collect { data ->
//                }
//        }
//    }

}