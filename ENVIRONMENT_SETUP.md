# Environment Variables Setup

This document explains how to configure all environment variables for the WooCommerce Products Service.

## Required Environment Variables

Create a `.env` file in the root directory of your project with the following variables:

### Database Configuration
```env
# PostgreSQL Database Settings
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=12345
POSTGRES_DB=woocommerce
```

### WooCommerce API Configuration
```env
# WooCommerce API Settings
WOOCOMMERCE_BASE_URL=https://wp-multisite.convertcart.com
WOOCOMMERCE_CONSUMER_KEY=ck_af82ae325fbee1c13f31eb26148f4dea473b0f77
WOOCOMMERCE_CONSUMER_SECRET=cs_2d8cc467c5b91a80f5ed18dd3c282ee8299c9445
```

### Application Configuration
```env
# Application Settings
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
TZ=UTC
```

### Cron Configuration
```env
# Cron Job Settings
CRON_SCHEDULE=0 */6 * * *  # Custom schedule (every 6 hours)
```

### TypeORM Configuration
```env
# TypeORM Settings
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=false
```

## Complete .env File Example

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=12345
POSTGRES_DB=woocommerce

# WooCommerce API Configuration
WOOCOMMERCE_BASE_URL=https://wp-multisite.convertcart.com
WOOCOMMERCE_CONSUMER_KEY=ck_af82ae325fbee1c13f31eb26148f4dea473b0f77
WOOCOMMERCE_CONSUMER_SECRET=cs_2d8cc467c5b91a80f5ed18dd3c282ee8299c9445

# Application Configuration
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
TZ=UTC

# Cron Configuration
CRON_SCHEDULE=0 */6 * * *  # Custom schedule (every 6 hours)

# TypeORM Configuration
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=false
```

## Environment Variable Descriptions

### Database Variables
- **POSTGRES_HOST**: PostgreSQL server hostname (default: localhost)
- **POSTGRES_PORT**: PostgreSQL server port (default: 5432)
- **POSTGRES_USER**: PostgreSQL username (default: postgres)
- **POSTGRES_PASSWORD**: PostgreSQL password (default: 12345)
- **POSTGRES_DB**: PostgreSQL database name (default: woocommerce)

### WooCommerce API Variables
- **WOOCOMMERCE_BASE_URL**: Base URL of your WooCommerce store
- **WOOCOMMERCE_CONSUMER_KEY**: WooCommerce API consumer key
- **WOOCOMMERCE_CONSUMER_SECRET**: WooCommerce API consumer secret

### Application Variables
- **NODE_ENV**: Application environment (development/production)
- **PORT**: Port number for the application (default: 3000)
- **HOST**: Host address for the application (default: 0.0.0.0)
- **TZ**: Timezone for cron jobs (default: UTC)

### Cron Variables
- **CRON_SCHEDULE**: Custom cron schedule pattern (default: every 6 hours)

### TypeORM Variables
- **TYPEORM_SYNCHRONIZE**: Auto-sync database schema (default: true)
- **TYPEORM_LOGGING**: Enable TypeORM logging (default: false)

## Setup Instructions

1. **Create .env file**: Copy the complete example above into a `.env` file in your project root
2. **Update values**: Modify the values according to your environment
3. **Database setup**: Ensure PostgreSQL is running and the database exists
4. **WooCommerce API**: Update the API credentials with your actual WooCommerce store details
5. **Restart application**: Restart your NestJS application to load the new environment variables

## Security Notes

- **Never commit .env files** to version control
- **Use strong passwords** for database connections
- **Rotate API keys** regularly
- **Use different credentials** for development and production environments

## Production Considerations

For production environments:
- Set `NODE_ENV=production`
- Set `TYPEORM_SYNCHRONIZE=false` (use migrations instead)
- Use strong, unique passwords
- Configure proper timezone (`TZ`)
- Set up proper logging levels
- Use environment-specific WooCommerce API credentials

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check if PostgreSQL is running
   - Verify database credentials
   - Ensure database exists

2. **WooCommerce API errors**
   - Verify API credentials
   - Check if the store URL is accessible
   - Ensure API keys have proper permissions

3. **Environment variables not loading**
   - Ensure `.env` file is in the project root
   - Check file permissions
   - Restart the application

### Testing Environment Variables

You can test if environment variables are loaded correctly by checking the application logs or using the configuration endpoints.
