#!/bin/bash

# Deployment script for Consignment Stores Near Me
# This script will help you deploy the website to GitHub Pages

echo "🚀 Deploying Consignment Stores Near Me to GitHub"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
fi

# Copy new files to replace old ones
echo "📋 Copying new files..."
cp index-new.html index.html
cp about/index-new.html about/index.html
cp alabama/index-new.html alabama/index.html
cp alabama/birmingham/index-new.html alabama/birmingham/index.html
cp sitemap/index-new.html sitemap/index.html
cp sitemap-new.xml sitemap.xml
cp favicon-new.svg favicon.svg
cp js/search-new.js js/search.js
cp README-new.md README.md

# Add all files to git
echo "📁 Adding files to Git..."
git add .

# Create commit
echo "💾 Creating commit..."
git commit -m "Deploy Consignment Stores Directory Website

✨ Features:
- Homepage with search functionality
- State and city pages with store listings
- SEO optimized for Google indexing
- Mobile responsive design
- White and light blue color scheme
- 2,500+ consignment stores directory

🎯 SEO Ready:
- Targets 'Consignment Stores Near Me' keywords
- Schema.org structured data
- XML and HTML sitemaps
- Breadcrumb navigation
- Fast loading times"

echo "✅ Ready to push to GitHub!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub (https://github.com/new)"
echo "2. Run: git remote add origin https://github.com/sad160130/[repository-name].git"
echo "3. Run: git push -u origin main"
echo "4. Enable GitHub Pages in repository settings"
echo ""
echo "🌐 Your site will be available at:"
echo "https://sad160130.github.io/[repository-name]"