package com.zaap.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.zaap.app.data.model.DelegatorDto
import com.zaap.app.data.repository.ZaapRepositoryImpl
import dagger.hilt.android.lifecycle.HiltViewModel
import jakarta.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

@HiltViewModel
class ConnectToParentViewModel @Inject constructor(
    private val repository: ZaapRepositoryImpl
) : ViewModel() {
    private val _delegator = MutableStateFlow<String?>(null)
    val delegator: StateFlow<String?> = _delegator

    private val _connectStatus = MutableStateFlow<Boolean?>(null)
    val connectStatus: StateFlow<Boolean?> = _connectStatus

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    fun loadDelegatorAddress() {
        viewModelScope.launch {
            try {
                val response: DelegatorDto? = repository.getDelegator()
                _delegator.value = response?.delegatorAddress
            } catch (e: Exception) {
                _error.value = "Failed to load delegator: ${e.message}"
            }
        }
    }

    fun connectChild(
        childAddress: String,
        delegator: String,
        token: String,
        maxAmount: Long,
        weeklyLimit: Long,
        alias: String,
        timestamp: Long
    ) {
        viewModelScope.launch {
            try {
                val success = repository.connectChild(
                    childAddress,
                    delegator,
                    token,
                    maxAmount,
                    weeklyLimit,
                    alias,
                    timestamp
                )
                _connectStatus.value = success
                if (!success) {
                    _error.value = "Failed to connect child"
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.message}"
                _connectStatus.value = false
            }
        }
    }

}