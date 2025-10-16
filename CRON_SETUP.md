# Cron-Based Periodic Ingestion Setup

This document explains the cron-based periodic ingestion system for the WooCommerce Products Service.

## Overview

The application now includes automated scheduled jobs that periodically fetch and sync products from WooCommerce to the local database.

## Scheduled Jobs

### 1. 5-Minute Ingestion
- **Schedule**: `*/5 * * * *` (every 5 minutes)
- **Purpose**: High-frequency synchronization for real-time updates
- **Logs**: Detailed logging of import/update statistics

### 2. Hourly Ingestion
- **Schedule**: `0 * * * *` (every hour at minute 0)
- **Purpose**: Regular synchronization to keep data fresh
- **Logs**: Detailed logging of import/update statistics

### 3. Daily Ingestion
- **Schedule**: `0 0 * * *` (daily at midnight)
- **Purpose**: Full daily synchronization
- **Logs**: Detailed logging of import/update statistics

### 4. Custom Ingestion
- **Schedule**: Configurable via `CRON_SCHEDULE` environment variable
- **Default**: `0 */6 * * *` (every 6 hours)
- **Purpose**: Flexible scheduling based on your needs

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Cron Configuration
CRON_SCHEDULE=0 */6 * * *  # Custom schedule (every 6 hours)
TZ=UTC                     # Timezone for cron jobs
```

### Cron Schedule Examples

```bash
# Every 5 minutes
CRON_SCHEDULE=*/5 * * * *

# Every 15 minutes
CRON_SCHEDULE=*/15 * * * *

# Every hour
CRON_SCHEDULE=0 * * * *

# Every 6 hours
CRON_SCHEDULE=0 */6 * * *

# Daily at 2 AM
CRON_SCHEDULE=0 2 * * *

# Every weekday at 9 AM
CRON_SCHEDULE=0 9 * * 1-5

# Every Sunday at midnight
CRON_SCHEDULE=0 0 * * 0
```

## API Endpoints

### Manual Trigger
```http
POST /products/ingest/manual
```
Manually triggers the ingestion process for testing or immediate sync.

### Check Status
```http
GET /products/ingest/status
```
Returns information about all scheduled jobs and their configuration.

### Regular Ingestion
```http
POST /products/ingest
```
The original manual ingestion endpoint (still available).

## Monitoring

### Logs
All scheduled jobs log their execution with detailed statistics:

```
[Nest] 12345 - 10/15/2025, 3:30:00 PM LOG [ScheduledIngestionService] Starting scheduled hourly product ingestion...
[Nest] 12345 - 10/15/2025, 3:30:05 PM LOG [ScheduledIngestionService] Scheduled ingestion completed successfully:
  - Imported: 5 products
  - Updated: 12 products
  - Total processed: 17 products
```

### Error Handling
- Failed ingestions are logged with error details
- Jobs continue running even if individual executions fail
- No data corruption on failed runs

## Best Practices

### 1. Schedule Selection
- **Real-time updates**: Use 5-minute intervals (be mindful of API rate limits)
- **High-frequency updates**: Use hourly or every 6 hours
- **Low-frequency updates**: Use daily or weekly
- **Peak hours**: Avoid scheduling during high-traffic periods

### 2. Monitoring
- Check logs regularly for failed executions
- Monitor database size growth
- Set up alerts for consecutive failures

### 3. Performance
- Consider WooCommerce API rate limits
- Monitor server resources during ingestion
- Adjust schedules based on data volume

## Troubleshooting

### Common Issues

1. **Jobs not running**
   - Check if `ScheduleModule.forRoot()` is imported in `app.module.ts`
   - Verify `ScheduledIngestionService` is in providers

2. **Timezone issues**
   - Set `TZ` environment variable
   - Ensure server timezone matches your needs

3. **API failures**
   - Check WooCommerce API credentials
   - Verify network connectivity
   - Review API rate limits

### Testing

1. **Manual trigger**: Use `POST /products/ingest/manual`
2. **Check status**: Use `GET /products/ingest/status`
3. **View logs**: Monitor console output for execution details

## Security Considerations

- Ensure WooCommerce API credentials are secure
- Consider IP whitelisting for API access
- Monitor for unusual ingestion patterns
- Regular credential rotation

## Production Deployment

1. Set appropriate `CRON_SCHEDULE` for your needs
2. Configure proper timezone (`TZ`)
3. Set up log monitoring
4. Configure alerts for failures
5. Test manual triggers before going live
