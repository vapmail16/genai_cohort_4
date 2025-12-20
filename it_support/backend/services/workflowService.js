// Predefined questions and responses for common IT support issues
const PREDEFINED_QUESTIONS = [
  {
    text: 'How do I reset my password?',
    category: 'Account',
    keywords: ['password', 'reset', 'forgot password', 'change password'],
  },
  {
    text: 'I cannot connect to the network',
    category: 'Network',
    keywords: ['network', 'connect', 'wifi', 'internet', 'connection', 'no internet'],
  },
  {
    text: 'How do I set up my email?',
    category: 'Email',
    keywords: ['email', 'setup', 'configure email', 'outlook', 'mail'],
  },
  {
    text: 'My computer is running slow',
    category: 'Performance',
    keywords: ['slow', 'performance', 'lagging', 'freezing', 'not responding'],
  },
  {
    text: 'I cannot print documents',
    category: 'Hardware',
    keywords: ['print', 'printer', 'printing', 'print job'],
  },
  {
    text: 'How do I install software?',
    category: 'Software',
    keywords: ['install', 'software', 'application', 'program', 'download'],
  },
  {
    text: 'My screen is blank or black',
    category: 'Hardware',
    keywords: ['screen', 'blank', 'black', 'display', 'monitor', 'no display'],
  },
  {
    text: 'I forgot my username',
    category: 'Account',
    keywords: ['username', 'forgot username', 'login', 'user id'],
  },
];

// Predefined responses for common questions
const PREDEFINED_RESPONSES = {
  password: {
    response: `To reset your password, follow these steps:

1. Go to the login page and click on "Forgot Password"
2. Enter your email address or username
3. Check your email for a password reset link
4. Click the link and follow the instructions to create a new password
5. Make sure your new password meets the security requirements (usually 8+ characters with letters, numbers, and special characters)

If you're still having trouble, contact your IT administrator for assistance.`,
    workflowType: 'password_reset',
  },
  network: {
    response: `Here are some steps to troubleshoot network connection issues:

1. **Check your connection:**
   - Verify that your WiFi is enabled or your Ethernet cable is connected
   - Check if other devices can connect to the network

2. **Restart your network adapter:**
   - Disable and re-enable your WiFi/Ethernet connection
   - Or restart your computer

3. **Check network settings:**
   - Verify you're connected to the correct network
   - Check if you need to enter a password or accept terms

4. **Restart your router/modem:**
   - Unplug for 30 seconds, then plug back in
   - Wait for all lights to stabilize

5. **Check firewall/antivirus:**
   - Temporarily disable to see if it's blocking the connection

If none of these work, contact your network administrator.`,
    workflowType: 'network_troubleshooting',
  },
  email: {
    response: `To set up your email, follow these steps:

**For Outlook:**
1. Open Outlook and go to File > Add Account
2. Enter your email address and click "Connect"
3. Enter your password when prompted
4. Outlook will automatically configure the settings

**For other email clients:**
1. You'll need:
   - Your email address
   - Password
   - Incoming mail server (IMAP/POP3)
   - Outgoing mail server (SMTP)
   - Port numbers (usually 993 for IMAP, 587 for SMTP)

2. Contact your IT department for the specific server settings

**For webmail:**
- Simply go to your email provider's website and log in

Need help with specific settings? Contact your IT support team.`,
    workflowType: 'email_setup',
  },
  performance: {
    response: `Here are ways to improve your computer's performance:

1. **Close unnecessary programs:**
   - Check Task Manager (Ctrl+Shift+Esc) and close unused applications
   - Look for programs using high CPU or memory

2. **Restart your computer:**
   - A simple restart can clear memory and fix many issues

3. **Check for updates:**
   - Install Windows/Mac updates
   - Update your software and drivers

4. **Free up disk space:**
   - Delete temporary files
   - Uninstall unused programs
   - Empty your Recycle Bin/Trash

5. **Run antivirus scan:**
   - Malware can slow down your computer

6. **Check startup programs:**
   - Disable programs that start automatically but aren't needed

If the problem persists, your computer may need more RAM or a hardware upgrade.`,
    workflowType: 'performance_optimization',
  },
  printer: {
    response: `Troubleshooting printing issues:

1. **Check printer status:**
   - Ensure printer is turned on and has paper/ink
   - Check for error lights or messages on the printer

2. **Verify connection:**
   - For network printers: Check if printer is online
   - For USB printers: Check cable connection

3. **Check printer queue:**
   - Open Printers & Scanners (Windows) or Print & Fax (Mac)
   - Clear any stuck print jobs
   - Set the correct printer as default

4. **Reinstall printer:**
   - Remove printer from your system
   - Add it again using the Add Printer wizard

5. **Update printer drivers:**
   - Download latest drivers from manufacturer's website

If issues persist, contact IT support for assistance.`,
    workflowType: 'printer_troubleshooting',
  },
  software: {
    response: `To install software on your computer:

**Windows:**
1. Download the installer file (.exe or .msi)
2. Right-click and select "Run as Administrator" if needed
3. Follow the installation wizard
4. Restart if prompted

**Mac:**
1. Download the installer (.dmg file)
2. Open the .dmg file
3. Drag the application to Applications folder
4. Eject the disk image

**Important:**
- Only install software from trusted sources
- Check with IT before installing software on work computers
- Some software requires administrator privileges

Need help with a specific application? Contact IT support.`,
    workflowType: 'software_installation',
  },
  screen: {
    response: `Troubleshooting blank/black screen issues:

1. **Check power:**
   - Ensure monitor is turned on
   - Check power cable connections
   - Try a different power outlet

2. **Check video cable:**
   - Ensure cable is securely connected
   - Try a different cable if available
   - Check for bent pins

3. **Test with another device:**
   - Connect monitor to another computer to see if it's a monitor issue

4. **For laptops:**
   - Try connecting an external monitor
   - Check if screen works when you adjust brightness
   - Try closing and reopening the laptop

5. **Restart your computer:**
   - Sometimes a simple restart fixes display issues

If the screen is still blank, it may be a hardware issue requiring repair.`,
    workflowType: 'display_troubleshooting',
  },
  username: {
    response: `To recover your username:

1. **Check your email:**
   - Look for account creation emails or welcome messages
   - Your username is often in the email address or mentioned in the email

2. **Contact your administrator:**
   - Your IT department can look up your username
   - They may ask for verification (employee ID, email, etc.)

3. **Check documentation:**
   - Look for any account setup documents you received
   - Check your employee onboarding materials

4. **Try common formats:**
   - Firstname.Lastname
   - FirstnameLastname
   - Employee ID number

For security reasons, usernames are usually not displayed publicly. Contact your IT support team for assistance.`,
    workflowType: 'username_recovery',
  },
};

/**
 * Check if a user message matches a predefined question and return response
 * @param {string} userMessage - The user's message
 * @returns {Object} - { hasPredefinedResponse: boolean, response?: string, workflowType?: string }
 */
export const checkPredefinedResponse = (userMessage) => {
  if (!userMessage || typeof userMessage !== 'string') {
    return { hasPredefinedResponse: false };
  }

  const normalizedMessage = userMessage.toLowerCase().trim();

  // Check each predefined question
  for (const question of PREDEFINED_QUESTIONS) {
    // Check if message matches the question text
    if (normalizedMessage === question.text.toLowerCase()) {
      const category = question.category.toLowerCase();
      const key = Object.keys(PREDEFINED_RESPONSES).find((k) =>
        category.includes(k) || question.keywords.some((kw) => category.includes(kw))
      );
      
      if (key && PREDEFINED_RESPONSES[key]) {
        return {
          hasPredefinedResponse: true,
          response: PREDEFINED_RESPONSES[key].response,
          workflowType: PREDEFINED_RESPONSES[key].workflowType,
        };
      }
    }

    // Check if message contains keywords
    const matchesKeywords = question.keywords.some((keyword) =>
      normalizedMessage.includes(keyword.toLowerCase())
    );

    if (matchesKeywords) {
      // Map to response key based on question category and keywords
      let responseKey = null;

      // Direct mapping based on question category
      if (question.category === 'Account') {
        if (question.keywords.some((k) => normalizedMessage.includes('password'))) {
          responseKey = 'password';
        } else if (question.keywords.some((k) => normalizedMessage.includes('username'))) {
          responseKey = 'username';
        }
      } else if (question.category === 'Network') {
        responseKey = 'network';
      } else if (question.category === 'Email') {
        responseKey = 'email';
      } else if (question.category === 'Performance') {
        responseKey = 'performance';
      } else if (question.category === 'Hardware') {
        if (question.keywords.some((k) => normalizedMessage.includes('print'))) {
          responseKey = 'printer';
        } else if (question.keywords.some((k) => normalizedMessage.includes('screen') || normalizedMessage.includes('display') || normalizedMessage.includes('monitor'))) {
          responseKey = 'screen';
        }
      } else if (question.category === 'Software') {
        responseKey = 'software';
      }

      if (responseKey && PREDEFINED_RESPONSES[responseKey]) {
        return {
          hasPredefinedResponse: true,
          response: PREDEFINED_RESPONSES[responseKey].response,
          workflowType: PREDEFINED_RESPONSES[responseKey].workflowType,
        };
      }
    }
  }

  return { hasPredefinedResponse: false };
};

/**
 * Get list of predefined questions for the UI
 * @returns {Array} - Array of question objects with text and category
 */
export const getPredefinedQuestions = () => {
  return PREDEFINED_QUESTIONS.map((q) => ({
    text: q.text,
    category: q.category,
  }));
};

