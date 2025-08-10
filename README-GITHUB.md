# Consignment Stores Near Me - Directory Website

A comprehensive directory of consignment stores across the United States, featuring 2,600+ stores in 1,700+ cities.

## 🌐 Live Website
Visit: [Your GitHub Pages URL will be here]

## 📋 Features

- **2,600+ Consignment Stores** across all 50 states + DC
- **SEO-Optimized** static HTML pages for maximum search visibility
- **Mobile-Responsive** design with clean, modern interface
- **Search Functionality** - Search by store name, city, state, or ZIP code
- **Store Details** - Reviews, contact info, specialties, and more
- **Nearby Cities** module for easy navigation
- **Complete Sitemaps** (HTML and XML) for search engines

## 🚀 Deployment Instructions

### Deploy to GitHub Pages:

1. **Create a new GitHub repository**
   ```bash
   # Initialize git in your project folder
   git init
   git add .
   git commit -m "Initial commit - Consignment Stores Directory"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository Settings
   - Navigate to "Pages" in the sidebar
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

4. **Access your website**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
   - It may take a few minutes for the site to become available

### Custom Domain (Optional):

1. Create a `CNAME` file in the root directory with your domain:
   ```
   consignmentstoresnearme.com
   ```

2. Configure your domain's DNS:
   - Add a CNAME record pointing to `YOUR_USERNAME.github.io`
   - Or add A records pointing to GitHub's IP addresses

## 📁 Project Structure

```
/
├── index.html                 # Homepage
├── about/
│   └── index.html            # About Us page
├── sitemap/
│   └── index.html            # HTML sitemap
├── sitemap.xml               # XML sitemap for search engines
├── css/
│   └── main.css              # Main stylesheet
├── js/
│   └── search.js             # Search functionality
├── images/
│   ├── logo-new.svg          # Site logo
│   └── favicon-new.svg       # Favicon
├── [state-name]/             # State directories (51 total)
│   ├── index.html            # State page
│   └── [city-name]/          # City directories
│       └── index.html        # City page with store listings
```

## 🎨 Technology Stack

- **HTML5** - Semantic, SEO-optimized markup
- **CSS3** - Modern, responsive styling
- **JavaScript** - Client-side search functionality
- **Static Site** - No server required, perfect for GitHub Pages

## 🔍 SEO Features

- Clean URL structure: `/state/city/`
- Optimized meta tags and descriptions
- Schema.org structured data
- XML sitemap with 1,775 indexed pages
- Breadcrumb navigation
- Internal linking strategy

## 📊 Statistics

- **Total Pages**: 1,774
- **States Covered**: 51 (including DC)
- **Cities**: 1,721+
- **Stores Listed**: 2,600+

## 🎯 Target Keywords

- Primary: "Consignment Stores Near Me"
- State Pages: "Consignment Stores in [State]"
- City Pages: "Best Consignment Stores in [City]"

## 📝 License

This project is ready for deployment. All content is based on publicly available business information.

## 🤝 Contributing

To update store information or add new stores, modify the source data and regenerate the pages.

---

**Note**: After deployment, submit your sitemap.xml to Google Search Console for faster indexing.