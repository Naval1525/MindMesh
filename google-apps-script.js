// Google Apps Script for MindMesh Feedback System
// Deploy this as a web app to receive feedback submissions

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet (your MindMesh feedback sheet)
    const spreadsheet = SpreadsheetApp.openById('1J6xXI5OWW97GJHIgjmMPg-N8u4htqAMYFuUiv783pYc');
    const sheet = spreadsheet.getActiveSheet();
    
    // Log all incoming data for debugging
    Logger.log('Incoming data: ' + JSON.stringify(data));
    
    // Handle different data formats
    let timestamp, reaction, email, formData;
    
    if (data.entry) {
      // Google Forms format
      const entry = data.entry;
      Logger.log('Google Forms entry: ' + JSON.stringify(entry));
      
      timestamp = new Date().toISOString();
      
      // Try different possible field IDs for the feedback question
      // Based on the user's form: "Didn't like it", "good", "Best", "Loved it"
      const possibleFieldIds = ['2038293830', 'feedback', 'reaction', 'rating', 'entry.2038293830'];
      reaction = 'No reaction found';
      
      for (const fieldId of possibleFieldIds) {
        if (entry[fieldId]) {
          reaction = entry[fieldId];
          Logger.log('Found reaction in field ' + fieldId + ': ' + reaction);
          break;
        }
      }
      
      // Try different possible field IDs for email
      // The form shows "Email" as a required field
      const possibleEmailFields = ['email', 'Email', 'emailAddress', 'userEmail', 'entry.1234567890'];
      email = 'No email found';
      
      for (const emailField of possibleEmailFields) {
        if (entry[emailField]) {
          email = entry[emailField];
          Logger.log('Found email in field ' + emailField + ': ' + email);
          break;
        }
      }
      
      formData = entry;
    } else {
      // MindMesh feedback format
      timestamp = data.timestamp || new Date().toISOString();
      reaction = data.reaction || 'No reaction';
      email = data.email || 'No email';
      formData = data;
    }
    
    // Map reaction values and labels to emoji labels
    // Updated to match the exact form labels from the user's Google Form
    const reactionLabels = {
      // MindMesh format values
      'didnt_like': '😞 Didn\'t like it',
      'good': '😊 Good',
      'best': '😍 Best',
      'loved_it': '❤️ Loved it!',
      
      // Google Forms actual labels (from your form)
      'Didnt like': '😞 Didn\'t like it',
      'good': '😊 Good',
      'Best': '😍 Best',
      'Loved it': '❤️ Loved it!',
      
      // Handle variations and exact matches from your form
      'Didn\'t like it': '😞 Didn\'t like it',
      'Good': '😊 Good',
      'Loved it!': '❤️ Loved it!',
      'Didn\'t like': '😞 Didn\'t like it',
      
      // Additional variations that might come from the form
      'didnt_like_it': '😞 Didn\'t like it',
      'loved_it': '❤️ Loved it!'
    };
    
    const reactionLabel = reactionLabels[reaction] || reaction;
    Logger.log('Mapped reaction: ' + reaction + ' -> ' + reactionLabel);
    
    // Add the data to the sheet
    sheet.appendRow([
      new Date(timestamp), // Timestamp
      reactionLabel,       // Reaction
      email,              // Email
      JSON.stringify(formData), // Full form data for debugging
      reaction // Original reaction value for debugging
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Feedback submitted successfully',
        receivedData: data,
        mappedReaction: reactionLabel
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the script works
function testFeedback() {
  const testData = {
    reaction: 'loved_it',
    email: 'test@example.com',
    timestamp: new Date().toISOString()
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  Logger.log(result.getContent());
}

// Test Google Forms format with actual labels from your form
function testGoogleFormsFormat() {
  const testData = {
    entry: {
      '2038293830': 'Loved it',
      'email': 'test@example.com'
    }
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  Logger.log(result.getContent());
}

// Test all Google Forms labels from your form
function testAllLabels() {
  const labels = ['Didn\'t like it', 'good', 'Best', 'Loved it'];
  
  labels.forEach(label => {
    const testData = {
      entry: {
        '2038293830': label,
        'email': 'test@example.com'
      }
    };
    
    const result = doPost({
      postData: {
        contents: JSON.stringify(testData)
      }
    });
    
    Logger.log(`Testing "${label}": ${result.getContent()}`);
  });
}

// Setup function to create headers in the sheet
function setupSheet() {
  const spreadsheet = SpreadsheetApp.openById('1J6xXI5OWW97GJHIgjmMPg-N8u4htqAMYFuUiv783pYc');
  const sheet = spreadsheet.getActiveSheet();
  
  // Clear existing data and add headers
  sheet.clear();
  sheet.appendRow(['Timestamp', 'Reaction', 'Email', 'Full Data', 'Original Reaction']);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, 5);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, 5);
  
  Logger.log('Sheet setup complete!');
}

// Function to get the correct email field ID from your Google Form
function getEmailFieldId() {
  // You'll need to replace this with the actual email field ID from your Google Form
  // To find it: right-click on the email field in your form, inspect element, look for the name attribute
  return 'entry.1234567890'; // Replace with actual field ID
}