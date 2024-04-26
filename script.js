const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('appiv05sV7faHOuK6');

// Fetch latest ticket record and populate ticket summary
async function fetchLatestTicketRecord() {
    try {
        const records = await base('Ticket Detail').select({
            maxRecords: 1,
            sort: [{ field: "Uid", direction: "desc" }]
        }).firstPage();

        const ticketSummary = document.getElementById('ticket-summary');
        ticketSummary.innerHTML = ''; // Clear existing content

        if (records.length > 0) {
            const latestRecord = records[0];

            // Get the date of the latest record
            const dateString = new Date(latestRecord.get('Date')).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            // Create list items for each summary item
            const dateItem = createListItem('Date', dateString);
            const prevPendingTickets = createListItem('Prev Pending Tickets', latestRecord.get('Prev Days Pending Ticket'));
            const newTicket = createListItem('New Ticket', latestRecord.get('New Ticket'));
            const attendedTickets = createListItem('Attended Tickets', latestRecord.get('Attended Ticket'));
            const cancelledTickets = createListItem('Cancelled Tickets', latestRecord.get('Cancelled Ticket'));
            const pendingTickets = createListItem('Pending Tickets', latestRecord.get('Pending Ticket'));

            // Append list items to the ticket summary
            ticketSummary.appendChild(dateItem);
            ticketSummary.appendChild(prevPendingTickets);
            ticketSummary.appendChild(newTicket);
            ticketSummary.appendChild(attendedTickets);
            ticketSummary.appendChild(cancelledTickets);
            ticketSummary.appendChild(pendingTickets);
        } else {
            // Display 0 for each summary item if no records are found
            const items = ['Date', 'Prev Pending Tickets', 'New Ticket', 'Attended Tickets', 'Cancelled Tickets', 'Pending Tickets'];
            items.forEach(item => {
                const listItem = createListItem(item, 0);
                ticketSummary.appendChild(listItem);
            });
        }
    } catch (err) {
        console.error('Error fetching latest ticket record:', err);
    }
}

// Fetch latest collection record and populate collection summary
async function fetchLatestCollectionRecord() {
    try {
        const records = await base('Collection').select({
            maxRecords: 1,
            sort: [{ field: "Uid", direction: "desc" }]
        }).firstPage();

        const collectionSummary = document.getElementById('collection-summary');
        collectionSummary.innerHTML = ''; // Clear existing content

        if (records.length > 0) {
            const latestCollectionRecord = records[0];

            // Get the date of the latest record
            const dateString = new Date(latestCollectionRecord.get('Date')).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            // Create list items for each summary item
            const dateItem = createListItem('Date', dateString);
            const generalAnimals = createListItem('General Animals', latestCollectionRecord.get('General Animals'));
            const dogs = createListItem('Dogs', latestCollectionRecord.get('Dogs'));
            const otherAnimals = createListItem('Other Animals', latestCollectionRecord.get('Other Animals'));
            const collectedAmount = createListItem('Collected Amount', latestCollectionRecord.get('Collected'));
            const toBeDeposited = createListItem('To Be Deposited', latestCollectionRecord.get('ToBeDeposited'));

            // Append list items to the collection summary
            collectionSummary.appendChild(dateItem);
            collectionSummary.appendChild(generalAnimals);
            collectionSummary.appendChild(dogs);
            collectionSummary.appendChild(otherAnimals);
            collectionSummary.appendChild(collectedAmount);
            collectionSummary.appendChild(toBeDeposited);
        } else {
            // Display 0 for each summary item if no records are found
            const items = ['Date', 'General Animals', 'Dogs', 'Other Animals', 'Collected Amount', 'To Be Deposited'];
            items.forEach(item => {
                const listItem = createListItem(item, 0);
                collectionSummary.appendChild(listItem);
            });
        }
    } catch (err) {
        console.error('Error fetching latest collection record:', err);
    }
}

// Function to create a list item with the specified label and value
function createListItem(label, value) {
    const listItem = document.createElement('li');
    listItem.textContent = `${label}: ${value}`;
    return listItem;
}

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

async function fetchAttendance() {
    try {
        const records = await base('Attendance').select({
            maxRecords: 10000, // Adjust as needed
            sort: [{ field: "Uid", direction: "desc" }]
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

// Call the functions to fetch and populate records when the page loads
window.onload = async function() {
    // Fetch records concurrently
    await Promise.all([fetchLatestTicketRecord(), fetchLatestCollectionRecord(), fetchAttendance()]);
};

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
