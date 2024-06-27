const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('app7u1ixwZ6YhhaLO');

let currentPageIndex = 0;
const itemsPerPage = 4;
let reversedRecords = [];

async function addNewRecord(newTicket, attendedTicket, cancelledTicket, carNumber, date, comments) {
    try {
        // Fetch the latest record for the selected car category
        const latestRecord = await base('Ticket Detail').select({
            maxRecords: 1,
            view: 'Grid view',
            filterByFormula: `{Car Number} = '${carNumber}'`,
            sort: [{ field: "Uid", direction: "desc" }]
        }).firstPage();

        let prevDaysPendingTicket = 0;
        if (latestRecord.length > 0) {
            // Retrieve the value of Pending Ticket from the latest record
            prevDaysPendingTicket = latestRecord[0].get('Pending Ticket') || 0;
        }

        // Calculate the new pending ticket count
        const pendingTicket = newTicket + prevDaysPendingTicket - attendedTicket - cancelledTicket;

        // Create the new record
        await base('Ticket Detail').create({
            "New Ticket": newTicket,
            "Prev Days Pending Ticket": prevDaysPendingTicket,
            "Attended Ticket": attendedTicket,
            "Cancelled Ticket": cancelledTicket,
            "Pending Ticket": pendingTicket,
            "Car Number": carNumber,
            "Date": date,
            "Comments": comments
        });

        console.log('New record created successfully!');
    } catch (err) {
        console.error('Error creating record:', err);
    }
}

// Event listener for form submission
document.getElementById('new-record-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const newTicket = parseInt(document.getElementById('new-ticket').value);
    const attendedTicket = parseInt(document.getElementById('attended-ticket').value);
    const cancelledTicket = parseInt(document.getElementById('cancelled-ticket').value);
    const carNumber = parseInt(document.getElementById('car-number').value);
    const comments = parseInt(document.getElementById('comments').value);
    const date = new Date().toISOString().split('T')[0];

    // Call the function to add a new record
    await addNewRecord(newTicket, attendedTicket, cancelledTicket, carNumber, date,comments);

    // Fetch the latest records and update the form fields
    await fetchRecordsForCar(carNumber);
});

async function fetchRecordsForCar(carNumber) {
    try {
        // Fetch the latest record for the selected car category
        const latestRecord = await base('Ticket Detail').select({
            maxRecords: 1,
            view: 'Grid view',
            filterByFormula: `{Car Number} = '${carNumber}'`,
            sort: [{ field: "Uid", direction: "desc" }]
        }).firstPage();

        let prevDaysPendingTicket = 0;
        if (latestRecord.length > 0) {
            // Retrieve the value of Pending Ticket from the latest record
            prevDaysPendingTicket = latestRecord[0].get('Pending Ticket') || 0;
        }

        // Update the "Prev Days Pending Ticket" field in the form
        document.getElementById('prev-pending-ticket').value = prevDaysPendingTicket;

        // Fetch and display the records for the selected car category
        const records = await base('Ticket Detail').select({
            maxRecords: 10000,
            view: 'Grid view',
            filterByFormula: `{Car Number} = '${carNumber}'`
        }).firstPage();

        reversedRecords = records.reverse();
        updatePageNavigation();

        if (reversedRecords.length > 0) {
            displayRecords(reversedRecords, 0, itemsPerPage);
        } else {
            displayNoRecordsBanner();
        }

        console.log('Ticket records fetched successfully for car:', carNumber);
    } catch (err) {
        console.error('Error fetching ticket records for car:', carNumber, err);
    }
}



async function fetchRecordsForCar(carNumber) {
    try {
        // Fetch the latest record for the selected car category
        const latestRecord = await base('Ticket Detail').select({
            maxRecords: 1,
            view: 'Grid view',
            filterByFormula: `{Car Number} = '${carNumber}'`,
            sort: [{ field: "Uid", direction: "desc" }]
        }).firstPage();

        let prevDaysPendingTicket = 0;
        let latestPendingTicket = 0;

        if (latestRecord.length > 0) {
            // Retrieve the value of Pending Ticket from the latest record
            latestPendingTicket = latestRecord[0].get('Pending Ticket') || 0;
        }

        // Update the "Previous Days Pending Tickets" field in the form
        document.getElementById('prev-pending-ticket').value = latestPendingTicket;

        // Fetch and display the records for the selected car category
        const records = await base('Ticket Detail').select({
            maxRecords: 10000,
            view: 'Grid view',
            filterByFormula: `{Car Number} = '${carNumber}'`
        }).firstPage();

        reversedRecords = records.reverse();
        updatePageNavigation();

        if (reversedRecords.length > 0) {
            displayRecords(reversedRecords, 0, itemsPerPage);
        } else {
            displayNoRecordsBanner();
        }

        console.log('Ticket records fetched successfully for car:', carNumber);
    } catch (err) {
        console.error('Error fetching ticket records for car:', carNumber, err);
    }
}


function displayRecords(records, startIndex, endIndex) {
    const ticketList = document.getElementById('ticket-list');
    ticketList.innerHTML = ''; // Clear existing list before appending new items

    for (let i = startIndex; i < endIndex; i++) {
        if (i >= records.length) break; // Break if no more records

        const record = records[i];
        const newTicket = record.get('New Ticket');
        const pendingTicket = record.get('Pending Ticket');
        const attendedTicket = record.get('Attended Ticket');
        const cancelledTicket = record.get('Cancelled Ticket');
        const carNumber = record.get('Car Number'); // Retrieve car number
        const comments = record.get('Comments') || 'No comments'; // Retrieve comments as string
        // Retrieve car number

        const listItem = document.createElement('li');
        listItem.classList.add('ticket-item');

        const date = new Date(record.get('Date')).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

        const dateElement = document.createElement('span');
        dateElement.textContent = `${date} - `;
        dateElement.classList.add('ticket-date');
        listItem.appendChild(dateElement);

        const ticketDetails = document.createElement('span');
        ticketDetails.textContent = `New Ticket: `;
        ticketDetails.classList.add('ticket-content');
        listItem.appendChild(ticketDetails);

        const newTicketValue = document.createElement('span');
        newTicketValue.textContent = `${newTicket}, `;
        newTicketValue.classList.add('ticket-value-new');
        listItem.appendChild(newTicketValue);

        const attendedValue = document.createElement('span');
        attendedValue.textContent = `Attended Ticket: `;
        attendedValue.classList.add('ticket-content');
        listItem.appendChild(attendedValue);

        const attendedTicketValue = document.createElement('span');
        attendedTicketValue.textContent = `${attendedTicket}, `;
        attendedTicketValue.classList.add('ticket-value-attended');
        listItem.appendChild(attendedTicketValue);

        const cancelledValue = document.createElement('span');
        cancelledValue.textContent = `Cancelled Ticket: `;
        cancelledValue.classList.add('ticket-content');
        listItem.appendChild(cancelledValue);

        const cancelledTicketValue = document.createElement('span');
        cancelledTicketValue.textContent = `${cancelledTicket}, `;
        cancelledTicketValue.classList.add('ticket-value-cancelled');
        listItem.appendChild(cancelledTicketValue);

        const pendingValue = document.createElement('span');
        pendingValue.textContent = `Pending Ticket: `;
        pendingValue.classList.add('ticket-content');
        listItem.appendChild(pendingValue);

        const pendingTicketValue = document.createElement('span');
        pendingTicketValue.textContent = `${pendingTicket}`;
        pendingTicketValue.classList.add('ticket-value-pending');
        listItem.appendChild(pendingTicketValue);

        const carNumberValue = document.createElement('span');
        carNumberValue.textContent = ` Car Number: ${carNumber}`; // Display car number
        carNumberValue.classList.add('ticket-value-car-number');
        listItem.appendChild(carNumberValue);

        const commentValue = document.createElement("span");
    commentValue.textContent = ` Comments: ${comments}`; // Display comments
    commentValue.classList.add("ticket-value-comment");
    listItem.appendChild(commentValue);

        ticketList.appendChild(listItem);
    }
}

function displayNoRecordsBanner() {
    const ticketList = document.getElementById('ticket-list');
    ticketList.innerHTML = '';

    const noRecordsBanner = document.createElement('div');
    noRecordsBanner.textContent = 'No records found. Please add a record or refresh the page.';
    noRecordsBanner.classList.add('no-records-banner');

    ticketList.appendChild(noRecordsBanner);
}

function updatePageNavigation() {
    const prevButton = document.getElementById('prev-page-btn');
    const nextButton = document.getElementById('next-page-btn');

    prevButton.disabled = currentPageIndex === 0;
    nextButton.disabled = (currentPageIndex + 1) * itemsPerPage >= reversedRecords.length;
}

function nextPage() {
    currentPageIndex++;
    const startIndex = currentPageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    displayRecords(reversedRecords, startIndex, endIndex);
    updatePageNavigation();
}

function prevPage() {
    currentPageIndex--;
    const startIndex = currentPageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    displayRecords(reversedRecords, startIndex, endIndex);
    updatePageNavigation();
}

// Event listeners for pagination buttons
document.getElementById('prev-page-btn').addEventListener('click', prevPage);
document.getElementById('next-page-btn').addEventListener('click', nextPage);

// Event listener for car number selector change
document.getElementById('car-number-selector').addEventListener('change', async function(event) {
    const selectedCarNumber = event.target.value;
    await fetchRecordsForCar(selectedCarNumber);
});

// Initial fetch of records for the default car number when the page loads
window.onload = async function() {
    const defaultCarNumber = document.getElementById('car-number-selector').value;
    await fetchRecordsForCar(defaultCarNumber);
};

// Event listener for form submission
document.getElementById('new-record-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const newTicket = parseInt(document.getElementById('new-ticket').value);
    const attendedTicket = parseInt(document.getElementById('attended-ticket').value);
    const cancelledTicket = parseInt(document.getElementById('cancelled-ticket').value);
    const carNumber = parseInt(document.getElementById('car-number-selector').value); // Retrieve car number
    const comments = document.getElementById('comments').value; // Retrieve comments as string
 // Retrieve car number
    const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    // Call the function to add a new record
    await addNewRecord(newTicket, attendedTicket, cancelledTicket, carNumber, date, comments);

    // Fetch the latest records and update the pending ticket field
    await fetchRecordsForCar(carNumber);

    // Reset the form
    setTimeout(function() {
        location.reload();
    }, 100);
});
