# Troubleshooting Guide

## Common Issues and Solutions

### 1. MongoDB Connection Issues

#### Error: "connect ECONNREFUSED ::1:27017"

**Cause**: MongoDB is not running or connection string is incorrect.

**Solutions**:

**For Local MongoDB**:
```bash
# Windows - Check if MongoDB service is running
services.msc
# Look for "MongoDB Server" and ensure it's running

# Start MongoDB manually
mongod --dbpath C:\data\db

# Or start as service
net start MongoDB
```

**For MongoDB Atlas**:
- Verify connection string in `server/.env`
- Check username and password are correct
- Ensure IP whitelist includes your IP
- Test connection with MongoDB Compass

#### Error: "Authentication failed"

**Solutions**:
- Double-check username and password in connection string
- Ensure database user has correct permissions
- URL-encode special characters in password:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`

Example:
```
# If password is: MyP@ss#123
# Use: MyP%40ss%23123
mongodb+srv://user:MyP%40ss%23123@cluster.mongodb.net/aov_stats
```

---

### 2. Port Already in Use

#### Error: "Port 5000 is already in use"

**Solutions**:

**Option A - Change Backend Port**:
1. Edit `server/.env`:
   ```env
   PORT=5001
   ```
2. Edit `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

**Option B - Kill Process Using Port**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

#### Error: "Port 5173 is already in use"

**Solution**:
```bash
# Vite will automatically try the next available port
# Or specify a different port in vite.config.js
```

---

### 3. npm Install Errors

#### Error: "EACCES: permission denied"

**Solutions**:
```bash
# Windows - Run as Administrator
# Right-click Command Prompt → Run as Administrator

# Mac/Linux - Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

#### Error: "Cannot find module"

**Solutions**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
```

#### Error: "Unsupported engine"

**Solution**:
```bash
# Check Node.js version
node -v

# Update Node.js to v18+
# Download from: https://nodejs.org/
```

---

### 4. Frontend Build Errors

#### Error: "Failed to resolve import"

**Cause**: Missing file or incorrect import path.

**Solutions**:
- Check file exists at the import path
- Verify file extension (.jsx vs .js)
- Check case sensitivity (Home.jsx vs home.jsx)
- Ensure all page components are created

#### Error: "React is not defined"

**Solution**:
```javascript
// Add import at top of file
import React from 'react';
```

#### Error: "Cannot read property of undefined"

**Cause**: Data not loaded yet or API call failed.

**Solutions**:
- Check loading states are handled
- Verify API is returning data
- Add optional chaining: `data?.property`
- Check browser console for API errors

---

### 5. API Connection Issues

#### Error: "Network Error" or "Failed to fetch"

**Causes & Solutions**:

1. **Backend not running**:
   ```bash
   cd server
   npm run dev
   ```

2. **Wrong API URL**:
   - Check `client/.env` has correct URL
   - Verify backend is on http://localhost:5000

3. **CORS Error**:
   - Check `server/src/server.js` has CORS enabled
   - Verify frontend URL is allowed

4. **Firewall blocking**:
   - Temporarily disable firewall
   - Add exception for Node.js

#### Error: "404 Not Found"

**Solutions**:
- Verify API endpoint exists in routes
- Check URL path is correct
- Ensure backend server started successfully
- Test endpoint with curl or Postman:
  ```bash
  curl http://localhost:5000/api/health
  ```

---

### 6. Database Seeding Issues

#### Error: "No data showing in frontend"

**Solutions**:
```bash
# Run seeders
cd server
node src/scrapers/runHeroScraper.js
node src/scrapers/runPlayerScraper.js

# Verify data in MongoDB Compass
# Connect to: mongodb://localhost:27017
# Check collections: heroes, herostats, players, matches
```

#### Error: "Scraper fails"

**Solutions**:
- Check MongoDB connection first
- Verify internet connection (for web scraping)
- Check console for specific error messages
- Try running with more verbose logging

---

### 7. Styling Issues

#### Error: "Tailwind classes not working"

**Solutions**:
1. Verify `tailwind.config.js` exists
2. Check `postcss.config.js` exists
3. Ensure `index.css` has Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. Restart dev server after config changes

#### Error: "Styles not updating"

**Solutions**:
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Restart Vite dev server
- Check browser console for CSS errors

---

### 8. React Query Issues

#### Error: "useQuery is not a function"

**Solution**:
```javascript
// Correct import
import { useQuery } from '@tanstack/react-query';

// Not from 'react-query' (old version)
```

#### Error: "No QueryClient set"

**Solution**:
- Ensure `QueryClientProvider` wraps your app in `App.jsx`
- Check `queryClient` is created before provider

---

### 9. Deployment Issues

#### Render: "Build failed"

**Solutions**:
- Check build logs for specific error
- Verify `package.json` has correct scripts
- Ensure all dependencies are in `dependencies` not `devDependencies`
- Check Node.js version compatibility

#### Vercel: "Build failed"

**Solutions**:
- Check build command is `npm run build`
- Verify output directory is `dist`
- Ensure environment variables are set
- Check build logs for errors

#### MongoDB Atlas: "IP not whitelisted"

**Solutions**:
- Go to Network Access in Atlas
- Add current IP address
- Or use "Allow Access from Anywhere" (0.0.0.0/0)

---

### 10. Performance Issues

#### Slow API responses

**Solutions**:
- Add database indexes (already included in models)
- Implement caching with Redis
- Optimize database queries
- Use pagination for large datasets

#### Slow frontend loading

**Solutions**:
- Implement code splitting:
  ```javascript
  const HeroDetail = lazy(() => import('./pages/HeroDetail'));
  ```
- Optimize images (use WebP, lazy loading)
- Reduce bundle size
- Use production build for testing

---

## Debugging Tips

### Backend Debugging

1. **Check server logs**:
   ```bash
   cd server
   npm run dev
   # Watch console output
   ```

2. **Test API directly**:
   ```bash
   # Health check
   curl http://localhost:5000/api/health

   # Get heroes
   curl http://localhost:5000/api/heroes

   # Search players
   curl "http://localhost:5000/api/players/search?name=Pro"
   ```

3. **Check MongoDB data**:
   - Use MongoDB Compass
   - Connect to your database
   - Browse collections manually

### Frontend Debugging

1. **Browser DevTools**:
   - Open Console (F12)
   - Check Network tab for API calls
   - Look for error messages

2. **React DevTools**:
   - Install React DevTools extension
   - Inspect component props and state
   - Check component hierarchy

3. **Check API calls**:
   ```javascript
   // Add console.log in api.js
   api.interceptors.response.use(
     response => {
       console.log('API Response:', response);
       return response;
     }
   );
   ```

---

## Environment-Specific Issues

### Windows-Specific

1. **Path issues**:
   - Use forward slashes in paths
   - Or use `path.join()` for cross-platform compatibility

2. **Line endings**:
   ```bash
   git config --global core.autocrlf true
   ```

3. **PowerShell execution policy**:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Mac/Linux-Specific

1. **Permission issues**:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **MongoDB not starting**:
   ```bash
   # Check if MongoDB is installed
   brew services list

   # Start MongoDB
   brew services start mongodb-community
   ```

---

## Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Read error messages carefully
3. ✅ Check browser console
4. ✅ Check server logs
5. ✅ Verify all files are present
6. ✅ Ensure dependencies are installed
7. ✅ Try restarting servers

### Where to Get Help

1. **Documentation**:
   - README.md
   - QUICKSTART.md
   - MONGODB_SETUP.md
   - DEPLOYMENT.md

2. **Online Resources**:
   - Stack Overflow
   - GitHub Issues
   - Reddit: r/webdev, r/reactjs, r/node
   - Discord: Reactiflux

3. **Official Docs**:
   - React: https://react.dev
   - Express: https://expressjs.com
   - MongoDB: https://docs.mongodb.com
   - Vite: https://vitejs.dev

### When Reporting Issues

Include:
- Error message (full text)
- Steps to reproduce
- Your environment (OS, Node version)
- What you've already tried
- Relevant code snippets
- Console/server logs

---

## Quick Fixes Checklist

When something breaks, try these in order:

1. ✅ Restart dev servers
2. ✅ Clear browser cache (Ctrl+Shift+R)
3. ✅ Check MongoDB is running
4. ✅ Verify environment variables
5. ✅ Check all files are saved
6. ✅ Delete node_modules and reinstall
7. ✅ Check for typos in code
8. ✅ Review recent changes
9. ✅ Check Git status for uncommitted changes
10. ✅ Read error messages completely

---

## Prevention Tips

### Best Practices

1. **Version Control**:
   ```bash
   git init
   git add .
   git commit -m "Working version"
   ```

2. **Regular Backups**:
   - Commit frequently
   - Push to GitHub
   - Export MongoDB data

3. **Environment Files**:
   - Never commit `.env` files
   - Keep `.env.example` updated
   - Document all required variables

4. **Dependencies**:
   - Keep `package.json` updated
   - Use exact versions for production
   - Regularly update dependencies

5. **Testing**:
   - Test after each major change
   - Test on different browsers
   - Test API endpoints with Postman

---

## Emergency Recovery

### If Everything Breaks

1. **Start Fresh**:
   ```bash
   # Backup your .env files
   cp server/.env server/.env.backup
   cp client/.env client/.env.backup

   # Delete node_modules
   rm -rf server/node_modules client/node_modules

   # Reinstall
   cd server && npm install
   cd ../client && npm install

   # Restore .env files
   cp server/.env.backup server/.env
   cp client/.env.backup client/.env
   ```

2. **Reset Database**:
   ```bash
   # Drop database in MongoDB Compass
   # Or use mongo shell
   mongo
   use aov_stats
   db.dropDatabase()

   # Reseed
   cd server
   node src/scrapers/runHeroScraper.js
   node src/scrapers/runPlayerScraper.js
   ```

3. **Check Git History**:
   ```bash
   git log
   git checkout <commit-hash>
   ```

---

## Still Having Issues?

If you've tried everything and still have problems:

1. Create a minimal reproduction
2. Check if it's a known issue
3. Ask on Stack Overflow with:
   - Specific error message
   - Minimal code example
   - What you've tried
   - Your environment details

Remember: Most issues are simple fixes once you find the root cause. Stay calm and debug systematically! 🐛🔍

---

**Last Updated**: 2026-01-31
