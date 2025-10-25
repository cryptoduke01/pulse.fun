# 🔑 ZERION API SETUP GUIDE

## **❌ CURRENT ISSUE**
Your Zerion dev dashboard shows only 1 request from days ago because the API key is not configured!

## **✅ SOLUTION**

### **1. Get Your Zerion API Key**
1. Go to [Zerion Developer Dashboard](https://dashboard.zerion.io/)
2. Sign up/Login with your account
3. Create a new project
4. Copy your API key

### **2. Set Environment Variable**
Create a `.env.local` file in your project root:

```bash
# Zerion API Configuration
NEXT_PUBLIC_ZERION_API_KEY=your_zerion_api_key_here

# WalletConnect Configuration  
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=37964f97ec5121be8a5d4128583dc238
```

### **3. Restart Development Server**
```bash
npm run dev
```

## **🔍 VERIFICATION**

After setting up the API key:

1. **Check Console**: No more "ZERION_API_KEY is not configured" warnings
2. **Zerion Dashboard**: Should show new API requests
3. **App**: Should fetch real wallet data instead of mock data
4. **Discover Page**: Should show real trending wallets

## **📊 EXPECTED RESULTS**

### **Before (Current State):**
- ❌ Only mock data displayed
- ❌ No Zerion API calls
- ❌ Dashboard shows 1 old request
- ❌ "ZERION_API_KEY is not configured" warnings

### **After (With API Key):**
- ✅ Real wallet data from Zerion API
- ✅ Multiple API requests in dashboard
- ✅ Actual portfolio values
- ✅ Live 24h changes
- ✅ Real transaction data

## **🚨 IMPORTANT NOTES**

1. **API Key Required**: The app will now throw errors if the API key is missing
2. **Rate Limits**: Zerion has rate limits, so don't spam requests
3. **Real Data**: You'll now see actual wallet values and transactions
4. **No Mock Data**: All fallbacks removed - real API calls only

## **🔧 TROUBLESHOOTING**

### **If you still see mock data:**
1. Check `.env.local` file exists
2. Restart development server
3. Check console for API key warnings
4. Verify API key is valid in Zerion dashboard

### **If API calls fail:**
1. Check API key is correct
2. Verify Zerion account is active
3. Check rate limits in dashboard
4. Ensure wallet addresses are valid

**Once you set the API key, your app will make real Zerion API calls and show actual wallet data! 🎯**
