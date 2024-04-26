const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('appiv05sV7faHOuK6');

const vehicleDetails = {
    "1": { number: "MP-02-ZA-0104", location: "केसली" },
    "2": { number: "MP-02-ZA-0156", location: "मालथौन" },
    "3": { number: "MP-02-ZA-0142", location: "सागर 1" },
    "4": { number: "MP-02-ZA-0125", location: "रहली" },
    "5": { number: "MP-02-ZA-0140", location: "देवरी" },
    "6": { number: "MP-02-ZA-0126", location: "जैसीनगर" },
    "7": { number: "MP-02-ZA-0151", location: "खुरई" },
    "8": { number: "MP-02-ZA-0146", location: "वण्‍डा" },
    "9": { number: "MP-02-ZA-0186", location: "शाहगढ" },
    "10": { number: "MP-02-ZA-0139", location: "सागर 2" },
    "11": { number: "MP-02-ZA-0199", location: "सागर HQ" },
    "12": { number: "MP-02-ZA-0192", location: "बीना" },
    "13": { number: "MP-02-ZA-0159", location: "राहतगढ" }
};

// Function to get the current date in the format YYYY-MM-DD
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function fetchAttendance(selectedDate) {
    try {
        const records = await base('Attendance').select({
            maxRecords: 10000, // Adjust as needed
            sort: [{ field: "Uid", direction: "desc" }],
            filterByFormula: `DATETIME_FORMAT({Date}, 'YYYY-MM-DD') = '${selectedDate}'` // Filter by selected date
        }).firstPage();

        return records;
    } catch (err) {
        console.error('Error fetching attendance records:', err);
        return []; // Return empty array in case of error
    }
}

async function fetchCollection(selectedDate) {
    try {
        const records = await base('Collection').select({
            maxRecords: 10000, // Adjust as needed
            sort: [{ field: "Uid", direction: "desc" }],
            filterByFormula: `DATETIME_FORMAT({Date}, 'YYYY-MM-DD') = '${selectedDate}'` // Filter by selected date
        }).firstPage();

        return records;
    } catch (err) {
        console.error('Error fetching collection records:', err);
        return []; // Return empty array in case of error
    }
}

async function fetchTicketDetails(selectedDate) {
    try {
        const records = await base('Ticket Detail').select({
            maxRecords: 10000, // Adjust as needed
            sort: [{ field: "Uid", direction: "desc" }],
            filterByFormula: `DATETIME_FORMAT({Date}, 'YYYY-MM-DD') = '${selectedDate}'` // Filter by selected date
        }).firstPage();

        return records;
    } catch (err) {
        console.error('Error fetching ticket detail records:', err);
        return []; // Return empty array in case of error
    }
}

// Function to display ticket detail records in the table
function displayTicketDetails(records) {
    const ticketDetailBody = document.getElementById('ticket-detail-body');
    ticketDetailBody.innerHTML = ''; // Clear existing content

    if (records.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6">No ticket detail records found for the selected date</td>`;
        ticketDetailBody.appendChild(row);
    } else {
        records.forEach(record => {
            const row = document.createElement('tr');
            const carNumber = record.get('Car Number');
            const carDetails = vehicleDetails[carNumber] || { number: 'N/A', location: 'N/A' };
            row.innerHTML = `
                <td>${carDetails.location}</td>
                <td>${record.get('New Ticket')}</td>
                <td>${record.get('Prev Days Pending Ticket')}</td>
                <td>${record.get('Pending Ticket')}</td>
                <td>${record.get('Attended Ticket')}</td>
                <td>${record.get('Cancelled Ticket')}</td>
            `;
            ticketDetailBody.appendChild(row);
        });
    }
}

// Function to display attendance records in the table
function displayAttendance(records) {
    const attendanceBody = document.getElementById('attendance-body');
    attendanceBody.innerHTML = ''; // Clear existing content

    if (records.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4">No records found for the selected date</td>`;
        attendanceBody.appendChild(row);
    } else {
        records.forEach(record => {
            const row = document.createElement('tr');
            const carNumber = record.get('Car Number');
            const carDetails = vehicleDetails[carNumber] || { number: 'N/A', location: 'N/A' };
            row.innerHTML = `
                <td>${carDetails.location}</td>
                <td style="color: ${getColor(record.get('Doctor'))}">${getAttendanceStatus(record.get('Doctor'))}</td>
                <td style="color: ${getColor(record.get('Assistant'))}">${getAttendanceStatus(record.get('Assistant'))}</td>
                <td style="color: ${getColor(record.get('Driver'))}">${getAttendanceStatus(record.get('Driver'))}</td>
            `;
            attendanceBody.appendChild(row);
        });
    }
}

// Function to get color based on attendance status
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

// Function to get attendance status label
function getAttendanceStatus(status) {
    switch(status) {
        case 1:
            return 'P';
        case 0:
            return 'A';
        case 9:
            return 'CL';
        default:
            return 'N/A';
    }
}

// Function to set the default date on window load
window.addEventListener('load', function() {
    const currentDate = getCurrentDate();
    document.getElementById('report-date').value = currentDate;
});

// Add event listener to the date form
document.getElementById('date-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission
    const selectedDate = document.getElementById('report-date').value;
    const attendanceRecords = await fetchAttendance(selectedDate); // Fetch attendance records
    const collectionRecords = await fetchCollection(selectedDate); // Fetch collection records
    const ticketRecords = await fetchTicketDetails(selectedDate); // Fetch ticket detail records
    displayAttendance(attendanceRecords); // Display attendance records in the table
    displayCollection(collectionRecords); // Display collection records in the table
    displayTicketDetails(ticketRecords); // Display ticket detail records in the table
});

// Function to display collection records in the table
function displayCollection(records) {
    const collectionBody = document.getElementById('collection-body');
    collectionBody.innerHTML = ''; // Clear existing content

    if (records.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7">No collection records found for the selected date</td>`;
        collectionBody.appendChild(row);
    } else {
        records.forEach(record => {
            const row = document.createElement('tr');
            const carNumber = record.get('Car Number');
            const carDetails = vehicleDetails[carNumber] || { number: 'N/A', location: 'N/A' };
            row.innerHTML = `
                <td>${carDetails.location}</td>
                <td>${record.get('General Animals')}</td>
                <td>${record.get('Dogs')}</td>
                <td>${record.get('Other Animals')}</td>
                <td>${record.get('Collected')}</td>
                <td>${record.get('ToBeDeposited')}</td>
            `;
            collectionBody.appendChild(row);
        });
    }
}
