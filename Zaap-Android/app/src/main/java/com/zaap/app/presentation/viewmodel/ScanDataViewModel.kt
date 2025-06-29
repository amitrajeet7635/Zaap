package com.zaap.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import jakarta.inject.Inject
import jakarta.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

@HiltViewModel
class ScanDataViewModel @Inject constructor(): ViewModel() {
    private val _scannedData = MutableStateFlow<String?>(null)
    val scannedData: StateFlow<String?> = _scannedData.asStateFlow()

    fun setScannedData(data: String) {
        _scannedData.value = data
    }

}