
// export to Excel Only-
function exportTableToExcel() {
    const table = document.getElementById('combinedTable');
    const headerCells = table.querySelectorAll('thead tr:nth-child(2) th');
    let headers = [];
    for (let i = 0; i < headerCells.length; i++) {
        if (headerCells[i].style.display !== 'none') {
            headers.push(headerCells[i].textContent.trim());
        }
    }
    // Always add Vehicle Type, Make-Model, Division to Excel export after Vehicle Number
    const insertAfter = (arr, afterKey, newKey) => {
        const idx = arr.indexOf(afterKey);
        if (idx !== -1 && !arr.includes(newKey)) arr.splice(idx + 1, 0, newKey);
    };
    insertAfter(headers, 'Vehicle Number', 'Vehicle Type');
    insertAfter(headers, 'Vehicle Type', 'Make-Model');
    insertAfter(headers, 'Make-Model', 'Division');

    // Collect all row data first
    const rows = table.querySelectorAll('tbody tr');
    let allRows = [];
    rows.forEach((row, index) => {
        if (row.style.display === 'none') return;
        const cells = row.cells;
        const rowData = {};
        let vehicleNumberFull = cells[1] ? cells[1].textContent.trim() : '';
        let vehicleNumber = '';
        let makeModelArr = [];
        let division = '';
        let vehicleType = '';
        const parts = vehicleNumberFull.split('[');
        vehicleNumber = parts[0].trim();
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i].replace(']', '').trim();
            if (["PRO", "R.O", "H.O"].includes(part.toUpperCase())) {
                division = `[${part}]`;
            } else if (["4 wheel", "heavy", "2 wheel"].includes(part.toLowerCase())) {
                vehicleType = `[${part.toUpperCase()}]`;
            } else {
                makeModelArr.push(`[${part}]`);
            }
        }
        headers.forEach((header, hIdx) => {
            switch(header) {
                case '#': rowData[header] = (index + 1).toString(); break;
                case 'Vehicle Number': rowData[header] = vehicleNumber; break;
                case 'Vehicle Type': rowData[header] = vehicleType; break;
                case 'Division': rowData[header] = division; break;
                case 'Make-Model': rowData[header] = makeModelArr.join(' '); break;
                default:
                    let colIdx = Array.from(headerCells).findIndex(th => th.textContent.trim() === header);
                    rowData[header] = cells[colIdx] ? cells[colIdx].textContent.trim() : '';
            }
        });
        // Add helper fields for grouping/sorting
        rowData._vehicleType = vehicleType;
        rowData._division = division;
        // Parse year and month from Renewal Date(Vehicle)
        let renewalDate = rowData['Renewal Date(Vehicles)'] || rowData['Renewal Date (Vehicles)'] || '';
        let year = 0, month = '';
        if (renewalDate) {
            const parts = renewalDate.split('-');
            if (parts.length === 3) {
                month = parts[1];
                year = parseInt(parts[2], 10);
            }
        }
        rowData._renewalYear = year;
        rowData._renewalMonth = month;
        allRows.push(rowData);
    });

    // Group and sort data, filter out duplicates
    const typeOrder = ['[2 WHEEL]', '[4 WHEEL]', '[HEAVY]'];
    const divisionOrder = ['[PRO]', '[R.O]', '[H.O]','[S.K]', '[INT]','[PVT]'];
    const monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let data = [];
    let uniqueSet = new Set();
    typeOrder.forEach(type => {
        let typeRows = allRows.filter(r => r._vehicleType === type);
        divisionOrder.forEach(division => {
            let divisionRows = typeRows.filter(r => r._division === division);
            divisionRows.sort((a, b) => {
                if (a._renewalYear !== b._renewalYear) return a._renewalYear - b._renewalYear;
                let aIdx = monthOrder.indexOf(a._renewalMonth);
                let bIdx = monthOrder.indexOf(b._renewalMonth);
                if (aIdx !== bIdx) return aIdx - bIdx;
                let aDate = a['Renewal Date(Vehicles)'] || a['Renewal Date (Vehicles)'] || '';
                let bDate = b['Renewal Date(Vehicles)'] || b['Renewal Date (Vehicles)'] || '';
                let aParts = aDate.split('-');
                let bParts = bDate.split('-');
                let aDay = aParts.length === 3 ? parseInt(aParts[0], 10) : 0;
                let bDay = bParts.length === 3 ? parseInt(bParts[0], 10) : 0;
                return aDay - bDay;
            });
            divisionRows.forEach(r => {
                let uniqueKey = `${r['Vehicle Number']}_${r['Renewal Date(Vehicles)'] || r['Renewal Date (Vehicles)']}_${r['Division']}_${r['Make-Model']}`;
                if (!uniqueSet.has(uniqueKey)) {
                    uniqueSet.add(uniqueKey);
                    delete r._vehicleType;
                    delete r._division;
                    delete r._renewalYear;
                    delete r._renewalMonth;
                    data.push(r);
                }
            });
        });
        let otherDivisionRows = typeRows.filter(r => !divisionOrder.includes(r._division));
        otherDivisionRows.sort((a, b) => {
            if (a._renewalYear !== b._renewalYear) return a._renewalYear - b._renewalYear;
            let aIdx = monthOrder.indexOf(a._renewalMonth);
            let bIdx = monthOrder.indexOf(b._renewalMonth);
            if (aIdx !== bIdx) return aIdx - bIdx;
            let aDate = a['Renewal Date(Vehicles)'] || a['Renewal Date (Vehicles)'] || '';
            let bDate = b['Renewal Date(Vehicles)'] || b['Renewal Date (Vehicles)'] || '';
            let aParts = aDate.split('-');
            let bParts = bDate.split('-');
            let aDay = aParts.length === 3 ? parseInt(aParts[0], 10) : 0;
            let bDay = bParts.length === 3 ? parseInt(bParts[0], 10) : 0;
            return aDay - bDay;
        });
        otherDivisionRows.forEach(r => {
            let uniqueKey = `${r['Vehicle Number']}_${r['Renewal Date(Vehicles)'] || r['Renewal Date (Vehicles)']}_${r['Division']}_${r['Make-Model']}`;
            if (!uniqueSet.has(uniqueKey)) {
                uniqueSet.add(uniqueKey);
                delete r._vehicleType;
                delete r._division;
                delete r._renewalYear;
                delete r._renewalMonth;
                data.push(r);
            }
        });
    });

    // Ensure '#' column is serial after filtering and sorting
    data.forEach((row, idx) => {
        if (row['#'] !== undefined) {
            row['#'] = (idx + 1).toString();
        }
    });

    // Convert data to worksheet
    const worksheetData = [];
    worksheetData.push(headers);
    data.forEach(rowData => {
        const rowArray = headers.map(header => rowData[header] || '');
        worksheetData.push(rowArray);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    ws['!cols'] = new Array(headers.length).fill({ wch: 15 });
    XLSX.utils.book_append_sheet(wb, ws, 'Vehicle Report');
    XLSX.writeFile(wb, 'processing+[R.O]_vehicle_report.xlsx');
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
