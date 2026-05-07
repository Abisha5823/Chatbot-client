// =============================================
// Google Apps Script - Paste in script.google.com
// Deploy as Web App → Anyone can access
// Copy the deployed URL to VITE_GOOGLE_SHEET_URL
// =============================================

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Location', 'EB Bill', 'Type', 'Status']);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }
    
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.phone || '',
      data.location || '',
      data.ebBill || '',
      data.type || '',
      'New'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('KI Bharath Solar Lead Collector - Active')
    .setMimeType(ContentService.MimeType.TEXT);
}