# Product Requirement Document

## Overview
Google Spreadsheet AppScript that let the user download selected columns as CSV file.

Application Type: AppScript in Google Spreadsheet
License: MIT

## Features
- Consider a column as selected, if the user has selected any of the cell in the column. Multiple columns can be considered as selected at the same time.
- If no cell is selected, prompt user to select cells to specify columns to download.
- Create CSV data of the selected columns.
- Remove any emply rows.
- Let the user download the CSV file automatically after the data is ready.
- If the cell contains double quoation, escape it.
