# Subdomain Migration Documentation

## Overview
This document outlines the architectural changes made to migrate from a subdirectory URL structure to a subdomain-based structure for better SEO performance.

## URL Structure Changes

### Previous Structure:
- Home: `https://www.consignmentstores.site/`
- State pages: `https://www.consignmentstores.site/california/`
- City pages: `https://www.consignmentstores.site/california/victorville/`

### New Structure:
- Home: `https://www.consignmentstores.site/` (unchanged)
- State pages: `https://california.consignmentstores.site/`
- City pages: `https://california.consignmentstores.site/victorville/`

## Implementation Details

### 1. Middleware (`middleware.ts`)
The middleware handles:
- **Subdomain Detection**: Identifies when a request comes to a state subdomain
- **URL Rewriting**: Internally rewrites subdomain requests to the appropriate Next.js routes
- **301 Redirects**: Automatically redirects old subdirectory URLs to new subdomain URLs
- **Trailing Slash**: Ensures all URLs have trailing slashes for consistency

### 2. Vercel Configuration (`vercel.json`)
- Configured rewrites for subdomain routing
- Set up permanent 301 redirects for all state and city URLs
- Maintains trailing slash configuration

### 3. URL Utility Functions (`lib/url-utils.ts`)
Created utility functions for:
- `generateUrl()`: Generates correct subdomain URLs
- `generateInternalLink()`: Creates proper links based on current host
- `isSubdomain()`: Detects if running on a subdomain
- `getStateFromSubdomain()`: Extracts state from subdomain

### 4. Component Updates

#### Navigation Component
- Updated to use subdomain-aware links
- State dropdown now links to `https://[state].consignmentstores.site/`
- City dropdown links to `https://[state].consignmentstores.site/[city]/`
- Logo links back to main domain when on subdomain

#### State & City Pages
- Updated canonical URLs to use subdomain structure
- Modified internal links to use relative paths when on same subdomain
- Updated breadcrumbs to reflect new structure

### 5. Schema Markup Updates
- Modified schema generation to use subdomain URLs
- Updated breadcrumb schemas with correct URLs
- Adjusted LocalBusiness schemas for proper subdomain references

## Deployment Steps

### 1. DNS Configuration (Required)
You need to configure wildcard subdomain DNS records in your domain registrar:
- Add a wildcard CNAME record: `*.consignmentstores.site` pointing to your Vercel deployment

### 2. Vercel Project Settings
In your Vercel project settings:
1. Go to Settings > Domains
2. Add `*.consignmentstores.site` as a domain
3. Vercel will automatically handle SSL certificates for all subdomains

### 3. Deployment
1. Push these changes to your GitHub repository
2. Vercel will automatically deploy the changes
3. The middleware will handle all routing and redirects

## Benefits of This Architecture

1. **Better SEO**: Each state gets its own subdomain, treated as a semi-independent entity
2. **Automatic Redirects**: Old URLs automatically redirect to new structure with 301 status
3. **Preserved Content**: All existing content migrates seamlessly
4. **Scalable**: Easy to add new states and cities
5. **User-Friendly**: Clean, memorable URLs for each state

## Testing Checklist

- [ ] Old state URLs redirect to subdomains (e.g., `/california/` → `california.consignmentstores.site/`)
- [ ] Old city URLs redirect properly (e.g., `/california/victorville/` → `california.consignmentstores.site/victorville/`)
- [ ] Navigation dropdowns use subdomain URLs
- [ ] Internal links work correctly within subdomains
- [ ] Schema markup reflects new URLs
- [ ] Canonical URLs are correct
- [ ] 301 status codes are returned for redirects

## Important Notes

1. **DNS Propagation**: After adding DNS records, it may take up to 48 hours for changes to propagate globally
2. **SSL Certificates**: Vercel automatically provisions SSL certificates for all subdomains
3. **Search Console**: You'll need to add each subdomain as a separate property in Google Search Console
4. **Analytics**: Consider updating analytics tracking to properly attribute traffic to subdomains