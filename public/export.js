// export to Excel Only-
function exportTableToExcel() {
    const table = document.getElementById('combinedTable');
    const wb = XLSX.utils.book_new();

    // Get header cells from second row of thead
    const headerCells = table.querySelectorAll('thead tr:nth-child(2) th');

    // Determine visible columns (excluding last Actions column)
    const visibleColumns = [];
    let headers = [];
    for (let i = 0; i < headerCells.length; i++) {
        // Exclude the last column if it is the Actions column (assuming last column index)
        if (i === headerCells.length - 1) {
            continue;
        }
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
    // Always add Vehicle Type, Make-Model, Division after Vehicle Number
    const insertAfter = (arr, afterKey, newKey) => {
        const idx = arr.indexOf(afterKey);
        if (idx !== -1 && !arr.includes(newKey)) arr.splice(idx + 1, 0, newKey);
    };
    insertAfter(headers, 'Vehicle Number', 'Vehicle Type');
    insertAfter(headers, 'Vehicle Type', 'Make-Model');
    insertAfter(headers, 'Make-Model', 'Division');

    // Prepare data rows from table body for visible columns + extra columns
    const rows = table.querySelectorAll('tbody tr');
    const dataObjects = [];

    rows.forEach(row => {
        if (row.style.display === 'none') return; // skip hidden rows if any
        const cells = row.cells;
        const rowData = {};
        // Parse Vehicle Number for Division, Make-Model, Vehicle Type
        let vehicleNumberFull = cells[1] ? cells[1].textContent.trim() : '';
        let vehicleNumber = '';
        let makeModelArr = [];
        let division = '';
        let vehicleTypeArr = [];
        const parts = vehicleNumberFull.split('[');
        vehicleNumber = parts[0].trim();
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i].replace(']', '').trim();
            if (["PRO", "R.O", "H.O"].includes(part.toUpperCase())) {
                division = `[${part}]`;
            } else if (["4 wheel", "heavy", "2 wheel"].includes(part.toLowerCase())) {
                vehicleTypeArr.push(`[${part}]`);
            } else {
                makeModelArr.push(`[${part}]`);
            }
        }
        headers.forEach((header, idx) => {
            switch(header) {
                case '#': rowData[header] = row.cells[0] ? row.cells[0].textContent.trim() : (dataObjects.length + 1).toString(); break;
                case 'Vehicle Number': rowData[header] = vehicleNumber; break;
                case 'Vehicle Type': rowData[header] = vehicleTypeArr.join(' '); break;
                case 'Division': rowData[header] = division; break;
                case 'Make-Model': rowData[header] = makeModelArr.join(' '); break;
                default:
                    // Find column index for this header
                    let colIdx = Array.from(headerCells).findIndex(th => th.textContent.trim() === header);
                    rowData[header] = cells[colIdx] ? cells[colIdx].textContent.trim() : '';
            }
        });
        dataObjects.push(rowData);
    });

    // Sort dataObjects by 'Renewal Date (Vehicle)' ascending
    function parseDate(dateStr) {
        if (!dateStr) return new Date(0);
        const months = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = months[parts[1]];
            const year = parseInt(parts[2], 10);
            if (!isNaN(day) && month !== undefined && !isNaN(year)) {
                return new Date(year, month, day);
            }
        }
        const parsedDate = new Date(dateStr);
        if (isNaN(parsedDate)) {
            return new Date(0);
        }
        return parsedDate;
    }

    dataObjects.sort((a, b) => {
        if (!a.hasOwnProperty('Renewal Date (Vehicle)') || !b.hasOwnProperty('Renewal Date (Vehicle)')) return 0;
        return parseDate(a['Renewal Date (Vehicle)']) - parseDate(b['Renewal Date (Vehicle)']);
    });

    // Renumber serial numbers starting from 1
    const serialNumberHeader = headers.find(header => header === '#');
    if (serialNumberHeader) {
        dataObjects.forEach((rowData, index) => {
            rowData[serialNumberHeader] = (index + 1).toString();
        });
    }

    // Convert dataObjects back to array of arrays for worksheet
    const worksheetData = [];
    worksheetData.push(headers);
    dataObjects.forEach(rowData => {
        const rowArray = headers.map(header => rowData[header] || '');
        worksheetData.push(rowArray);
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
            left: { style: "thin", color: { rgb: "000e000" } },
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
