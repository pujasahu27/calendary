@echo off
echo Initializing Git repository...
git init
git add .
git commit -m "Initial commit of Calendary app"
git branch -M main
git remote add origin https://github.com/pujasahu27/Calendary.git
echo Pushing to GitHub...
git push -u origin main
echo Done!
pause
