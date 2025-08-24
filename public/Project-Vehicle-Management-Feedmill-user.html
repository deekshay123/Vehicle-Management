// Toggle form visibility and arrow direction
const toggleBtn = document.getElementById('toggleFormBtn');
const form = document.getElementById('combinedForm');
const arrow = toggleBtn.querySelector('.arrow');

toggleBtn.addEventListener('click', () => {
    const isShown = form.classList.contains('show');
    if (isShown) {
        // Hide form instantly without delays
        form.style.maxHeight = '0';
        form.style.display = 'none';
        form.classList.remove('show');
        arrow.classList.remove('up');
        arrow.classList.add('down');
        toggleBtn.setAttribute('aria-expanded', false);
        toggleBtn.querySelector('span.arrow').className = 'arrow down';
        toggleBtn.querySelector('span.arrow').innerHTML = '&#9660;'; // down arrow
        toggleBtn.childNodes[2].nodeValue = ' Show Form';
    } else {
        // Show form with transition
        form.style.display = 'flex';
        // Allow display to apply before maxHeight change
        setTimeout(() => {
            form.classList.add('show');
            form.style.maxHeight = '1000px';
        }, 10);
        arrow.classList.remove('down');
        arrow.classList.add('up');
        toggleBtn.setAttribute('aria-expanded', true);
        toggleBtn.querySelector('span.arrow').className = 'arrow up';
        toggleBtn.querySelector('span.arrow').innerHTML = '&#9650;'; // up arrow
        toggleBtn.childNodes[2].nodeValue = ' Hide Form';
    }
});

// After transition ends, remove max-height restriction to allow full height
form.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'max-height' && form.classList.contains('show')) {
        form.style.maxHeight = 'none';
    }
});

// Function to calculate status based on renewal date
function calculateStatus(renewalDateStr) {
    const today = new Date();
    const renewalDate = new Date(renewalDateStr);
    const diffTime = renewalDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
        return { text: 'Active', className: 'status-active' };
    } else if (diffDays > 10) {
        return { text: `${diffDays} days left`, className: 'status-days-left' };
    } else if (diffDays > 1) {
        return { text: 'Expiring soon', className: 'status-expiring' };
    } else {
        return { text: 'Expired', className: 'status-expired' };
    }
}

// Helper function to format time
function formatTimeDifferenceFromToday(dateStr) {
    if (!dateStr) return '';
    const today = new Date();
    const pastDate = new Date(dateStr);
    if (isNaN(pastDate)) return '';

    let years = today.getFullYear() - pastDate.getFullYear();
    let months = today.getMonth() - pastDate.getMonth();
    let days = today.getDate() - pastDate.getDate();

    if (days < 0) {
        months -= 1;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    let result = '';
    if (years > 0) {
        result += years + (years === 1 ? ' year ' : ' years ');
    }
    if (months > 0) {
        result += months + (months === 1 ? ' month ' : ' months ');
    }
    if (days > 0) {
        result += days + (days === 1 ? ' day ' : ' days ');
    }
    if (result === '') {
        result = 'Today';
    } else {
        result = result.trim() + ' ago';
    }
    return result;
}

// API base URL
const API_BASE_URL = '/api/records';

// Get division from sessionStorage for this tab
function getDivision() {
    return sessionStorage.getItem('division') || '';
}

// Helper to add division header to fetch options
function addDivisionHeader(options = {}) {
    const division = getDivision();
    if (!options.headers) {
        options.headers = {};
    }
    if (division) {
        options.headers['X-Division'] = division;
    }
    return options;
}

// Fetch all records from backend API
async function fetchRecords() {
    try {
        const options = addDivisionHeader({ credentials: 'include' });
        const response = await fetch(API_BASE_URL, options);
        if (!response.ok) {
            throw new Error('Failed to fetch records');
        }
        const data = await response.json();
        window.currentData = data; // store globally for filtering
        return data;
    } catch (error) {
        showNotification('Error fetching records: ' + error.message);
        return [];
    }
}

// Add a new record via API
async function addRecord(record) {
    try {
        const options = addDivisionHeader({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record),
            credentials: 'include'
        });
        const response = await fetch(API_BASE_URL, options);
        if (!response.ok) {
            throw new Error('Failed to add record');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        showNotification('Error adding record: ' + error.message);
        return null;
    }
}

// Update a record via API
async function updateRecord(id, record) {
    try {
        const options = addDivisionHeader({
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record),
            credentials: 'include'
        });
        const response = await fetch(`${API_BASE_URL}/${id}`, options);
        if (!response.ok) {
            throw new Error('Failed to update record');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        showNotification('Error updating record: ' + error.message);
        return null;
    }
}

async function deleteRecord(id, deleteReason, deletedBy) {
    try {
        console.log('Deleting record with id:', id);
        console.log('Delete reason:', deleteReason);
        console.log('Deleted by:', deletedBy);
        const options = addDivisionHeader({
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                deleteReason,
                deletedBy
            }),
            credentials: 'include'
        });
        const response = await fetch(`${API_BASE_URL}/${id}`, options);
        if (!response.ok) {
            console.error('Failed to delete record, response status:', response.status);
            throw new Error('Failed to delete record');
        }
        const data = await response.json();
        console.log('Delete response data:', data);
        return data;
    } catch (error) {
        showNotification('Error deleting record: ' + error.message);
        return null;
    }
}

// Pagination variables
let currentPage = 1;
const itemsPerPage = 150;
let isAllFilterActive = false; // Track if "All" filter is active

// Helper: get visible column indices from localStorage
function getVisibleColumnIndices() {
    const savedVisibility = JSON.parse(localStorage.getItem('columnVisibility')) || {};
    const headers = Array.from(document.querySelectorAll('#combinedTable thead tr:nth-child(2) th'));
    let visibleIndices = [];
    headers.forEach((th, idx) => {
        const visible = savedVisibility.hasOwnProperty(idx) ? savedVisibility[idx] : true;
        if (visible) visibleIndices.push(idx);
    });
    return visibleIndices;
}

// Render the table rows from data array for the current page or all if all filter active
function renderTable(data) {
    const tableBody = document.getElementById('combinedTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    let startIndex = 0;
    let endIndex = data.length;

    if (!isAllFilterActive) {
        // Calculate start and end indices for current page
        startIndex = (currentPage - 1) * itemsPerPage;
        endIndex = Math.min(startIndex + itemsPerPage, data.length);
    }

    // Get visible columns
    const visibleIndices = getVisibleColumnIndices();

    for (let i = startIndex; i < endIndex; i++) {
        insertRow(tableBody, data[i], i + 1, visibleIndices);
    }

    // Add professional design class if more than 20 rows
    const tableContainer = document.querySelector('.table-container');
    if (data.length > 20) {
        tableContainer.classList.add('professional-design');
    } else {
        tableContainer.classList.remove('professional-design');
    }
    updateStatusCounts(data);

    // Render pagination controls only if not showing all
    if (!isAllFilterActive) {
        renderPaginationControls(data.length);
    } else {
        const paginationContainer = document.getElementById('paginationControls');
        paginationContainer.innerHTML = '';
    }

    // Reapply stored column visibility and reinitialize column resizing after table render
    if (typeof applyColumnVisibility === 'function') {
        applyColumnVisibility();
    }
    initColumnResizing('combinedTable');
}

// Render pagination controls
function renderPaginationControls(totalItems) {
    const paginationContainer = document.getElementById('paginationControls');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return; // No need for pagination if only one page

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Prev';
    prevButton.disabled = currentPage === 1;
    prevButton.className = 'pagination-btn';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadAndRender();
        }
    });
    paginationContainer.appendChild(prevButton);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'pagination-btn';
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            loadAndRender();
        });
        paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.className = 'pagination-btn';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadAndRender();
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Modify loadAndRender to reset currentPage to 1 on new data load
async function loadAndRender() {
    const data = await fetchRecords();
    currentPage = 1; // Reset to first page on new data load
    renderTable(data);
}

function updateStatusCounts(data) {
    let activeCount = 0;
    let expiringCount = 0;
    let expiredCount = 0;

    const today = new Date();

    data.forEach(entry => {
        // Check vehicle renewal date status
        const vehicleRenewalDate = new Date(entry.vehicleRenewalDate);
        const vehicleDiffDays = Math.ceil((vehicleRenewalDate - today) / (1000 * 60 * 60 * 24));

        // Check GPS renewal date status
        const gpsRenewalDate = new Date(entry.renewalDate2);
        const gpsDiffDays = Math.ceil((gpsRenewalDate - today) / (1000 * 60 * 60 * 24));

        // Helper function to categorize status for a date difference
        function categorizeStatus(diffDays) {
            if (diffDays > 30) {
                return 'active';
            } else if (diffDays > 0) {
                return 'expiring';
            } else {
                return 'expired';
            }
        }

        // Count vehicle renewal status
        const vehicleStatus = categorizeStatus(vehicleDiffDays);
        if (vehicleStatus === 'active') activeCount++;
        else if (vehicleStatus === 'expiring') expiringCount++;
        else if (vehicleStatus === 'expired') expiredCount++;

        // Count GPS renewal status
        const gpsStatus = categorizeStatus(gpsDiffDays);
        if (gpsStatus === 'active') activeCount++;
        else if (gpsStatus === 'expiring') expiringCount++;
        else if (gpsStatus === 'expired') expiredCount++;

        // Do not count maintenanceRenewalDate status
        /*
        const maintenanceStatus = categorizeStatus(maintenanceDiffDays);
        if (maintenanceStatus === 'active') activeCount++;
        else if (maintenanceStatus === 'expiring') expiringCount++;
        else if (maintenanceStatus === 'expired') expiredCount++;
        */
    });

    // Update the counts in the boxes
    document.getElementById('activeCount').textContent = activeCount;
    document.getElementById('expiringCount').textContent = expiringCount;
    document.getElementById('expiredCount').textContent = expiredCount;

    // Update the count for all rows currently displayed in the table
    document.getElementById('allCount').textContent = data.length;
}


function insertRow(tableBody, entry, rowIndex, visibleIndices = null) {
    const newRow = tableBody.insertRow();
    newRow.setAttribute('data-id', entry._id);

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj)) return '';
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const vehicleStatus = calculateStatus(entry.vehicleRenewalDate);
    const maintenanceStatus = calculateStatus(entry.maintenanceRenewalDate);

    const countCell = newRow.insertCell();
    countCell.textContent = rowIndex;

    const originalValues = {
        vehicleNumber: entry.vehicleNumber,
        policyType: entry.policyType,
        policyNumber: entry.policyNumber,
        vehicleRenewalDate: entry.vehicleRenewalDate,
        vehicleStatusText: vehicleStatus.text,
        maintenanceType: entry.maintenanceType,
        openingKM: entry.openingKM,
        closingKM: entry.closingKM,
        kmDriven: entry.kmDriven,
        maintenanceRenewalDate: entry.maintenanceRenewalDate,
        maintenanceStatusText: maintenanceStatus.text,
        renewalDate2: entry.renewalDate2,
        remarks: entry.remarks || ''
    };

    const fields = [
        { key: 'vehicleNumber', type: 'text' },
        { key: 'policyType', type: 'text' },
        { key: 'policyNumber', type: 'text' },
        { key: 'vehicleRenewalDate', type: 'date' },
        { key: 'vehicleStatusText', type: 'text', readonly: true },
        { key: 'maintenanceType', type: 'text' },
        { key: 'openingKM', type: 'number' },
        { key: 'closingKM', type: 'number' },
        { key: 'kmDriven', type: 'number' },
        { key: 'remarks', type: 'text' },
        { key: 'maintenanceRenewalDate', type: 'date' },
        { key: 'maintenanceStatusText', type: 'text', readonly: true },
        { key: 'gps', type: 'gps' },
        { key: 'renewalDate2', type: 'date' }
    ];

    fields.forEach((field, index) => {
        const cell = newRow.insertCell();

        if (field.key === 'gps') {
            const today = new Date();
            const renewalDate2 = new Date(entry.renewalDate2);
            const diffTime = renewalDate2 - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Globe color logic
            let globeClass = '';
            if (diffDays > 30) {
                globeClass = 'globe-icon globe-green-3d';
            } else if (diffDays > 15) {
                globeClass = 'globe-icon globe-yellow-3d';
            } else if (diffDays > 2) {
                globeClass = 'globe-icon globe-red-3d globe-blink';
            } else {
                globeClass = 'globe-icon globe-red-3d';
            }

            // 3D effect globe HTML (SVG based for better 3D look)
            cell.innerHTML =
              `<span class="${globeClass}" title="Renewal in ${diffDays} day(s)">
                <svg width="28" height="28" viewBox="0 0 28 28" style="vertical-align:middle;">
                  <defs>
                    <radialGradient id="globeGradGreen" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#bfffe1"/>
                      <stop offset="60%" stop-color="#00c853"/>
                      <stop offset="100%" stop-color="#009624"/>
                    </radialGradient>
                    <radialGradient id="globeGradYellow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#fff9c4"/>
                      <stop offset="70%" stop-color="#ffd600"/>
                      <stop offset="100%" stop-color="#bfa100"/>
                    </radialGradient>
                    <radialGradient id="globeGradRed" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#ffd6d6"/>
                      <stop offset="60%" stop-color="#e74c3c"/>
                      <stop offset="100%" stop-color="#900c0c"/>
                    </radialGradient>
                  </defs>
                  <circle cx="14" cy="14" r="12"
                    fill="${
                      globeClass.includes('globe-green-3d') ? 'url(#globeGradGreen)' :
                      globeClass.includes('globe-yellow-3d') ? 'url(#globeGradYellow)' :
                      'url(#globeGradRed)'
                    }"
                    stroke="#888"
                    stroke-width="2"
                  />
                  <ellipse cx="14" cy="16" rx="7" ry="2.2" fill="#fff" opacity="0.11"/>
                  <ellipse cx="14" cy="10" rx="8" ry="2.7" fill="#fff" opacity="0.09"/>
                  <ellipse cx="14" cy="10" rx="3.2" ry="1.1" fill="#fff" opacity="0.18"/>
                </svg>
              </span>
              <span class="renewal-days-text" style="margin-left:6px;font-weight:500;">Renewal in ${diffDays} day(s)</span>`;
            cell.style.textAlign = 'center';
            cell.classList.add('gps-column-shadow');
            return;
        }

        if (field.key === 'renewalDate2') {
            const span = document.createElement('span');
            let displayValue = originalValues.renewalDate2;
            if (displayValue) {
                displayValue = (function formatDate(dateStr) {
                    if (!dateStr) return '';
                    const months = [
                        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ];
                    const dateObj = new Date(dateStr);
                    if (isNaN(dateObj)) return '';
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = months[dateObj.getMonth()];
                    const year = dateObj.getFullYear();
                    return `${day}-${month}-${year}`;
                })(displayValue);
            } else {
                displayValue = '';
            }
            span.textContent = displayValue;
            cell.appendChild(span);

            const input = document.createElement('input');
            input.type = 'date';
            if (originalValues.renewalDate2) {
                const d = new Date(originalValues.renewalDate2);
                if (!isNaN(d)) {
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    input.value = `${yyyy}-${mm}-${dd}`;
                }
            }
            input.style.display = 'none';
            input.classList.add('inline-edit-input');
            cell.appendChild(input);

            cell.style.textAlign = 'center';
            return;
        }

        const span = document.createElement('span');
        let displayValue = originalValues[field.key];
        if (field.key === 'vehicleRenewalDate' || field.key === 'maintenanceRenewalDate') {
            if (field.key === 'maintenanceStatusText') {
                // This block is replaced below
            } else {
                displayValue = formatDate(displayValue);
            }
        }
        if (field.key === 'maintenanceStatusText') {
            // Replace maintenanceStatusText display with time difference string
            displayValue = formatTimeDifferenceFromToday(entry.maintenanceRenewalDate);
        }
        span.textContent = displayValue;
        cell.appendChild(span);

if (!field.readonly) {
    const input = document.createElement('input');
    input.type = field.type === 'gps' ? 'text' : field.type;
    input.value = originalValues[field.key] || '';
    input.style.display = 'none';
    input.classList.add('inline-edit-input');
    // Add name attribute for openingKM, closingKM, kmDriven inputs for event listener selection
    if (field.key === 'openingKM' || field.key === 'closingKM' || field.key === 'kmDriven') {
        input.name = field.key;
    }
    cell.appendChild(input);
}

        if (field.key === 'vehicleStatusText') {
            cell.className = vehicleStatus.className;
            cell.style.textAlign = 'center';
        }
        if (field.key === 'maintenanceStatusText') {
            // Remove the className assignment to avoid active/expiring/expired styling
            // cell.className = maintenanceStatus.className;
            cell.style.textAlign = 'center';
            cell.style.color = 'indigo'; // Add red color to the text
        }

        if ([0, 1, 2, 3, 5, 7].includes(index)) {
            cell.style.textAlign = 'left';
        } else if ([4, 8].includes(index)) {
            cell.style.textAlign = 'center';
        } else if (index === 6) {
            cell.style.textAlign = 'center';
        }
    });

    if (window.location.pathname.endsWith('Project-Vehicle-Management-user.html') || window.location.pathname.endsWith('Project-Vehicle-Management-Feedmill-user.html')) {
        const actionsCell = newRow.insertCell();
        actionsCell.classList.add('actions-cell');
        actionsCell.style.display = 'none';
    } else {
        const actionsCell = newRow.insertCell();
        actionsCell.classList.add('actions-cell');
        actionsCell.innerHTML = '<button class="edit-btn">Edit</button><button class="delete-btn">Delete</button>';

        const editBtn = actionsCell.querySelector('.edit-btn');
        const deleteBtn = actionsCell.querySelector('.delete-btn');

        deleteBtn.addEventListener('click', () => {
            confirmDelete(entry._id, rowIndex);
        });

        editBtn.addEventListener('click', () => {
            if (editBtn.textContent === 'Edit') {
                enterEditMode(newRow, originalValues);
            } else if (editBtn.textContent === 'Save') {
                const actionsCell = newRow.querySelector('.actions-cell');
                const cancelBtn = actionsCell.querySelector('.cancel-btn');
                if (cancelBtn) {
                    cancelBtn.remove();
                }
                saveRow(newRow, entry._id);
            }
        });
    }

    // After creating row/cells
    if (visibleIndices) {
        Array.from(newRow.cells).forEach((cell, idx) => {
            cell.style.display = visibleIndices.includes(idx) ? '' : 'none';
        });
    }
}

// Enter edit mode for a row
function enterEditMode(row, originalValues) {
    const cells = row.cells;
    const keys = [
        'vehicleNumber',
        'policyType',
        'policyNumber',
        'vehicleRenewalDate',
        'vehicleStatusText', // readonly, no input
        'maintenanceType',
        'openingKM',
        'closingKM',
        'kmDriven',
        'remarks',
        'maintenanceRenewalDate',
        'maintenanceStatusText', // readonly, no input
        'gps', // no input
        'renewalDate2'
    ];
    let inputIndex = 0;
    for (let i = 1; i < cells.length - 1; i++) { // skip count and actions cells
        const cell = cells[i];
        const span = cell.querySelector('span');
        const input = cell.querySelector('input');
        if (input) {
            span.style.display = 'none';
            input.style.display = 'inline-block';
            if (input.type === 'date' && originalValues) {
                // Use keys array to get correct key for this cell
                const key = keys[i - 1];
                const dateValue = originalValues[key];
                if (dateValue) {
                    const d = new Date(dateValue);
                    if (isNaN(d)) {
                        input.value = '';
                    } else {
                        const yyyy = d.getFullYear();
                        const mm = String(d.getMonth() + 1).padStart(2, '0');
                        const dd = String(d.getDate()).padStart(2, '0');
                        input.value = `${yyyy}-${mm}-${dd}`;
                    }
                } else {
                    input.value = '';
                }
            }
            else if (input.type !== 'date') {
                // For non-date inputs, set value from originalValues using keys array
                const key = keys[i - 1];
                input.value = originalValues[key] || '';
            }
        }
    }

    // Add event listeners to openingKM and closingKM inputs to update kmDriven dynamically
    const openingKMInput = row.querySelector('input[type="number"][name="openingKM"]');
    const closingKMInput = row.querySelector('input[type="number"][name="closingKM"]');
    const kmDrivenInput = row.querySelector('input[type="number"][name="kmDriven"]');

    if (kmDrivenInput) {
        kmDrivenInput.readOnly = true;
    }

    function updateKmDriven() {
        const openingKM = Number(openingKMInput.value);
        const closingKM = Number(closingKMInput.value);
        if (!isNaN(openingKM) && !isNaN(closingKM) && closingKM >= openingKM) {
            kmDrivenInput.value = closingKM - openingKM;
        } else {
            kmDrivenInput.value = '';
        }
    }

    if (openingKMInput) {
        openingKMInput.addEventListener('input', updateKmDriven);
    }
    if (closingKMInput) {
        closingKMInput.addEventListener('input', updateKmDriven);
    }

    const actionsCell = row.querySelector('.actions-cell');
    const editBtn = actionsCell.querySelector('.edit-btn');

    // Change Edit button to Save (remove cancel button creation)
    editBtn.textContent = 'Save';
}

// Exit edit mode and revert changes
function exitEditMode(row, originalValues) {
    const cells = row.cells;
    for (let i = 1; i < cells.length - 1; i++) {
        const cell = cells[i];
        const span = cell.querySelector('span');
        const input = cell.querySelector('input');
        if (input) {
            input.style.display = 'none';
            span.style.display = 'inline';
            // Revert input value to original
            if (input.type === 'date') {
                span.textContent = formatDate(originalValues[Object.keys(originalValues)[i - 1]]);
            } else {
                span.textContent = originalValues[Object.keys(originalValues)[i - 1]];
            }
        }
    }
    const actionsCell = row.querySelector('.actions-cell');
    const editBtn = actionsCell.querySelector('.edit-btn');
    editBtn.textContent = 'Edit';

    const cancelBtn = actionsCell.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.remove();
    }
}

// Save the edited row data
async function saveRow(row, id) {
    const cells = row.cells;
    const updatedEntry = {};

    // Map keys to input indices (skip count cell at 0 and actions cell at last)
    const keys = [
        'vehicleNumber',
        'policyType',
        'policyNumber',
        'vehicleRenewalDate',
        // vehicleStatusText is readonly, skip
        'maintenanceType',
        'openingKM',
        'closingKM',
        'kmDriven',
        'remarks',
        'maintenanceRenewalDate',
        // maintenanceStatusText is readonly, skip
        'renewalDate2'
    ];

    let inputIndex = 0;
    for (let i = 1; i < cells.length - 1; i++) {
        const cell = cells[i];
        const input = cell.querySelector('input');
        if (!input) continue; // skip readonly fields

        const key = keys[inputIndex];
        inputIndex++;

        if (input.type === 'date') {
            updatedEntry[key] = input.value;
        } else if (input.type === 'number') {
            updatedEntry[key] = Number(input.value);
        } else {
            updatedEntry[key] = input.value.trim();
        }
    }

    // Basic validation including remarks and kmDriven not empty
    if (!updatedEntry.vehicleNumber || !updatedEntry.policyType || !updatedEntry.policyNumber ||
        !updatedEntry.vehicleRenewalDate || !updatedEntry.maintenanceType || isNaN(updatedEntry.kmDriven) ||
        updatedEntry.kmDriven === '' || !updatedEntry.remarks || !updatedEntry.maintenanceRenewalDate || !updatedEntry.renewalDate2) {
        showNotification('Please fill in all required fields correctly, including KM Driven and Remarks.');
        return;
    }

    // Validate that both renewal dates are different
    if (updatedEntry.vehicleRenewalDate === updatedEntry.renewalDate2) {
        showNotification('Vehicle Renewal Date and GPS Renewal Date must be different.');
        return;
    }

    // Check if any of the specified fields have changed compared to original values
    const originalValues = {};
    const keysToCheck = ['vehicleNumber', 'maintenanceType', 'openingKM', 'closingKM', 'kmDriven', 'remarks', 'maintenanceRenewalDate'];
    let hasChanges = false;

    // Extract original values from the row's spans
    let keyIndex = 0;
    for (let i = 1; i < cells.length - 1; i++) {
        const cell = cells[i];
        const span = cell.querySelector('span');
        if (!span) continue;
        const key = keys[keyIndex];
        if (keysToCheck.includes(key)) {
            originalValues[key] = span.textContent.trim();
        }
        keyIndex++;
    }

    // Compare original and updated values for keysToCheck
    for (const key of keysToCheck) {
        let originalVal = originalValues[key];
        let updatedVal = updatedEntry[key];

        // Normalize numbers to string for comparison
        if (typeof updatedVal === 'number') {
            updatedVal = updatedVal.toString();
        }
        if (typeof originalVal === 'number') {
            originalVal = originalVal.toString();
        }

        if (originalVal !== updatedVal) {
            hasChanges = true;
            break;
        }
    }

    if (!hasChanges) {
        showNotification('No changes detected in the specified fields. Save cancelled.');
        exitEditMode(row, originalValues);
        return;
    }

    // Call API to update record
    const result = await updateRecord(id, updatedEntry);
    if (result) {
        // After successful update, reload entire table to reflect all changes including maintenance details
        showNotification('Vehicle details updated.');
        await loadAndRender();
    }
}

// Show notification message
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}

let deleteId = null;

function confirmDelete(id, serialNumber) {
    deleteId = id;
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmDialogDesc = document.getElementById('confirmDialogDesc');
    confirmDialogDesc.textContent = `Please provide the reason for deletion and admin name to proceed for Serial No: ${serialNumber}.`;
    confirmDialog.style.display = 'flex';

    // Reset form inputs and disable delete button
    const deleteForm = document.getElementById('deleteForm');
    deleteForm.reset();
    const confirmYesBtn = document.getElementById('confirmYesBtn');
    confirmYesBtn.disabled = true;
}

function hideConfirmDialog() {
    const confirmDialog = document.getElementById('confirmDialog');
    confirmDialog.style.display = 'none';
    deleteId = null;
}

// Enable or disable delete button based on input validation
const deleteReasonInput = document.getElementById('deleteReason');
const adminNameInput = document.getElementById('adminName');
const confirmYesBtn = document.getElementById('confirmYesBtn');

function validateDeleteForm() {
    if (deleteReasonInput.value.trim() !== '' && adminNameInput.value.trim() !== '') {
        confirmYesBtn.disabled = false;
    } else {
        confirmYesBtn.disabled = true;
    }
}

deleteReasonInput.addEventListener('input', validateDeleteForm);
adminNameInput.addEventListener('input', validateDeleteForm);

document.getElementById('deleteForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!deleteId) return;

    const reason = deleteReasonInput.value.trim();
    const adminName = adminNameInput.value.trim();

    if (reason === '' || adminName === '') {
        alert('Please fill in both the reason for deletion and admin name.');
        return;
    }

    try {
        // Proceed to delete the original record with deleteReason and deletedBy in body
        const deleteResult = await fetch(`${API_BASE_URL}/${deleteId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                deleteReason: reason,
                deletedBy: adminName
            })
        });
        if (!deleteResult.ok) {
            throw new Error('Failed to delete record');
        }
        await loadAndRender();
        showNotification('Entry deleted and stored successfully.');
    } catch (error) {
        alert('Error during deletion: ' + error.message);
    }
    hideConfirmDialog();
});

document.getElementById('confirmNoBtn').addEventListener('click', () => {
    hideConfirmDialog();
});

// Edit entry: populate form and switch to update mode
async function editEntry(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch record');
        const entry = await response.json();

        document.getElementById('vehicleNumber').value = entry.vehicleNumber;
        document.getElementById('policyType').value = entry.policyType;
        document.getElementById('policyNumber').value = entry.policyNumber;
        document.getElementById('renewalDate').value = entry.vehicleRenewalDate;
        document.getElementById('maintenanceType').value = entry.maintenanceType;
        document.getElementById('kmDriven').value = entry.kmDriven;
        document.getElementById('maintenanceRenewalDate').value = entry.maintenanceRenewalDate;
        // Removed gps input field assignment since it was removed from the form
        // document.getElementById('gps').value = entry.gps || '';
        // Convert renewalDate2 to yyyy-mm-dd format for input value
        if (entry.renewalDate2) {
            const d = new Date(entry.renewalDate2);
            if (!isNaN(d)) {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                document.getElementById('renewalDate2').value = `${yyyy}-${mm}-${dd}`;
            } else {
                document.getElementById('renewalDate2').value = '';
            }
        } else {
            document.getElementById('renewalDate2').value = '';
        }

        const form = document.getElementById('combinedForm');
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Update Entry';

        form.onsubmit = async function (event) {
            event.preventDefault();
            await updateEntry(id);
        };

        // Show form if hidden
        if (!form.classList.contains('show')) {
            toggleBtn.click();
        }
    } catch (error) {
        showNotification('Error loading entry for edit: ' + error.message);
    }
}

// Update entry via API
async function updateEntry(id) {
    const updatedEntry = {
        vehicleNumber: document.getElementById('vehicleNumber').value,
        policyType: document.getElementById('policyType').value,
        policyNumber: document.getElementById('policyNumber').value,
        vehicleRenewalDate: document.getElementById('renewalDate').value,
        maintenanceType: document.getElementById('maintenanceType').value,
        openingKM: Number(document.getElementById('openingKM').value),
        closingKM: Number(document.getElementById('closingKM').value),
        kmDriven: Number(document.getElementById('kmDriven').value),
        maintenanceRenewalDate: document.getElementById('maintenanceRenewalDate').value,
        // Removed gps input field since it was removed from the form
        // gps: document.getElementById('gps').value,
        renewalDate2: document.getElementById('renewalDate2').value
    };

    // Fetch original entry to compare changes
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch original record');
        const originalEntry = await response.json();

        // Check if any of the specified fields have changed
        const keysToCheck = ['vehicleNumber', 'maintenanceType', 'openingKM', 'closingKM', 'kmDriven', 'remarks', 'maintenanceRenewalDate'];
        let hasChanges = false;

        for (const key of keysToCheck) {
            let originalVal = originalEntry[key];
            let updatedVal = updatedEntry[key];

            // Normalize numbers to string for comparison
            if (typeof updatedVal === 'number') {
                updatedVal = updatedVal.toString();
            }
            if (typeof originalVal === 'number') {
                originalVal = originalVal.toString();
            }

            if (originalVal !== updatedVal) {
                hasChanges = true;
                break;
            }
        }

        if (!hasChanges) {
            showNotification('No changes detected in the specified fields. Save cancelled.');
            return;
        }
    } catch (error) {
        showNotification('Error checking changes: ' + error.message);
        return;
    }


    const result = await updateRecord(id, updatedEntry);
    if (result) {
        await loadAndRender();
        showNotification('Entry updated successfully.');
        resetForm();
    }
}

// Add new entry via API
async function addRow(tableId, inputIds) {
    // Client-side validation for required fields
    const vehicleNumber = document.getElementById('vehicleNumber').value.trim();
    const policyType = document.getElementById('policyType').value.trim();
    const policyNumber = document.getElementById('policyNumber').value.trim();
    const vehicleRenewalDate = document.getElementById('renewalDate').value.trim();
    const maintenanceType = document.getElementById('maintenanceType').value.trim();
    const openingKM = document.getElementById('openingKM').value.trim();
    const closingKM = document.getElementById('closingKM').value.trim();
    const kmDriven = document.getElementById('kmDriven').value.trim();
    const maintenanceRenewalDate = document.getElementById('maintenanceRenewalDate').value.trim();
    const renewalDate2 = document.getElementById('renewalDate2').value.trim();
    const remarks = document.getElementById('remarks').value.trim();

    if (!vehicleNumber || !policyType || !policyNumber || !vehicleRenewalDate || !maintenanceType || !openingKM || !closingKM || !kmDriven || !maintenanceRenewalDate || !renewalDate2) {
        showNotification('Please fill in all required fields before adding a record.');
        return;
    }

    const newEntry = {
        vehicleNumber,
        policyType,
        policyNumber,
        vehicleRenewalDate,
        maintenanceType,
        openingKM: Number(openingKM),
        closingKM: Number(closingKM),
        kmDriven: Number(kmDriven),
        maintenanceRenewalDate,
        renewalDate2,
        remarks
    };

    const result = await addRecord(newEntry);
    if (result) {
        await loadAndRender();
        showNotification('Entry added successfully.');
        resetForm();
    }
}

// Reset form to add mode and clear inputs
function resetForm() {
    const form = document.getElementById('combinedForm');
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Add Entry';
    form.onsubmit = function (event) {
        event.preventDefault();
        addRow('combinedTable', [
            'vehicleNumber',
            'policyType',
            'policyNumber',
            'renewalDate',
            'maintenanceType',
            'openingKM',
            'closingKM',
            'kmDriven',
            'maintenanceRenewalDate',
            'renewalDate2',
            'remarks'
        ]);
    };
    [
        'vehicleNumber',
        'policyType',
        'policyNumber',
        'renewalDate',
        'maintenanceType',
        'openingKM',
        'closingKM',
        'kmDriven',
        'maintenanceRenewalDate',
        'renewalDate2',
        'remarks'
    ].forEach(id => {
        document.getElementById(id).value = '';
    });
}

// Load data from API and render table
async function loadAndRender() {
    const data = await fetchRecords();
    renderTable(data);
}

// Filters and search inputs
const searchMonthInput = document.getElementById('searchMonthInput');
const searchStatusInput = document.getElementById('searchStatusInput');
const searchVehicleNumberInput = document.getElementById('searchVehicleNumberInput');
const searchVehicleNumberInput2 = document.getElementById('searchVehicleNumberInput2');

function combinedFilter() {
    const monthText = searchMonthInput.value.trim().toLowerCase();
    const statusText = searchStatusInput.value.trim().toLowerCase();
    const vehicleNumberText = searchVehicleNumberInput.value.trim().toLowerCase();
    const vehicleNumberText2 = searchVehicleNumberInput2.value.trim().toLowerCase();

    // Get visible column indices and names
    const visibleIndices = getVisibleColumnIndices();
    const headers = Array.from(document.querySelectorAll('#combinedTable thead tr:nth-child(2) th')).map(th => th.textContent.trim());
    const visibleHeaders = visibleIndices.map(idx => headers[idx]);

    const data = window.currentData || [];
    const filteredData = data.filter(entry => {
        // Only match in visible columns
        let match = true;
        // For each search input, check if its corresponding column is visible
        if (monthText && visibleHeaders.includes('Renewal Date(Vehicles)')) {
            const vehicleMonth = getMonthName(entry.vehicleRenewalDate);
            match = match && vehicleMonth.includes(monthText);
        }
        if (statusText && visibleHeaders.includes('Policy Type')) {
            const policyType = entry.policyType ? entry.policyType.toLowerCase() : '';
            match = match && policyType.includes(statusText);
        }
        if (vehicleNumberText && visibleHeaders.includes('Vehicle Number')) {
            match = match && entry.vehicleNumber.toLowerCase().includes(vehicleNumberText);
        }
        if (vehicleNumberText2 && visibleHeaders.includes('Vehicle Number')) {
            match = match && entry.vehicleNumber.toLowerCase().includes(vehicleNumberText2);
        }
        return match;
    });
    renderTable(filteredData);
}

searchMonthInput.addEventListener('input', combinedFilter);
searchStatusInput.addEventListener('input', combinedFilter);
searchVehicleNumberInput.addEventListener('input', combinedFilter);
searchVehicleNumberInput2.addEventListener('input', combinedFilter);

function filterTableByMonthStatusVehicle(monthText, statusText, vehicleNumberText, vehicleNumberText2) {
    const data = window.currentData || [];
    const filteredData = data.filter(entry => {
        const vehicleMonth = getMonthName(entry.vehicleRenewalDate);
        const policyType = entry.policyType ? entry.policyType.toLowerCase() : '';
        const monthMatch = !monthText || vehicleMonth.includes(monthText);
        const statusMatch = !statusText || policyType.includes(statusText);
        const vehicleNumberMatch = !vehicleNumberText || entry.vehicleNumber.toLowerCase().includes(vehicleNumberText);
        const vehicleNumberMatch2 = !vehicleNumberText2 || entry.vehicleNumber.toLowerCase().includes(vehicleNumberText2);
        return monthMatch && statusMatch && vehicleNumberMatch && vehicleNumberMatch2;
    });
    renderTable(filteredData);
}

// Helper function to get month name from date string
function getMonthName(dateStr) {
    if (!dateStr) return '';
    const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj)) return '';
    return months[dateObj.getMonth()];
}

// Function to filter table data by status
function filterTableByStatus(statusType) {
    const data = window.currentData || [];
    const filteredData = data.filter(entry => {
        const vehicleStatus = calculateStatus(entry.vehicleRenewalDate).text.toLowerCase();
        const gpsStatus = calculateStatus(entry.renewalDate2).text.toLowerCase();
        // Exclude maintenanceStatus from filtering
        // const maintenanceStatus = calculateStatus(entry.maintenanceRenewalDate).text.toLowerCase();

        if (statusType === 'active') {
            return vehicleStatus === 'active' || gpsStatus === 'active';
        } else if (statusType === 'expiring') {
            return vehicleStatus.includes('days left') || vehicleStatus === 'expiring soon' ||
                gpsStatus.includes('days left') || gpsStatus === 'expiring soon';
        } else if (statusType === 'expired') {
            return vehicleStatus === 'expired' || gpsStatus === 'expired';
        }
        return false;
    });
    renderTable(filteredData);
}

// Function to initialize column resizing on a table by id
function initColumnResizing(tableId) {
    const table = document.getElementById(tableId);
    const thElements = table.querySelectorAll('thead th');

    thElements.forEach((th, index) => {
        // Skip last th (Actions column) from resizing
        if (th.textContent.trim() === 'Actions') return;

        // Create resize handle element
        const resizeHandle = document.createElement('div');
        resizeHandle.classList.add('resize-handle');
        th.appendChild(resizeHandle);

        let startX, startWidth;

        // Mouse down event on resize handle
        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.pageX;
            startWidth = th.offsetWidth;

            // Mouse move handler
            function onMouseMove(e) {
                const newWidth = startWidth + (e.pageX - startX);
                if (newWidth > 40) { // minimum width
                    th.style.width = newWidth + 'px';
                    // Set width for corresponding td cells
                    setColumnWidth(table, index, newWidth);
                }
            }

            // Mouse up handler
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
}

// Function to set width of all cells in a column
function setColumnWidth(table, colIndex, width) {
    // Set width for all rows' cells in the column
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.children;
        if (cells.length > colIndex) {
            cells[colIndex].style.width = width + 'px';
        }
    });
}

window.onload = async function () {
    await loadAndRender();

    // Set form submit event for adding new entries
    const form = document.getElementById('combinedForm');
    form.onsubmit = function (event) {
        event.preventDefault();
        addRow('combinedTable', [
            'vehicleNumber',
            'policyType',
            'policyNumber',
            'renewalDate',
            'maintenanceType',
            'openingKM',
            'closingKM',
            'kmDriven',
            'maintenanceRenewalDate',
            'renewalDate2',
            'remarks'
        ]);
    };

    // Make kmDriven input readonly and add event listeners to update kmDriven automatically
    const openingKMInput = document.getElementById('openingKM');
    const closingKMInput = document.getElementById('closingKM');
    const kmDrivenInput = document.getElementById('kmDriven');

    if (kmDrivenInput) {
        kmDrivenInput.readOnly = true;
    }

    function updateKmDriven() {
        const openingKM = Number(openingKMInput.value);
        const closingKM = Number(closingKMInput.value);
        if (!isNaN(openingKM) && !isNaN(closingKM) && closingKM >= openingKM) {
            kmDrivenInput.value = closingKM - openingKM;
        } else {
            kmDrivenInput.value = '';
        }
    }

    if (openingKMInput) {
        openingKMInput.addEventListener('input', updateKmDriven);
    }
    if (closingKMInput) {
        closingKMInput.addEventListener('input', updateKmDriven);
    }

    // Initialize column resizing for table headers
    initColumnResizing('combinedTable');

    // Add click event listener for status count boxes to filter data
    const activeCountBox = document.getElementById('activeCountBox');
    const expiringCountBox = document.getElementById('expiringCountBox');
    const expiredCountBox = document.getElementById('expiredCountBox');
    const allCountBox = document.getElementById('allCountBox');

    let activeFilter = null; // can be 'active', 'expiring', 'expired', 'all' or null

    function clearFilterHighlights() {
        activeCountBox.style.backgroundColor = '';
        expiringCountBox.style.backgroundColor = '';
        expiredCountBox.style.backgroundColor = '';
        allCountBox.style.backgroundColor = '';
    }

    function applyFilter(status) {
        if (status === 'all') {
            loadAndRender();
        } else {
            filterTableByStatus(status);
        }
        clearFilterHighlights();
        if (status === 'active') activeCountBox.style.backgroundColor = '#d1e7dd';
        else if (status === 'expiring') expiringCountBox.style.backgroundColor = '#fff3cd';
        else if (status === 'expired') expiredCountBox.style.backgroundColor = '#f8d7da';
        else if (status === 'all') allCountBox.style.backgroundColor = '#cfe2ff';
    }

    function toggleFilter(status) {
        if (activeFilter === status) {
            activeFilter = null;
            loadAndRender();
            clearFilterHighlights();
        } else {
            activeFilter = status;
            applyFilter(status);
        }
    }

    activeCountBox.addEventListener('click', () => {
        toggleFilter('active');
    });

    expiringCountBox.addEventListener('click', () => {
        toggleFilter('expiring');
    });

    expiredCountBox.addEventListener('click', () => {
        toggleFilter('expired');
    });

    allCountBox.addEventListener('click', () => {
        toggleFilter('all');
    });

    // Search inputs combined filter
    const searchMonthInput = document.getElementById('searchMonthInput');
    const searchStatusInput = document.getElementById('searchStatusInput');
    const searchVehicleNumberInput = document.getElementById('searchVehicleNumberInput');

    function combinedFilter() {
        const monthText = searchMonthInput.value.trim().toLowerCase();
        const statusText = searchStatusInput.value.trim().toLowerCase();
        const vehicleNumberText = searchVehicleNumberInput.value.trim().toLowerCase();
        filterTableByMonthStatusVehicle(monthText, statusText, vehicleNumberText);
    }

    searchMonthInput.addEventListener('input', combinedFilter);
    searchStatusInput.addEventListener('input', combinedFilter);
    searchVehicleNumberInput.addEventListener('input', combinedFilter);

    // Add reload button event listener
    const reloadBtn = document.getElementById('reloadBtn');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            location.reload();
        });
    }

    // Add GPS Renewal Date search input filtering
    const searchGpsRenewalDateInput = document.getElementById('searchGpsRenewalDateInput');
    const combinedTable = document.getElementById('combinedTable');

    if (searchGpsRenewalDateInput && combinedTable) {
        searchGpsRenewalDateInput.addEventListener('input', () => {
            const filterValue = searchGpsRenewalDateInput.value.toLowerCase().trim();
            const visibleIndices = getVisibleColumnIndices();
            const headers = Array.from(document.querySelectorAll('#combinedTable thead tr:nth-child(2) th')).map(th => th.textContent.trim());
            const gpsColIdx = headers.findIndex(h => h.toLowerCase().includes('renewal date(gps)'));
            // Only filter if GPS column is visible
            if (!visibleIndices.includes(gpsColIdx)) {
                renderTable([]); // Hide all rows if GPS column not visible
                return;
            }
            const data = window.currentData || [];
            const monthOrder = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
            const filteredData = data.filter(entry => {
                let cellText = '';
                if (entry.renewalDate2) {
                    cellText = entry.renewalDate2.toLowerCase();
                }
                let matched = false;
                if (filterValue === '') {
                    matched = true;
                } else {
                    let monthPart = '';
                    let dateParts = cellText.split('-');
                    if (dateParts.length === 3) {
                        monthPart = dateParts[1].toLowerCase();
                        if (/^\d+$/.test(monthPart)) {
                          let monthIdx = parseInt(monthPart, 10) - 1;
                          if (monthIdx >= 0 && monthIdx < 12) {
                            monthPart = monthOrder[monthIdx];
                          }
                        }
                    } else {
                        for (let m of monthOrder) {
                            if (cellText.includes(m)) {
                                monthPart = m;
                                break;
                            }
                        }
                    }
                    if (monthPart.startsWith(filterValue)) {
                        matched = true;
                    } else if (cellText.includes(filterValue)) {
                        matched = true;
                    }
                }
                return matched;
            });
            renderTable(filteredData);
        });
    }

    // Column filter modal and button logic
    const columnFilterBtn = document.getElementById('columnFilterBtn');
    const columnFilterModal = document.getElementById('columnFilterModal');
    const columnFilterForm = document.getElementById('columnFilterForm');
    const saveColumnFilterBtn = document.getElementById('saveColumnFilterBtn');
    const cancelColumnFilterBtn = document.getElementById('cancelColumnFilterBtn');
    const combinedTableElement = document.getElementById('combinedTable');

    // Function to get all column headers from the second row of thead (index 1)
    function getColumnHeaders() {
        const headers = [];
        const headerCells = combinedTableElement.querySelectorAll('thead tr:nth-child(2) th');
        headerCells.forEach((th, index) => {
            headers.push({
                name: th.textContent.trim(),
                index: index
            });
        });
        return headers;
    }

    // Function to populate the column filter form with checkboxes
    function populateColumnFilterForm() {
        columnFilterForm.innerHTML = '';
        const headers = getColumnHeaders();
        const savedVisibility = JSON.parse(localStorage.getItem('columnVisibility')) || {};

        headers.forEach(header => {
            const checkboxId = 'colFilterCheckbox_' + header.index;
            const isChecked = savedVisibility.hasOwnProperty(header.index) ? savedVisibility[header.index] : true;

            const label = document.createElement('label');
            label.setAttribute('for', checkboxId);
            label.style.display = 'block';
            label.style.marginBottom = '6px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = checkboxId;
            checkbox.dataset.colIndex = header.index;
            checkbox.checked = isChecked;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + header.name));
            columnFilterForm.appendChild(label);
        });
    }

    // Function to apply column visibility based on saved settings or default (all visible)
    function applyColumnVisibility() {
        const savedVisibility = JSON.parse(localStorage.getItem('columnVisibility')) || {};
        const headers = getColumnHeaders();

        headers.forEach(header => {
            const colIndex = header.index;
            const visible = savedVisibility.hasOwnProperty(colIndex) ? savedVisibility[colIndex] : true;

            // Show/hide thead th
            const th = combinedTableElement.querySelector('thead tr:nth-child(2) th:nth-child(' + (colIndex + 1) + ')');
            if (th) {
                th.style.display = visible ? '' : 'none';
            }

            // Show/hide tbody td
            const rows = combinedTableElement.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const td = row.cells[colIndex];
                if (td) {
                    td.style.display = visible ? '' : 'none';
                }
            });
        });
    }

    // Show modal on button click
    columnFilterBtn.addEventListener('click', () => {
        populateColumnFilterForm();
        columnFilterModal.style.display = 'flex';
        columnFilterModal.setAttribute('aria-hidden', 'false');
    });

    // Save button click handler
    saveColumnFilterBtn.addEventListener('click', () => {
        const checkboxes = columnFilterForm.querySelectorAll('input[type="checkbox"]');
        const visibility = {};
        checkboxes.forEach(checkbox => {
            const colIndex = parseInt(checkbox.dataset.colIndex, 10);
            visibility[colIndex] = checkbox.checked;
        });
        localStorage.setItem('columnVisibility', JSON.stringify(visibility));
        applyColumnVisibility();
        columnFilterModal.style.display = 'none';
        columnFilterModal.setAttribute('aria-hidden', 'true');
    });

    // Cancel button click handler
    cancelColumnFilterBtn.addEventListener('click', () => {
        columnFilterModal.style.display = 'none';
        columnFilterModal.setAttribute('aria-hidden', 'true');
    });

    // Apply saved column visibility on page load
    applyColumnVisibility();
};

// Add CSS for globe styles and blinking effect (inject once)
(function addGlobe3DStyles() {
    if (document.getElementById('globe-3d-style')) return;
    const style = document.createElement('style');
    style.id = 'globe-3d-style';
    style.textContent = `
    .globe-icon {
        display: inline-block;
        vertical-align: middle;
        margin-right: 2px;
        /* 3D shadow and highlight */
        box-shadow: 0 2px 6px 0 #8888, 0 6px 16px #4442, 0 0px 0px #fff inset;
        border-radius: 50%;
        transition: box-shadow 0.2s;
        position: relative;
        width: 28px;
        height: 28px;
    }
    .globe-green-3d {
        /* SVG handles color */
    }
    .globe-yellow-3d {
        /* SVG handles color */
    }
    .globe-red-3d {
        /* SVG handles color */
    }
    .globe-blink {
        animation: globeBlinkRapid 0.45s linear infinite;
    }
    @keyframes globeBlinkRapid {
        0%, 55% { opacity: 1; }
        60%, 75% { opacity: 0.4; filter: blur(1px); }
        80%, 100% { opacity: 1; }
    }
    `;
    document.head.appendChild(style);
})();
