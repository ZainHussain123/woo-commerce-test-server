# Docker Setup Guide

This guide explains how to run the WooCommerce Products Service using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

1. **Clone the repository and navigate to the project directory**

2. **Create environment file**
   ```bash
   cp .env.docker.example .env
   ```
   
   Or create a `.env` file with the following content:
   ```env
   # Database Configuration for Docker
   POSTGRES_HOST=postgres
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=12345
   POSTGRES_DB=woocommerce

   # WooCommerce API Configuration
   WOOCOMMERCE_BASE_URL=https://wp-multisite.convertcart.com
   WOOCOMMERCE_CONSUMER_KEY=ck_af82ae325fbee1c13f31eb26148f4dea473b0f77
   WOOCOMMERCE_CONSUMER_SECRET=cs_2d8cc467c5b91a80f5ed18dd3c282ee8299c9445

   # Application Configuration
   NODE_ENV=production
   PORT=3000
   HOST=0.0.0.0
   TZ=UTC

   # Cron Configuration
   CRON_SCHEDULE=0 */6 * * *

   # TypeORM Configuration
   TYPEORM_SYNCHRONIZE=true
   TYPEORM_LOGGING=false
   ```

3. **Build and start the services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

## Docker Services

### PostgreSQL Database
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Data**: Persisted in Docker volume `postgres_data`
- **Health Check**: Built-in PostgreSQL health check

### NestJS Application
- **Build**: Multi-stage Docker build
- **Port**: 3000
- **Health Check**: HTTP endpoint check
- **Dependencies**: Waits for PostgreSQL to be healthy

### Redis (Optional)
- **Image**: redis:7-alpine
- **Port**: 6379
- **Data**: Persisted in Docker volume `redis_data`

## Docker Commands

### Start services
```bash
docker-compose up
```

### Start services in background
```bash
docker-compose up -d
```

### Build and start
```bash
docker-compose up --build
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app
docker-compose logs postgres
```

### Execute commands in running container
```bash
# Access app container shell
docker-compose exec app sh

# Access database
docker-compose exec postgres psql -U postgres -d woocommerce
```

## Environment Variables

The following environment variables can be customized in your `.env` file:

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_HOST` | postgres | Database host (use 'postgres' for Docker) |
| `POSTGRES_PORT` | 5432 | Database port |
| `POSTGRES_USER` | postgres | Database username |
| `POSTGRES_PASSWORD` | 12345 | Database password |
| `POSTGRES_DB` | woocommerce | Database name |
| `WOOCOMMERCE_BASE_URL` | https://wp-multisite.convertcart.com | WooCommerce store URL |
| `WOOCOMMERCE_CONSUMER_KEY` | ck_af82ae325fbee1c13f31eb26148f4dea473b0f77 | WooCommerce API key |
| `WOOCOMMERCE_CONSUMER_SECRET` | cs_2d8cc467c5b91a80f5ed18dd3c282ee8299c9445 | WooCommerce API secret |
| `NODE_ENV` | production | Application environment |
| `PORT` | 3000 | Application port |
| `HOST` | 0.0.0.0 | Application host |
| `TZ` | UTC | Timezone |
| `CRON_SCHEDULE` | 0 */6 * * * | Cron schedule pattern |
| `TYPEORM_SYNCHRONIZE` | true | Auto-sync database schema |
| `TYPEORM_LOGGING` | false | Enable TypeORM logging |

## Production Deployment

For production deployment:

1. **Update environment variables**
   ```env
   NODE_ENV=production
   TYPEORM_SYNCHRONIZE=false
   POSTGRES_PASSWORD=your_secure_password
   ```

2. **Use production Docker Compose override**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Set up reverse proxy** (nginx, traefik, etc.)

4. **Configure SSL certificates**

5. **Set up monitoring and logging**

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   
   # Change port in .env file
   PORT=3001
   ```

2. **Database connection failed**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps
   
   # Check PostgreSQL logs
   docker-compose logs postgres
   ```

3. **Application won't start**
   ```bash
   # Check application logs
   docker-compose logs app
   
   # Rebuild the image
   docker-compose build --no-cache app
   ```

4. **Permission issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Health Checks

All services include health checks:
- **PostgreSQL**: `pg_isready` command
- **Application**: HTTP endpoint check
- **Redis**: `redis-cli ping` command

Check health status:
```bash
docker-compose ps
```

### Data Persistence

- **PostgreSQL data**: Stored in `postgres_data` volume
- **Redis data**: Stored in `redis_data` volume

To backup data:
```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U postgres woocommerce > backup.sql

# Backup Redis
docker-compose exec redis redis-cli BGSAVE
```

## Development

For development with hot reload:

1. **Use development override**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

2. **Mount source code as volume** (configured in dev override)

3. **Enable debug mode** in environment variables

## Security Considerations

1. **Change default passwords** in production
2. **Use secrets management** for sensitive data
3. **Enable SSL/TLS** for external access
4. **Configure firewall rules**
5. **Regular security updates** for base images
6. **Scan images** for vulnerabilities

## Monitoring

Consider adding monitoring services:
- **Prometheus** for metrics
- **Grafana** for dashboards
- **ELK Stack** for logging
- **Health check endpoints** for uptime monitoring
