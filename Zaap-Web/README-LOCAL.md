# Zaap Local Development Setup

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd zaap-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and configure it:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your actual Appwrite credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will run on http://localhost:4000

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd zapp-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on http://localhost:5173

## Testing the Application

1. Make sure both backend and frontend are running
2. Open your browser to http://localhost:5173
3. Connect your MetaMask wallet on Ethereum Sepolia network
4. Test the QR generation and child account management features

## Environment Variables Required

- `APPWRITE_API_KEY`: Your Appwrite API key
- `APPWRITE_DB_ID`: Your Appwrite database ID  
- `APPWRITE_CHILDREN_COLLECTION_ID`: Your Appwrite collection ID for children
- `USDC_ADDRESS`: USDC token address (default: Sepolia USDC)
- `SEPOLIA_RPC_URL`: Ethereum Sepolia RPC URL
