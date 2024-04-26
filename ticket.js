const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('appiv05sV7faHOuK6');


let currentPageIndex = 0;
const itemsPerPage = 4;
let reversedRecords = [];

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

        const listItem = document.createElement('li');
        listItem.classList.add('ticket-item');
        
        const date = new Date(record.get('Date')).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
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
        
        ticketList.appendChild(listItem);
        

    }
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

async function fetchRecords() {
    try {
        const records = await base('Ticket Detail').select({
            maxRecords: 10000,
            view: 'Grid view'
        }).firstPage();

        reversedRecords = records.reverse(); // Reverse the array of records

        updatePageNavigation();

        if (reversedRecords.length > 0) {
            displayRecords(reversedRecords, 0, itemsPerPage);
        } else {
            displayNoRecordsBanner();
        }

        // Fetch the pending tickets from the latest record
        const latestPendingTicket = reversedRecords.length > 0 ? reversedRecords[0].get('Pending Ticket') : 0;
        document.getElementById('prev-pending-ticket').value = latestPendingTicket;

        console.log('Ticket records fetched successfully!');
    } catch (err) {
        console.error('Error fetching ticket records:', err);
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

// Event listeners for pagination buttons
document.getElementById('prev-page-btn').addEventListener('click', prevPage);
document.getElementById('next-page-btn').addEventListener('click', nextPage);

// Initial fetch of records and update of pending tickets when the page loads
window.onload = async function() {
    await fetchRecords();
};



// Function to add a new record
async function addNewRecord(newTicket, attendedTicket, cancelledTicket, date) {
    try {
        // Fetch the previous record to get the pending tickets
        const records = await base('Ticket Detail').select({
            maxRecords: 1,
            sort: [{ field: "Uid", direction: "desc" }]
        }).firstPage();

        let prevDaysPendingTicket = 0;
        if (records.length > 0) {
            prevDaysPendingTicket = records[0].get('Pending Ticket') || 0;
        }

        // Create the new record
        await base('Ticket Detail').create({
            "New Ticket": newTicket,
            "Prev Days Pending Ticket": prevDaysPendingTicket,
            "Attended Ticket": attendedTicket,
            "Cancelled Ticket": cancelledTicket,
            "Date": date
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
    const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    // Call the function to add a new record
    await addNewRecord(newTicket, attendedTicket, cancelledTicket, date);

    // Fetch the latest records and update the pending ticket field
    await fetchRecords();

    // Reset the form
    setTimeout(function() {
        location.reload();
    }, 100);
});

// Initial fetch of records and update of pending tickets when the page loads
window.onload = async function() {
    await fetchRecords();
};
