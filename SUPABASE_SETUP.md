# Supabase Setup Guide

## Overview
This project uses Supabase as the database backend. Follow these steps to set up your Supabase project and connect it to the application.

## 1. Create a Supabase Project

1. Sign up or log in at [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys (found in Project Settings > API)

## 2. Set Up Database Schema

### Option 1: Using the SQL Editor
1. In your Supabase dashboard, go to the SQL Editor
2. Create a new query
3. Copy and paste the contents of `supabase-schema.sql` into the editor
4. Run the query to create the necessary tables and functions

### Option 2: Using the Supabase CLI
1. Install the Supabase CLI
2. Run `supabase link --project-ref your-project-ref`
3. Run `supabase db push`

## 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Update the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep this secret!)
   - `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY`: Your Cashfree credentials
   - `NEXT_PUBLIC_BASE_URL`: Your application's base URL

## 4. Run the Application

```bash
npm run dev
```

## Database Schema

### Bookings Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_name | TEXT | Patient's name |
| email | TEXT | Patient's email |
| mobile_number | TEXT | Patient's mobile number |
| booking_date_time | TIMESTAMP | Appointment date and time |
| reason | TEXT | Reason for booking |
| status | TEXT | Payment status (pending/paid/failed/cancelled/completed) |
| payment_id | TEXT | Payment ID from Cashfree |
| payment_method | TEXT | Payment method used |
| payment_time | TEXT | Time of payment |
| bank_reference | TEXT | Bank reference number |
| payment_message | TEXT | Payment message or error |
| order_id | TEXT | Unique order ID |
| amount | DECIMAL | Booking amount |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Record last update time |

## Security

The schema includes Row Level Security (RLS) policies to ensure:

1. Authenticated users can only view their own bookings
2. Admin users (using the service role) can view and manage all bookings

For additional security, consider implementing more granular policies based on your application's needs.