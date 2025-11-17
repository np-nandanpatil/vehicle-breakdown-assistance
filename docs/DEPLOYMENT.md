# Deployment Guide - Vehicle Breakdown Assistance

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] SSL/TLS certificate obtained

## Production Environment Setup

### 1. Production Environment Variables

Update `.env` for production:

```env
NODE_ENV=production
PORT=5000

# Database - Use managed service
MONGODB_URI=mongodb+srv://prod_user:secure_password@prod-cluster.mongodb.net/vehicle-breakdown

# JWT with strong secret
JWT_SECRET=generate-strong-random-key-here

# Frontend
FRONTEND_URL=https://yourdomain.com
API_BASE_URL=https://api.yourdomain.com

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Payment
STRIPE_API_KEY=sk_live_xxxxx
RAZORPAY_KEY_ID=rzp_live_xxxxx

# Security
ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
```

---

## Deployment Options

### Option 1: Heroku

#### Prerequisites
- Heroku CLI installed
- Heroku account

#### Steps

1. **Create Heroku apps**
```bash
heroku create vba-backend
heroku create vba-frontend
heroku create vba-admin
```

2. **Add MongoDB Atlas**
```bash
heroku addons:create mongolab:sandbox -a vba-backend
```

3. **Set environment variables**
```bash
heroku config:set NODE_ENV=production JWT_SECRET=xxxx -a vba-backend
```

4. **Deploy backend**
```bash
git subtree push --prefix backend heroku main
```

5. **Deploy frontend**
```bash
git subtree push --prefix frontend heroku main
```

#### Frontend Buildpack (if static)
```bash
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git -a vba-frontend
```

---

### Option 2: AWS (Recommended)

#### Architecture
- **EC2** for backend/admin
- **S3** for static frontend
- **RDS** for MongoDB (DocumentDB)
- **CloudFront** for CDN
- **ALB** for load balancing

#### Steps

1. **Setup EC2 Instances**
```bash
# Launch EC2 instance (Ubuntu 22.04 LTS)
# Security group: Open ports 80, 443, 5000

# Connect via SSH
ssh -i key.pem ec2-user@instance-ip

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB client
sudo apt-get install -y mongodb-clients
```

2. **Deploy Backend**
```bash
# Clone repository
git clone https://github.com/yourorg/vehicle-breakdown.git
cd vehicle-breakdown/backend

# Install dependencies
npm install

# Create .env
nano .env

# Start with PM2 (process manager)
npm install -g pm2
pm2 start server.js --name "vba-backend"
pm2 save
```

3. **Setup Database (DocumentDB)**
- Create AWS DocumentDB cluster
- Configure security groups
- Create database and user
- Update connection string in `.env`

4. **Setup Frontend on S3**
```bash
# Create S3 bucket
aws s3 mb s3://vba-frontend-bucket

# Enable static website hosting
aws s3 website s3://vba-frontend-bucket --index-document index.html

# Upload files
aws s3 sync frontend/public s3://vba-frontend-bucket
```

5. **Setup CloudFront CDN**
- Create distribution pointing to S3
- Attach SSL certificate from ACM
- Set CNAME to domain

6. **Setup ALB (Load Balancer)**
- Create Application Load Balancer
- Create target groups for backend
- Add health checks
- Register EC2 instances

7. **Setup SSL/TLS (ACM)**
- Request certificate for domain
- Validate domain ownership
- Attach to ALB/CloudFront

#### Cost Optimization
- Use Reserved Instances for predictable workloads
- Use Auto Scaling Groups for traffic spikes
- Enable CloudFront caching
- Use RDS Multi-AZ for high availability

---

### Option 3: DigitalOcean

#### Prerequisites
- DigitalOcean account

#### Steps

1. **Create Droplet**
```bash
# Create Ubuntu 22.04 LTS droplet (2GB RAM minimum)
# Add SSH key for access
```

2. **Initial Setup**
```bash
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Let's Encrypt
apt install -y certbot python3-certbot-nginx
```

3. **Deploy Application**
```bash
# Clone repo
git clone https://github.com/yourorg/vehicle-breakdown.git
cd vehicle-breakdown

# Install dependencies
npm install -w backend

# Create .env
nano backend/.env

# Start backend
cd backend
pm2 start server.js --name "vba-backend"
pm2 save
pm2 startup
```

4. **Configure Nginx**
```nginx
# /etc/nginx/sites-available/vba
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable HTTPS**
```bash
ln -s /etc/nginx/sites-available/vba /etc/nginx/sites-enabled/
certbot --nginx -d api.yourdomain.com
systemctl restart nginx
```

6. **Setup Database**
```bash
# Create managed database on DigitalOcean
# Get connection string and update .env
```

7. **Firewall Configuration**
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

### Option 4: Docker on Any VPS

#### Steps

1. **Install Docker**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

2. **Deploy with Docker Compose**
```bash
# Clone repository
git clone https://github.com/yourorg/vehicle-breakdown.git
cd vehicle-breakdown

# Create production .env
nano .env

# Start services
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

3. **Setup SSL with Nginx**
```bash
# Install Nginx
sudo apt install -y nginx

# Configure reverse proxy
# (See Nginx config above)

# Setup SSL
certbot --nginx -d yourdomain.com
```

---

## Database Backup Strategy

### MongoDB Atlas Backup
```bash
# Automated backups enabled in Atlas console
# Configure backup retention: 30 days

# Manual backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/vehicle-breakdown" --out=./backup
```

### Restore from Backup
```bash
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/vehicle-breakdown" ./backup
```

---

## Monitoring & Logging

### PM2 Monitoring
```bash
# View logs
pm2 logs

# Monitor memory/CPU
pm2 monit

# Setup PM2+ for cloud monitoring
pm2 plus
```

### Application Monitoring
```bash
# Install Sentry for error tracking
npm install @sentry/node

# Configure in backend/server.js
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### Log Aggregation (ELK Stack)
```docker
# Elasticsearch, Logstash, Kibana
# For centralized logging
```

---

## Performance Optimization

### 1. Enable Caching
```javascript
// Backend: Add Redis caching
const redis = require('redis');
const client = redis.createClient();

app.get('/services', async (req, res) => {
  const cached = await client.get('services');
  if (cached) return res.json(JSON.parse(cached));
  
  const services = await Service.find();
  await client.setex('services', 3600, JSON.stringify(services));
  res.json(services);
});
```

### 2. Enable GZIP Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Database Indexing
```javascript
// Add indexes in MongoDB
db.bookings.createIndex({ "userId": 1 });
db.bookings.createIndex({ "status": 1 });
db.services.createIndex({ "vehicleType": 1 });
```

### 4. CDN for Static Files
- Upload frontend to S3/CloudFront
- Use CDN URLs in HTML

---

## CI/CD Pipeline

### GitHub Actions Auto-Deploy

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to AWS
        run: |
          # Deploy script
          aws elasticbeanstalk create-application-version
```

---

## Security Best Practices

1. **Update Dependencies**
```bash
npm audit
npm update
```

2. **Enable HTTPS/TLS**
- Install SSL certificate
- Force HTTPS redirect

3. **Set Security Headers**
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
```

4. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

5. **Environment Secrets**
- Never commit `.env` file
- Use secrets manager (AWS Secrets Manager, HashiCorp Vault)

---

## Post-Deployment

### Verification Checklist
- [ ] Application running without errors
- [ ] Database connectivity verified
- [ ] All API endpoints responding
- [ ] SSL/TLS working
- [ ] Backups automated
- [ ] Monitoring active
- [ ] Logs being collected

### Performance Testing
```bash
# Load testing with Apache Bench
ab -n 1000 -c 100 https://api.yourdomain.com/api/health

# or with Artillery
npm install -g artillery
artillery quick --count 100 --num 1000 https://api.yourdomain.com/api/health
```

---

## Rollback Plan

In case of deployment issues:

```bash
# Revert to previous version
git revert HEAD
git push

# Or use PM2
pm2 restart vba-backend
pm2 revert

# Or restore database
mongorestore --uri="mongodb+srv://..." ./backup/previous
```

---

## Scaling Strategy

### Horizontal Scaling
- Use Load Balancer (ALB/Nginx)
- Deploy multiple backend instances
- Use message queue (RabbitMQ) for async tasks

### Vertical Scaling
- Increase server resources (CPU/RAM)
- Upgrade database tier

### Database Scaling
- Database replication
- Sharding for large datasets
- Read replicas for analytics

---

## Support

For deployment help:
- Documentation: https://docs.vba.com/deployment
- Support: deploy-support@vba.com
- Status: https://status.vba.com