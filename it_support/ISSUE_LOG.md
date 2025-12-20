# Issue Log - IT Support Chatbot

This document tracks all issues encountered during the IT Support chatbot development, along with their solutions.

## 📋 Table of Contents
- [Setup Issues](#setup-issues)
- [Testing Issues](#testing-issues)
- [Integration Issues](#integration-issues)

---

## Setup Issues

### Issue #1: .env File Creation Blocked
**Date:** During initial setup  
**Symptoms:**
- Attempted to create `.env` file programmatically but it was blocked by globalignore
- File creation failed with error

**Root Cause:**
- `.env` files are typically in `.gitignore` and some systems block programmatic creation for security reasons

**Solution:**
- Created `.env.example` file as template
- Added clear instructions in README.md and SETUP.md for manual `.env` file creation
- User must manually create `.env` file and add their OpenAI API key

**Files Affected:**
- `backend/README.md` - Added setup instructions
- `SETUP.md` - Created comprehensive setup guide

**Lessons Learned:**
- Always provide clear manual setup instructions for sensitive files like `.env`
- Use `.env.example` as a template for users

---

### Issue #4: Port 5000 Already in Use (EADDRINUSE)
**Date:** During server startup  
**Symptoms:**
- Error: `listen EADDRINUSE: address already in use :::5000`
- Server fails to start when running `npm run dev`
- Error occurs even after stopping previous server instance

**Root Cause:**
- Another process (possibly a previous server instance) is already using port 5000
- Process may not have been properly terminated
- Could be from a previous failed start or another application

**Solution:**
1. **Root cause identified:** macOS ControlCenter uses port 5000 by default
2. **Primary solution:** Changed default port from 5000 to 5001 in server code
3. **Alternative solutions:**
   - Find and kill process: `lsof -ti:5000 | xargs kill -9`
   - Use helper script: `./scripts/free-port.sh 5000`
   - Change PORT in `.env` file to a different port (e.g., 5001, 5002)
4. Updated frontend to use port 5001 by default
5. Updated all documentation to reflect port 5001

**Files Affected:**
- `backend/src/server.js` - Changed default port to 5001, added better error handling
- `frontend/src/components/Chatbot.jsx` - Updated API URL to use port 5001
- `backend/scripts/free-port.sh` - Created helper script to free ports
- `.env` - Updated default port to 5001
- All documentation files - Updated to reflect port 5001

**Prevention:**
- Always properly stop servers with Ctrl+C
- Check for running processes before starting: `lsof -ti:5000`
- Consider using a process manager like PM2 for production
- Add port checking script to package.json

**Lessons Learned:**
- macOS ControlCenter uses port 5000 by default - avoid this port on macOS
- Always check if port is available before starting server: `lsof -i:PORT`
- Use `lsof -ti:PORT` to find process IDs using a specific port
- Can change PORT in `.env` if port conflict persists
- Added better error handling in server code to provide helpful messages
- Created helper script for port management
- Default to ports that are less likely to conflict (5001, 5002, etc.)

---

## Testing Issues

### Issue #2: ES Module Mocking in Jest
**Date:** During test development  
**Symptoms:**
- Jest tests for OpenAI mocking needed adjustment for ES modules
- Module mocking syntax different for ES modules vs CommonJS

**Root Cause:**
- Using ES modules (`type: "module"` in package.json)
- Jest's `jest.unstable_mockModule` needed for ES module mocking
- Import order matters when mocking ES modules

**Solution:**
- Used `jest.unstable_mockModule` for ES module mocking
- Ensured mocks are set up before importing the modules
- Used dynamic imports with `await import()` for mocked modules

**Files Affected:**
- `backend/tests/chatbot.test.js` - Updated mocking approach
- `backend/jest.config.js` - Configured for ES modules

**Lessons Learned:**
- ES module mocking requires `jest.unstable_mockModule`
- Mock setup must happen before module imports
- Use dynamic imports when working with mocked ES modules

---

## Integration Issues

### Issue #3: Frontend Test Setup with Vitest
**Date:** During frontend test development  
**Symptoms:**
- Needed to set up Vitest for React component testing
- Required proper configuration for jsdom environment

**Root Cause:**
- Vite projects use Vitest instead of Jest
- React Testing Library needs jsdom environment
- Need proper setup file for test matchers

**Solution:**
- Added Vitest to frontend dependencies
- Created `tests/setup.js` with jest-dom matchers
- Updated `vite.config.js` with test configuration
- Configured jsdom environment for React component testing

**Files Affected:**
- `frontend/package.json` - Added testing dependencies
- `frontend/vite.config.js` - Added test configuration
- `frontend/tests/setup.js` - Created test setup file

**Lessons Learned:**
- Vite projects should use Vitest, not Jest
- React Testing Library requires jsdom environment
- Setup files are needed for extending matchers

---

---

## Feature Additions

### Feature #1: Predefined Questions and Workflow System
**Date:** December 2024  
**Description:**
- Added predefined questions workflow that handles common IT support queries before hitting the LLM
- Created workflow service to match user questions against predefined responses
- Added UI for displaying clickable predefined questions
- Implemented keyword-based matching for intelligent question routing

**Implementation:**
1. **Backend:**
   - Created `workflowService.js` with 8 predefined question categories
   - Added keyword matching for intelligent question detection
   - Updated controller to check predefined responses before calling OpenAI
   - Added `/api/chatbot/questions` endpoint to fetch predefined questions

2. **Frontend:**
   - Added predefined questions display in chatbot welcome screen
   - Questions are clickable and automatically send when clicked
   - Questions hide after user sends a message
   - Questions reset when chatbot is reopened

3. **Predefined Categories:**
   - Account (password reset, username recovery)
   - Network (connection issues, WiFi problems)
   - Email (setup, configuration)
   - Performance (slow computer, optimization)
   - Hardware (printer, display issues)
   - Software (installation, updates)

**Benefits:**
- Faster response times for common questions (no LLM call needed)
- Consistent, accurate answers for standard IT issues
- Better user experience with quick access to common questions
- Reduced API costs by avoiding LLM calls for predefined questions

**Files Affected:**
- `backend/services/workflowService.js` - New workflow service
- `backend/controllers/chatbotController.js` - Updated to use workflow
- `backend/routes/chatbot.js` - Added questions endpoint
- `backend/tests/workflowService.test.js` - Tests for workflow service
- `frontend/src/components/Chatbot.jsx` - Added predefined questions UI
- `frontend/src/styles/Chatbot.css` - Styling for question buttons
- `frontend/tests/Chatbot.test.jsx` - Tests for predefined questions UI

**Lessons Learned:**
- Workflow system should check predefined responses before expensive LLM calls
- Keyword matching needs careful design to avoid false positives
- UI should make predefined questions easily accessible
- Questions should be categorized for better organization

---

**Last Updated:** December 2024  
**Total Issues Resolved:** 4  
**Features Added:** 1  
**Status:** All issues resolved ✅

