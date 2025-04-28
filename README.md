# Google Sheet Select to CSV

A Google Apps Script that allows you to download selected columns from your Google Sheet as a CSV file.

## Features

- Download selected columns as a CSV file
- Column is considered selected if any cell in the column is selected
- Multiple columns can be selected at once
- Support for non-contiguous selections (multiple separate cell selections)
- Empty rows are automatically removed from the CSV output
- Direct download link provided when CSV is ready
- Double quotes in cells are properly escaped according to CSV standards

## Installation

1. Open your Google Sheet
2. Go to Extensions > Apps Script
3. Delete any existing code in the editor
4. Copy and paste the entire content of the `gsheet-select-to-csv.gs` file into the editor
5. Save the project (File > Save or Ctrl+S)
6. Reload your Google Sheet

## Usage

1. Select one or more cells in the columns you want to export
   - You can select multiple areas by holding Ctrl (or Cmd on Mac) while selecting
2. Click on the "CSV Tools" menu that appears in your Google Sheet toolbar
3. Select "Download Selected Columns as CSV"
4. If no cells are selected, you'll be prompted to select cells
5. Once the CSV is created, a dialog will appear with a download link
6. Click the link to download your CSV file

## License

MIT License 