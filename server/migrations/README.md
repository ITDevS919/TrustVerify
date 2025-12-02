# Database Migrations

## Indexes

Run the index creation script to optimize database queries:

```bash
npm run db:index
```

Or manually:

```bash
psql $DATABASE_URL -f migrations/add-indexes.sql
```

## Query Optimization

### Analyze Slow Queries

Access the admin endpoint to view slow queries:

```bash
GET /api/admin/query-stats
```

### Vacuum Tables

Optimize table storage and update statistics:

```bash
npm run db:optimize
```

Or via API:

```bash
POST /api/admin/vacuum
Body: { "tables": ["users", "transactions"] } // Optional, omitting vacuums all tables
```

## Index Strategy

### Primary Indexes
- Foreign keys (for JOIN operations)
- Status fields (for filtering)
- Timestamps (for sorting and date range queries)
- Unique fields (email, username, etc.)

### Composite Indexes
- Common query patterns (user + status, transaction + date)
- Multi-column filters

### Partial Indexes
- Filtered indexes for active records
- Conditional indexes for specific states

## Performance Monitoring

Monitor query performance using:

1. **Slow Query Log**: Check `/api/admin/query-stats`
2. **Index Usage**: Verify indexes are being used
3. **Table Stats**: Monitor table sizes and vacuum status

## Best Practices

1. **Regular Vacuuming**: Run weekly or after large data changes
2. **Monitor Index Usage**: Remove unused indexes
3. **Analyze Query Plans**: Use EXPLAIN ANALYZE for slow queries
4. **Update Statistics**: Run ANALYZE after bulk operations

