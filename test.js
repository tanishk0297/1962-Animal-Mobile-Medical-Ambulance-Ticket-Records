let currentPageIndex = 0;
const itemsPerPage = 7; // Display 7 items per page
let attendanceRecords = [];

function displayAttendance(records) {
    const attendanceTable = document.getElementById('attendance-table');
    attendanceTable.innerHTML = ''; // Clear existing content

    // Create table header
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th>Date</th>
            <th>Doctor</th>
            <th>Asst</th>
            <th>Driver</th>
        </tr>
    `;
    attendanceTable.appendChild(tableHeader);

    // Create table body
    const tableBody = document.createElement('tbody');

    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td style="color: ${getColor(record.doctor)}">${record.doctor}</td>
            <td style="color: ${getColor(record.assistant)}">${record.assistant}</td>
            <td style="color: ${getColor(record.driver)}">${record.driver}</td>
        `;
        tableBody.appendChild(row);
    });

    attendanceTable.appendChild(tableBody);

    // Update page navigation
    updatePageNavigation();

    // Add CSS class for mobile view
    adjustTableForMobile();
}

function getColor(status) {
    switch(status) {
        case 'P':
            return 'green';
        case 'A':
            return 'red';
        case 'CL':
            return 'gold';
        default:
            return 'black'; // Default color
    }
}

function updatePageNavigation() {
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');

    prevButton.disabled = currentPageIndex === 0;
    nextButton.disabled = (currentPageIndex + 1) * itemsPerPage >= attendanceRecords.length;
}

function nextPage() {
    currentPageIndex++;
    const startIndex = currentPageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const records = attendanceRecords.slice(startIndex, endIndex);
    if (records.length > 0) {
        displayAttendance(records);
    }
    updatePageNavigation();
}

function prevPage() {
    currentPageIndex--;
    const startIndex = currentPageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const records = attendanceRecords.slice(startIndex, endIndex);
    if (records.length > 0) {
        displayAttendance(records);
    }
    updatePageNavigation();
}

async function fetchAttendance(selectedCarNumber) {
    try {
        const records = await base('Attendance').select({
            maxRecords: 10000, // Adjust as needed
            sort: [{ field: "Uid", direction: "desc" }],
            filterByFormula: `{Car Number} = '${selectedCarNumber}'` // Filter by the selected car number
        }).firstPage();

        attendanceRecords = records.map(record => ({
            date: new Date(record.get('Date')).toLocaleDateString('en-US', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            }),
            doctor: record.get('Doctor') === 1 ? 'P' : record.get('Doctor') === 0 ? 'A' : 'CL',
            assistant: record.get('Assistant') === 1 ? 'P' : record.get('Assistant') === 0 ? 'A' : 'CL',
            driver: record.get('Driver') === 1 ? 'P' : record.get('Driver') === 0 ? 'A' : 'CL'
        }));

        updatePageNavigation();

        const startIndex = currentPageIndex * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const initialRecords = attendanceRecords.slice(startIndex, endIndex);
        if (initialRecords.length > 0) {
            displayAttendance(initialRecords);
        } else {
            displayNoRecordsBanner();
        }

        console.log('Attendance records fetched successfully!');
    } catch (err) {
        console.error('Error fetching attendance records:', err);
        displayNoRecordsBanner(); // Display the no records banner in case of an error
    }
}

function displayNoRecordsBanner() {
    // Implement this function if needed
    console.log('No records found.');
}

document.getElementById('prev-btn').addEventListener('click', prevPage);
document.getElementById('next-btn').addEventListener('click', nextPage);


function adjustTableForMobile() {
    const attendanceTable = document.getElementById('attendance-table');
    const headers = attendanceTable.querySelectorAll('th');
    const cells = attendanceTable.querySelectorAll('td');

    if (window.innerWidth <= 768) { // Adjust width for screens smaller than or equal to 768px
        attendanceTable.classList.add('mobile-view');

        headers.forEach(header => {
            header.classList.add('mobile-view');
        });

        cells.forEach(cell => {
            cell.classList.add('mobile-view');
        });
    } else {
        attendanceTable.classList.remove('mobile-view');

        headers.forEach(header => {
            header.classList.remove('mobile-view');
        });

        cells.forEach(cell => {
            cell.classList.remove('mobile-view');
        });
    }
}

// Call adjustTableForMobile() function whenever the window is resized
window.addEventListener('resize', adjustTableForMobile);
