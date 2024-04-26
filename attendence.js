const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('appiv05sV7faHOuK6');
let currentPageIndex = 0;
const itemsPerPage = 7; // Display 7 items per page
let attendanceRecords = [];

function displayAttendance(records) {
    const attendanceBody = document.getElementById('attendance-body');
    attendanceBody.innerHTML = ''; // Clear existing content

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

async function addAttendance(doctorStatus, assistantStatus, driverStatus) {
    try {
        const doctorValue = doctorStatus === 'present' ? 1 : doctorStatus === 'leave' ? 9 : 0;
        const assistantValue = assistantStatus === 'present' ? 1 : assistantStatus === 'leave' ? 9 : 0;
        const driverValue = driverStatus === 'present' ? 1 : driverStatus === 'leave' ? 9 : 0;

        await base('Attendance').create({
            "Doctor": doctorValue,
            "Assistant": assistantValue,
            "Driver": driverValue
        });

        // Reload the page after adding attendance
        location.reload();
    } catch (error) {
        console.error('Error adding attendance to Airtable:', error);
        alert('Error adding attendance. Please try again.');
    }
}

async function submitAttendance() {
    const doctorStatus = document.getElementById('doctor').value;
    const assistantStatus = document.getElementById('assistant').value;
    const driverStatus = document.getElementById('driver').value;
    
    try {
        await addAttendance(doctorStatus, assistantStatus, driverStatus);
    } catch (error) {
        console.error('Error submitting attendance:', error);
        alert('Error submitting attendance. Please try again.');
    }
}

// Event listeners for pagination buttons
document.getElementById('prev-btn').addEventListener('click', prevPage);
document.getElementById('next-btn').addEventListener('click', nextPage);

// Event listener for the Submit Attendance button
document.getElementById('submit-attendance-btn').addEventListener('click', submitAttendance);

// Initial fetch of attendance records when the page loads
window.onload = async function() {
    await fetchAttendance();
};
