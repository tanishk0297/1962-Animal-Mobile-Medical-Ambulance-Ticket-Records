const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('appym1xh8nuBogY9r');

let currentPageIndex = 0;
const itemsPerPage = 7; // Display 7 items per page
let attendanceRecords = [];

function displayAttendance(records) {
    const attendanceBody = document.getElementById('attendance-body');
    attendanceBody.innerHTML = ''; // Clear existing content

    if (records.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="4">N/A</td>
        `;
        attendanceBody.appendChild(row);
    } else {
        records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td style="color: ${getColor(record.doctor)}">${record.doctor}</td>
                <td style="color: ${getColor(record.assistant)}">${record.assistant}</td>
                <td style="color: ${getColor(record.driver)}">${record.driver}</td>
            `;
            attendanceBody.appendChild(row);
        });
    }
}

function getColor(status) {
    switch(status) {
        case 'P':
            return 'green';
        case 'A':
            return 'red';
        case 'CL':
            return 'gold';
        case 'WO':
            return 'grey';
        case 'LH':
            return '#AD88C6';
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
        const selectedCarNumber = document.getElementById('car-number-selector').value;

        const records = await base('Attendance').select({
            maxRecords: 10000, // Adjust as needed
            sort: [{ field: "Uid", direction: "desc" }],
            filterByFormula: `{Car Number} = '${selectedCarNumber}'` // Filter by selected car number
        }).firstPage();

        attendanceRecords = records.map(record => ({
            date: new Date(record.get('Date')).toLocaleDateString('en-US', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            }),
            doctor: record.get('Doctor') === 1 ? 'P' : record.get('Doctor') === 0 ? 'A' :record.get('Doctor') === 9 ? 'CL' :record.get('Doctor') === 2 ? 'WO':record.get('Doctor') === 3 ? 'LH':'N/A',
            assistant: record.get('Assistant') === 1 ? 'P' : record.get('Assistant') === 0 ? 'A' :record.get('Assistant') === 9 ? 'CL' :record.get('Assistant') === 2 ? 'WO':record.get('Assistant') === 3 ? 'LH' :'N/A',
            driver: record.get('Driver') === 1 ? 'P' : record.get('Driver') === 0 ? 'A' : record.get('Driver') === 9 ? 'CL': record.get('Driver') === 2 ? 'WO': record.get('Driver') === 3 ? 'LH' :'N/A',
        }));

        updatePageNavigation();

        const startIndex = currentPageIndex * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const initialRecords = attendanceRecords.slice(startIndex, endIndex);
        
        if (initialRecords.length > 0) {
            displayAttendance(initialRecords);
        } else {
            displayAttendance([{ date: 'N/A', doctor: 'N/A', assistant: 'N/A', driver: 'N/A' }]);
        }

        console.log('Attendance records fetched successfully!');
    } catch (err) {
        console.error('Error fetching attendance records:', err);
        displayNoRecordsBanner(); // Display the no records banner in case of an error
    }
}



async function addAttendance(doctorStatus, assistantStatus, driverStatus, carNumber) {
    try {
        const doctorValue = doctorStatus === 'present' ? 1 : doctorStatus === 'leave' ? 9 : doctorStatus === 'WL' ? 2:doctorStatus === 'LH' ?3: 0;
        const assistantValue = assistantStatus === 'present' ? 1 : assistantStatus === 'leave' ? 9 : assistantStatus === 'WL' ? 2:assistantStatus === 'LH' ?3: 0;
        const driverValue = driverStatus === 'present' ? 1 : driverStatus === 'leave' ? 9 : driverStatus === 'WL' ? 2:driverStatus === 'LH' ?3: 0;

        const date = new Date().toISOString(); // Current date and time in ISO format
        await base('Attendance').create({
            "Doctor": doctorValue,
            "Assistant": assistantValue,
            "Driver": driverValue,
            "Car Number": carNumber // Include carNumber in the new record
        });

        // Reload the page after adding attendance
        location.reload();
    } catch (error) {
        console.error('Error adding attendance to Airtable:', error);
        alert('Error adding attendance. Please try again.');
    }
}



// Event listeners for pagination buttons
document.getElementById('prev-btn').addEventListener('click', prevPage);
document.getElementById('next-btn').addEventListener('click', nextPage);

// Event listener for the Submit Attendance button

// Event listener for car number selector
document.getElementById('car-number-selector').addEventListener('change', async function() {
    await fetchAttendance(); // Fetch attendance records based on the newly selected car number
});

document.getElementById('attendance-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const doctorStatus = document.getElementById('doctor').value;
    const assistantStatus = document.getElementById('assistant').value;
    const driverStatus = document.getElementById('driver').value;
    const carNumber = parseInt(document.getElementById('car-number-selector').value);

    await addAttendance(doctorStatus, assistantStatus, driverStatus, carNumber);
    await fetchAttendance(); // Fetch the latest attendance records based on selected car number and update the display
});


// Initial fetch of attendance records when the page loads
window.onload = async function() {
    await fetchAttendance();
};
