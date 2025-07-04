# Child Account USDC Transfer Endpoints

This document describes the new backend endpoints that enable child accounts to transfer USDC tokens to other wallet addresses.

## New Endpoints

### 1. GET /api/child-balance/:address
Get the current USDC balance for a child account.

**Parameters:**
- `address` (path): Child wallet address

**Response:**
```json
{
  "success": true,
  "child": {
    "address": "0x...",
    "alias": "Child Name",
    "balance": 25.5,
    "circleWalletBalance": 25.5,
    "blockchainBalance": 25.5,
    "lastBalanceCheck": 1234567890
  },
  "balances": {
    "current": 25.5,
    "circle": 25.5,
    "blockchain": 25.5
  }
}
```

### 2. POST /api/child-transfer
Transfer USDC from a child account to another wallet address.

**Request Body:**
```json
{
  "childAddress": "0x...",
  "toAddress": "0x...",
  "amount": 10.0,
  "memo": "Optional transfer memo"
}
```

**Response:**
```json
{
  "success": true,
  "transferTransaction": {
    "id": "transaction-id",
    "amounts": ["10.0"],
    "destinationAddress": "0x...",
    "status": "pending"
  },
  "child": {
    "address": "0x...",
    "balance": 15.5,
    "spent": 10.0,
    "lastTransferTxId": "transaction-id",
    "lastTransferAmount": 10.0,
    "lastTransferTo": "0x...",
    "lastTransferAt": 1234567890
  },
  "message": "Successfully transferred 10.0 USDC to 0x..."
}
```

### 3. GET /api/child-transfer-history/:address
Get the transfer history for a child account.

**Parameters:**
- `address` (path): Child wallet address

**Response:**
```json
{
  "success": true,
  "childAddress": "0x...",
  "alias": "Child Name",
  "transferHistory": [
    {
      "id": "tx-id",
      "amount": 10.0,
      "to": "0x...",
      "memo": "Transfer memo",
      "timestamp": 1234567890,
      "status": "completed"
    }
  ],
  "totalTransfers": 1,
  "totalSpent": 10.0,
  "weeklyLimit": 20.0,
  "remainingWeeklyLimit": 10.0
}
```

## Transfer Validation

The system includes several validation checks:

1. **Balance Check**: Ensures child has sufficient USDC balance
2. **Weekly Limit**: Prevents exceeding weekly spending limits
3. **Account Status**: Only active/connected accounts can transfer
4. **Address Validation**: Validates both child and recipient addresses
5. **Amount Validation**: Ensures positive transfer amounts

## Usage Examples

### Frontend API Usage

```typescript
import { getChildBalance, childTransferUSDC, getChildTransferHistory } from './utils/api';

// Get child balance
const balance = await getChildBalance('0x...');

// Transfer USDC
const transfer = await childTransferUSDC(
  '0x...', // child address
  '0x...', // recipient address
  10.0,    // amount
  'Gift'   // memo
);

// Get transfer history
const history = await getChildTransferHistory('0x...');
```

### Direct API Usage

```javascript
// Get child balance
const response = await fetch('/api/child-balance/0x...');
const balance = await response.json();

// Transfer USDC
const transferResponse = await fetch('/api/child-transfer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    childAddress: '0x...',
    toAddress: '0x...',
    amount: 10.0,
    memo: 'Transfer memo'
  })
});
```

## Error Handling

Common error responses:

- `400 Bad Request`: Invalid addresses, insufficient balance, or spending limit exceeded
- `404 Not Found`: Child account not found
- `500 Internal Server Error`: Circle SDK issues or network problems

## Dependencies

- Circle SDK for wallet operations
- Local storage for child account management
- Ethereum address validation utilities

## Testing

Use the provided test script to verify endpoint functionality:

```bash
node test-child-endpoints.js
```

Note: Actual transfers require proper Circle API credentials and funded wallets.
