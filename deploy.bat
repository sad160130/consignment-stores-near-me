@echo off
echo 🚀 Deploying Consignment Stores Near Me to GitHub

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git branch -M main
)

REM Copy new files to replace old ones
echo 📋 Copying new files...
copy /Y "index-new.html" "index.html" >nul
copy /Y "about\index-new.html" "about\index.html" >nul
copy /Y "alabama\index-new.html" "alabama\index.html" >nul
copy /Y "alabama\birmingham\index-new.html" "alabama\birmingham\index.html" >nul
copy /Y "sitemap\index-new.html" "sitemap\index.html" >nul
copy /Y "sitemap-new.xml" "sitemap.xml" >nul
copy /Y "favicon-new.svg" "favicon.svg" >nul
copy /Y "js\search-new.js" "js\search.js" >nul
copy /Y "README-new.md" "README.md" >nul

REM Add all files to git
echo 📁 Adding files to Git...
git add .

REM Create commit
echo 💾 Creating commit...
git commit -m "Deploy Consignment Stores Directory Website - Features: Homepage with search, State/city pages, SEO optimized, Mobile responsive, 2500+ stores directory"

echo.
echo ✅ Ready to push to GitHub!
echo.
echo Next steps:
echo 1. Create a new repository on GitHub (https://github.com/new)
echo 2. Run: git remote add origin https://github.com/sad160130/[repository-name].git
echo 3. Run: git push -u origin main  
echo 4. Enable GitHub Pages in repository settings
echo.
echo 🌐 Your site will be available at:
echo https://sad160130.github.io/[repository-name]
echo.
pause