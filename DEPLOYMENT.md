# 🚀 PULSE.FUN Deployment Guide

## **Production Deployment Checklist**

### **1. Environment Setup**

Create `.env.production` with:
```bash
# Zerion API
NEXT_PUBLIC_ZERION_API_KEY=your_production_api_key

# WalletConnect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Database
DATABASE_URL="postgresql://user:password@host:5432/pulse_fun_prod"

# App
NEXT_PUBLIC_APP_URL=https://pulse.fun
```

### **2. Database Setup**

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

### **3. Build & Deploy**

```bash
# Build for production
npm run build

# Start production server
npm start
```

### **4. Vercel Deployment**

1. **Connect Repository**
   - Import project from GitHub
   - Configure build settings

2. **Environment Variables**
   - Add all production environment variables
   - Set `DATABASE_URL` to your PostgreSQL instance

3. **Domain Setup**
   - Configure custom domain: `pulse.fun`
   - Set up SSL certificates

### **5. Database Production Setup**

**Option A: Supabase (Recommended)**
```bash
# Create Supabase project
# Get connection string
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

**Option B: Railway**
```bash
# Create Railway PostgreSQL service
# Get connection string
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/railway"
```

**Option C: Neon**
```bash
# Create Neon database
# Get connection string
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]"
```

### **6. Zerion API Setup**

1. **Get Production API Key**
   - Visit: https://zerion.io/api
   - Create account and get API key
   - Update `NEXT_PUBLIC_ZERION_API_KEY`

2. **Configure Webhooks**
   - Set webhook URL: `https://pulse.fun/api/webhooks/zerion`
   - Configure events: portfolio updates, transactions
   - Set webhook secret for verification

### **7. WalletConnect Setup**

1. **Get Project ID**
   - Visit: https://cloud.walletconnect.com
   - Create new project
   - Get Project ID
   - Update `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`

### **8. Performance Optimization**

**Next.js Configuration**
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['api.zerion.io'],
  },
}
```

**Database Optimization**
```sql
-- Add indexes for performance
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_activities_wallet ON activities(wallet_address);
CREATE INDEX idx_activities_created ON activities(created_at);
```

### **9. Monitoring & Analytics**

**Error Tracking**
- Set up Sentry for error monitoring
- Configure alerts for critical errors

**Performance Monitoring**
- Use Vercel Analytics
- Monitor Core Web Vitals
- Set up uptime monitoring

**Database Monitoring**
- Monitor query performance
- Set up connection pooling
- Configure backup schedules

### **10. Security Checklist**

- [ ] Environment variables secured
- [ ] API keys rotated
- [ ] Database access restricted
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection enabled

### **11. Launch Checklist**

- [ ] All tests passing
- [ ] Production build successful
- [ ] Database migrations complete
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificates active
- [ ] Monitoring configured
- [ ] Backup systems ready

### **12. Post-Launch**

**Immediate Tasks**
- Monitor error rates
- Check database performance
- Verify webhook functionality
- Test wallet connections

**First Week**
- Monitor user engagement
- Optimize slow queries
- Scale database if needed
- Gather user feedback

**Ongoing**
- Regular security updates
- Performance monitoring
- Feature updates
- Community building

## **🚀 Ready to Launch!**

Your PULSE.FUN app is now ready for production deployment with:
- ✅ **Live Zerion API integration**
- ✅ **Real-time webhooks**
- ✅ **PostgreSQL database**
- ✅ **Social features**
- ✅ **Mobile optimization**
- ✅ **Production-ready architecture**

**Deploy and watch your crypto social network come to life! 🌊**