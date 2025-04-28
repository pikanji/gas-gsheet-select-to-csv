/**
 * Creates a custom menu in the Google Sheets UI when the document is opened.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('CSV Tools')
    .addItem('Download Selected Columns as CSV', 'downloadSelectedColumnsAsCSV')
    .addToUi();
}

/**
 * Main function to download selected columns as CSV.
 */
function downloadSelectedColumnsAsCSV() {
  const ui = SpreadsheetApp.getUi();
  const activeSheet = SpreadsheetApp.getActiveSheet();
  const selection = SpreadsheetApp.getSelection();
  
  // Get all selected ranges
  const rangeList = selection.getActiveRangeList();
  
  // Check if any cells are selected
  if (!rangeList || rangeList.getRanges().length === 0) {
    ui.alert('No Selection', 'Please select cells to specify columns to download.', ui.ButtonSet.OK);
    return;
  }
  
  // Get the columns that are selected from all ranges
  const selectedColumns = getSelectedColumnsFromRanges(rangeList.getRanges());
  
  if (selectedColumns.length === 0) {
    ui.alert('No Columns Selected', 'No columns were identified from your selection.', ui.ButtonSet.OK);
    return;
  }
  
  // Get all data from the sheet
  const data = activeSheet.getDataRange().getValues();
  
  // Extract only the selected columns and remove empty rows
  const csvData = extractSelectedColumnsData(data, selectedColumns);
  
  // Convert to CSV
  const csvContent = convertToCSV(csvData);
  
  // Create the file and show download dialog
  createAndDownloadCSV(csvContent, activeSheet.getName());
}

/**
 * Get column indices that are selected from multiple ranges.
 * 
 * @param {Range[]} ranges - Array of selected ranges.
 * @return {number[]} Array of unique column indices that are selected.
 */
function getSelectedColumnsFromRanges(ranges) {
  // Use a Set to automatically deduplicate column indices
  const selectedColumnsSet = new Set();
  
  // Process each range
  ranges.forEach(range => {
    const startColumn = range.getColumn();
    const numColumns = range.getNumColumns();
    
    // Add all columns in this range to the set
    for (let i = 0; i < numColumns; i++) {
      selectedColumnsSet.add(startColumn + i - 1); // Converting to 0-indexed
    }
  });
  
  // Convert the Set back to an Array and sort it
  return Array.from(selectedColumnsSet).sort((a, b) => a - b);
}

/**
 * Extract data for selected columns and remove empty rows.
 * 
 * @param {Array<Array<any>>} data - All data from the sheet.
 * @param {number[]} selectedColumns - Indices of selected columns.
 * @return {Array<Array<any>>} Filtered data.
 */
function extractSelectedColumnsData(data, selectedColumns) {
  // Extract only the selected columns
  const selectedData = data.map(row => 
    selectedColumns.map(colIndex => row[colIndex])
  );
  
  // Remove empty rows (rows where all cells are empty)
  const nonEmptyRows = selectedData.filter(row => 
    row.some(cell => cell !== null && cell !== '')
  );
  
  return nonEmptyRows;
}

/**
 * Convert data array to CSV string.
 * 
 * @param {Array<Array<any>>} data - The data to convert.
 * @return {string} CSV formatted string.
 */
function convertToCSV(data) {
  return data.map(row => 
    row.map(cell => {
      // Handle different data types and escape quotes
      if (cell === null || cell === undefined) {
        return '';
      }
      
      const cellStr = String(cell);
      // If cell contains commas, newlines, or quotes, wrap in quotes and escape internal quotes
      // Double quotes are escaped by replacing each " with "" as per CSV standard
      if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
        return '"' + cellStr.replace(/"/g, '""') + '"';
      }
      return cellStr;
    }).join(',')
  ).join('\n');
}

/**
 * Create and trigger download of the CSV file.
 * 
 * @param {string} csvContent - The CSV data as string.
 * @param {string} sheetName - Name of the sheet for the filename.
 */
function createAndDownloadCSV(csvContent, sheetName) {
  const fileName = `${sheetName}_export_${new Date().toISOString().slice(0, 10)}.csv`;
  
  // Create the file in Google Drive
  const contentBlob = Utilities.newBlob(csvContent, 'text/csv', fileName);
  const file = DriveApp.createFile(contentBlob);
  
  // Get the download URL
  const url = file.getDownloadUrl();
  
  // Show modal dialog with download link
  const html = HtmlService.createHtmlOutput(
    `<html>
      <body>
        <p>Your CSV file is ready.</p>
        <a href="${url}" target="_blank">Click here to download</a>
      </body>
    </html>`
  )
  .setWidth(300)
  .setHeight(100);
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Download CSV');
} 