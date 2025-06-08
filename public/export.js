// export to Excel Only-
function exportTableToExcel() {
    const table = document.getElementById('combinedTable');
    const wb = XLSX.utils.book_new();

    // Get header cells from second row of thead
    const headerCells = table.querySelectorAll('thead tr:nth-child(2) th');

    // Determine visible columns (excluding last Actions column)
    const visibleColumns = [];
    const headers = [];
    for (let i = 0; i < headerCells.length; i++) {
        if (headerCells[i].style.display !== 'none') {
            visibleColumns.push(i);
            // Rename headers for renewal date columns for clarity
            if (i === 4) {
                headers.push('Renewal Date (Vehicle)');
            } else if (i === 14) {
                headers.push('Renewal Date (GPS)');
            } else {
                headers.push(headerCells[i].textContent.trim());
            }
        }
    }

    // Prepare header rows with merged cells based on visible columns
    // Since the original header1 and header2 are fixed, we need to dynamically create headers matching visible columns
    // For simplicity, we will create a single header row with visible column names

    const worksheetData = [];
    worksheetData.push(headers);

    // Prepare data rows from table body for visible columns only
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        if (row.style.display === 'none') return; // skip hidden rows if any
        const rowData = [];
        visibleColumns.forEach(colIndex => {
            rowData.push(row.cells[colIndex].textContent.trim());
        });
        worksheetData.push(rowData);
    });

    // Create worksheet from array of arrays
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Apply styling: bold and background color for header row
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = 0; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) continue;
        if (!ws[cellAddress].s) ws[cellAddress].s = {};
        ws[cellAddress].s.font = { bold: true, color: { rgb: "FFFFFF" } };
        ws[cellAddress].s.fill = { fgColor: { rgb: "2980b9" } };
        ws[cellAddress].s.alignment = { horizontal: "center", vertical: "center" };
        ws[cellAddress].s.border = {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
        };
    }

    // Set column widths for better appearance (optional, set all to 15)
    ws['!cols'] = new Array(headers.length).fill({ wch: 15 });

    XLSX.utils.book_append_sheet(wb, ws, 'VehicleMaintenance');
    XLSX.writeFile(wb, 'vehicle_maintenance_table.xlsx');
}

window.addEventListener('DOMContentLoaded', () => {
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportTableToPDF);
    }
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportTableToExcel);
    }
});
