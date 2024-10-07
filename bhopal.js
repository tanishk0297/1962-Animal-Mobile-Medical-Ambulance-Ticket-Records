// Include the Airtable library
const Airtable = require('airtable');

const apiKey = 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2';
const baseIds = ['appiv05sV7faHOuK6', 'appCdJED3BCxjGlB4', 'app7u1ixwZ6YhhaLO','appym1xh8nuBogY9r','appna8sgnyyzTFRtL','appDb3Dttu2fjJl1b','apppQcGGzTZKVtpmG'];
const tableNames = ['Attendance', 'Collection', 'Ticket Detail'];

// Initialize Airtable bases
const bases = baseIds.map(id => new Airtable({ apiKey }).base(id));

async function fetchAllRecords(base, tableName, selectedDate) {
    const allRecords = [];
    let offset = undefined;

    try {
        do {
            const options = {
                sort: [{ field: "Uid", direction: "desc" }],
                view: 'Grid view',
                filterByFormula: `IS_SAME({Date}, "${selectedDate}")`,
                pageSize: 100
            };

            if (offset) {
                options.offset = offset;
            }

            const response = await base(tableName).select(options).all();

            allRecords.push(...response);

            // Update offset for next page
            offset = response.offset;
        } while (offset);
    } catch (err) {
        console.error(`Error fetching records from ${tableName} in base:`, err);
    }

    return allRecords;
}

// Function to fetch all data from all bases and tables for the selected date
async function fetchAllData(selectedDate) {
    const allData = {};
    showDataLoader();
    for (const base of bases) {
        const baseId = base._base._id; // Get the base ID
        allData[baseId] = {};

        for (const tableName of tableNames) {
            const records = await fetchAllRecords(base, tableName, selectedDate);
            allData[baseId][tableName] = records;
        }
    }

    hideDataLoader();
    return allData;
}

// Function to be called on button click to fetch records
function fetchRecords() {
    const selectedDate = document.getElementById('report-date').value;

    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }

    fetchAllData(selectedDate).then(data => {
        console.log('Fetched data:', data);
        updateTable(data);
    }).catch(err => {
        console.error('Error fetching all data:', err);
    });
}

function sum(items, prop) {
    return items.reduce(function (a, b) {
        return a + b.fields[prop];
    }, 0);
}


function updateTable(data) {
    const recordsBody = document.getElementById('records-body');
    recordsBody.innerHTML = ''; // Clear previous records

    var myArray = [
        {carno: 1, vehicleno: 'MP-02-ZA-0104', location: 'केसली',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
        {carno: 2, vehicleno: 'MP-02-ZA-0156', location: 'मालथौन',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
        {carno: 3, vehicleno: 'MP-02-ZA-0142', location: 'सागर 1',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
        {carno: 4, vehicleno: 'MP-02-ZA-0125', location: 'रहली',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
        {carno: 5, vehicleno: 'MP-02-ZA-0140', location: 'देवरी',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
        {carno: 6, vehicleno: 'MP-02-ZA-0126', location: 'जैसीनगर',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
        {carno: 7, vehicleno: 'MP-02-ZA-0151', location: 'खुरई',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
        {carno: 8, vehicleno: 'MP-02-ZA-0146', location: 'वण्‍डा',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
        {carno: 9, vehicleno: 'MP-02-ZA-0186', location: 'शाहगढ',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
        {carno: 10, vehicleno: 'MP-02-ZA-0139', location: 'सागर 2',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
        {carno: 11, vehicleno: 'MP-02-ZA-0199', location: 'सागर HQ',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
        {carno: 12, vehicleno: 'MP-02-ZA-0192', location: 'बीना',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
        {carno: 13, vehicleno: 'MP-02-ZA-0159', location: 'राहतगढ',zila: 'सागर',  newtickets: 0, attended: 0, collected: 0, tobedeposited: 0,PrevDaysPendingTicket:0,CancelledTicket:0, prevcollected:0,totalcollected:0},
    ];
  // Initialize variables to hold the total sums
    let totalJilePrapt = 0;
    let totalJileAttend = 0;
    let totalBhopalPrapt = 0;
    let totalBhopalAttend = 0;
    let totalPending = 0;
    let totalCancelled = 0;
    let totalTodayAttend = 0;
    let totalTodayAmount = 0;
    let totalPreviousCollected = 0;
    let totalCollected = 0;
// Function to recalculate and update totals for a specific column
function recalculateColumnTotals(columnIndex) {
    switch (columnIndex) {
        case 4: // Jile Prapt (new tickets)
            totalJilePrapt = 0;
            recordsBody.querySelectorAll('tr').forEach(row => {
                totalJilePrapt += parseFloat(row.querySelector('td:nth-child(4)').textContent) || 0;
            });
            document.getElementById('total-jile-prapt').textContent = totalJilePrapt;
            break;

        case 5: // Jile Attend
            totalJileAttend = 0;
            recordsBody.querySelectorAll('tr').forEach(row => {
                totalJileAttend += parseFloat(row.querySelector('td:nth-child(5)').textContent) || 0;
            });
            document.getElementById('total-jile-attend').textContent = totalJileAttend;
            break;

        case 6: // Bhopal Prapt (new tickets)
            totalBhopalPrapt = 0;
            recordsBody.querySelectorAll('tr').forEach(row => {
                totalBhopalPrapt += parseFloat(row.querySelector('td:nth-child(6)').textContent) || 0;
            });
            document.getElementById('total-bhopal-prapt').textContent = totalBhopalPrapt;
            break;

        case 7: // Bhopal Attend
            totalBhopalAttend = 0;
            recordsBody.querySelectorAll('tr').forEach(row => {
                totalBhopalAttend += parseFloat(row.querySelector('td:nth-child(7)').textContent) || 0;
            });
            document.getElementById('total-bhopal-attend').textContent = totalBhopalAttend;
            break;

        case 8: // Pending
            totalPending = 0;
            recordsBody.querySelectorAll('tr').forEach(row => {
                totalPending += parseFloat(row.querySelector('td:nth-child(8)').textContent) || 0;
            });
            document.getElementById('total-pending').textContent = totalPending;
            break;

        case 9: // Cancelled
            totalCancelled = 0;
            recordsBody.querySelectorAll('tr').forEach(row => {
                totalCancelled += parseFloat(row.querySelector('td:nth-child(9)').textContent) || 0;
            });
            document.getElementById('total-canceled').textContent = totalCancelled;
            break;

        case 11: // Today Attended (total attended today)
            totalTodayAttend = 0;
            recordsBody.querySelectorAll('tr').forEach(row => {
                totalTodayAttend += parseFloat(row.querySelector('td:nth-child(11)').textContent) || 0;
            });
            document.getElementById('total-attend-today').textContent = totalTodayAttend;
            break;

        case 12: // Today Amount (collected today)
            totalTodayAmount = 0;
            recordsBody.querySelectorAll('tr').forEach(row => {
                totalTodayAmount += parseFloat(row.querySelector('td:nth-child(12)').textContent) || 0;
            });
            document.getElementById('total-attend-today-amount').textContent = totalTodayAmount;
            break;

        case 13: // Previous Collected
            totalPreviousCollected = 0;
            recordsBody.querySelectorAll('tr').forEach(row => {
                totalPreviousCollected += parseFloat(row.querySelector('td:nth-child(13)').textContent) || 0;
            });
            document.getElementById('total-previous-attend-amount').textContent = totalPreviousCollected;
            break;

        case 14: // Total Collected
            totalCollected = 0;
            recordsBody.querySelectorAll('tr').forEach(row => {
                totalCollected += parseFloat(row.querySelector('td:nth-child(14)').textContent) || 0;
            });
            document.getElementById('total-today-amount').textContent = totalCollected;
            break;
    }
}

function applyTotalColors() {
    document.getElementById('total-jile-prapt').style.backgroundColor = '#ffff8d'; // Slightly Darker Buttery Yellow
    document.getElementById('total-jile-attend').style.backgroundColor = '#ffff8d'; // Slightly Darker Mint Green
    document.getElementById('total-bhopal-prapt').style.backgroundColor = '#79c336'; // Slightly Darker Pale Sky Blue
    document.getElementById('total-bhopal-attend').style.backgroundColor = '#79c336'; // Slightly Darker Gentle Blush Pink
    document.getElementById('total-pending').style.backgroundColor = '#ffb2a6'; // Slightly Darker Warm Peach
    document.getElementById('total-canceled').style.backgroundColor = '#e0e0e0'; // Slightly Darker Light Salmon
    document.getElementById('total-attend-today').style.backgroundColor = '#80deea'; // Slightly Darker Soft Lavender
    document.getElementById('total-attend-today-amount').style.backgroundColor = '#c5a9e1'; // Slightly Darker Soft Golden Yellow
    document.getElementById('total-previous-attend-amount').style.backgroundColor = '#e2eb9f'; // Slightly Darker Soft Aquamarine
    document.getElementById('total-today-amount').style.backgroundColor = '#ce93d8'; // Slightly Darker Light Silver Gray
}

// Call the function to apply colors
applyTotalColors();


    // Loop through the data and update myArray with fetched data
    for (let i = 0; i < myArray.length; i++) {
        for (const baseId in data) {
            myArray[i].newtickets += sum(data[baseId]['Ticket Detail'].filter(item => item.fields['Car Number'] == myArray[i].carno), 'New Ticket');
            myArray[i].attended += sum(data[baseId]['Ticket Detail'].filter(item => item.fields['Car Number'] == myArray[i].carno), 'Attended Ticket');
            myArray[i].collected += sum(data[baseId]['Collection'].filter(item => item.fields['Car Number'] == myArray[i].carno), 'Collected');
            myArray[i].tobedeposited += sum(data[baseId]['Collection'].filter(item => item.fields['Car Number'] == myArray[i].carno), 'ToBeDeposited');
            myArray[i].PrevDaysPendingTicket += sum(data[baseId]['Ticket Detail'].filter(item => item.fields['Car Number'] == myArray[i].carno), 'Pending Ticket');
            myArray[i].CancelledTicket += sum(data[baseId]['Ticket Detail'].filter(item => item.fields['Car Number'] == myArray[i].carno), 'Cancelled Ticket');
        }

        // Accumulate totals for each relevant field
        // totalJilePrapt += myArray[i].newtickets || 0;
        // totalJileAttend += myArray[i].attended || 0;
        // totalBhopalPrapt += myArray[i].newtickets || 0; // Assuming same as  for Bhopal
        // totalBhopalAttend += myArray[i].attended || 0;
        // totalPending += myArray[i].PrevDaysPendingTicket || 0;
        // totalCancelled += myArray[i].CancelledTicket || 0;
        // totalTodayAttend += myArray[i].attended || 0; // Assuming 'attended' is today's attended
        // totalTodayAmount += myArray[i].collected || 0;
       
    }

 // Populate the table rows
myArray.forEach(item => {
    const row = document.createElement('tr');

    const zila = document.createElement('td');
    zila.textContent = item.zila;
    zila.contentEditable = "true";
    row.appendChild(zila);

    const cellVehicleNumber = document.createElement('td');
    cellVehicleNumber.textContent = item.vehicleno;
    cellVehicleNumber.contentEditable = "true";
    row.appendChild(cellVehicleNumber);

    const cellLocation = document.createElement('td');
    cellLocation.textContent = item.location;
    cellLocation.contentEditable = "true";
    row.appendChild(cellLocation);

    const JilePrapt = document.createElement('td');
    JilePrapt.textContent = item.newtickets;
    JilePrapt.style.backgroundColor='#ffffad'
    JilePrapt.contentEditable = "true";
    row.appendChild(JilePrapt);

    const JileAttend = document.createElement('td');
    JileAttend.textContent = item.attended;
    JileAttend.style.backgroundColor='#ffffad'
    JileAttend.contentEditable = "true";
    row.appendChild(JileAttend);

    const BhopalPrapt = document.createElement('td');
    BhopalPrapt.textContent = item.newtickets;
    BhopalPrapt.contentEditable = "true";
    BhopalPrapt.style.backgroundColor = "#beff80";
    row.appendChild(BhopalPrapt);

    const BhopalAttend = document.createElement('td');
    BhopalAttend.textContent = item.attended;
    BhopalAttend.contentEditable = "true";
    BhopalAttend.style.backgroundColor = "#beff80";
    row.appendChild(BhopalAttend);
    
    const Pending = document.createElement('td');
    Pending.textContent = item.PrevDaysPendingTicket;
    Pending.style.backgroundColor = "#ffcdd2";
    Pending.contentEditable = "true";
    row.appendChild(Pending);
    
    const Cancelled = document.createElement('td');
    Cancelled.textContent = item.CancelledTicket;
    Cancelled.style.backgroundColor = "#f5f5f5";
    Cancelled.contentEditable = "true";
    row.appendChild(Cancelled);




// Create and append the 'reason' cell with a custom tag input
const reason = document.createElement('td');
reason.style.width = '400%';

// Create a container for the tags
const tagContainer = document.createElement('div');
tagContainer.classList.add('tag-container');
reason.appendChild(tagContainer);

// Create the input field for the custom tags
const tagInput = document.createElement('input');
tagInput.type = 'text';
tagInput.classList.add('tag-input');
tagInput.readOnly = true;  // Make the input field read-only to prevent manual typing
reason.appendChild(tagInput);

// Create the dropdown menu (initially hidden)
const dropdown = document.createElement('div');
dropdown.classList.add('dropdown-menu');
dropdown.style.display = 'none';
reason.appendChild(dropdown);

const reasons = [
    '#Treated over phone',
    '#Animal death',
    '#Owner cancel his ticket from call centre',
    '#Owner refuse for treatment (Animal become healthy)',
    '#Animal treated by other AHW or Local vet',
    '#Owner refuse to pay 150 rs/300rs'
];

// Populate the dropdown menu with reasons
reasons.forEach(reasonText => {
    const option = document.createElement('div');
    option.classList.add('dropdown-option');
    option.textContent = reasonText;
    option.addEventListener('click', () => {
        addTag(reasonText);  // Add the selected reason as a tag
        dropdown.style.display = 'none';  // Hide the dropdown menu after selection
    });
    dropdown.appendChild(option);
});

// Function to add a tag
function addTag(text) {
    const tag = document.createElement('span');
    tag.classList.add('tag');
    tag.textContent = text;

    const removeBtn = document.createElement('span');
    removeBtn.classList.add('remove-tag');
    removeBtn.textContent = ',  ';
    removeBtn.addEventListener('click', () => {
        tagContainer.removeChild(tag);
    });

    tag.appendChild(removeBtn);
    tagContainer.appendChild(tag);
}

// Show dropdown menu when the input field is clicked
tagInput.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
});

// Hide the dropdown if clicked outside
document.addEventListener('click', (event) => {
    if (!reason.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

row.appendChild(reason);





    const TodayAttend = document.createElement('td');
    TodayAttend.textContent = item.attended; // Assuming 'attended' as today's attended
    TodayAttend.contentEditable = "true";
    TodayAttend.style.backgroundColor = "#b2ebf2";
    row.appendChild(TodayAttend);

    // Create and append the 'todayamount' cell
    const todayamount = document.createElement('td');
    todayamount.textContent = item.collected;
    todayamount.contentEditable = "true";
    todayamount.style.backgroundColor = "#d1c4e9";
    row.appendChild(todayamount);

    // Create and append the 'prevamount' cell
    const prevamount = document.createElement('td');
    prevamount.contentEditable = "true";
    prevamount.style.backgroundColor = "#f0f4c3";
    row.appendChild(prevamount);

    // Create and append the 'sumAmount' cell
    const sumAmount = document.createElement('td');
    sumAmount.contentEditable = "true";
    sumAmount.style.backgroundColor = "#e1bee7";
    row.appendChild(sumAmount);

    // Function to update the sumAmount cell
    function updateSumAmount() {
        const todayValue = parseFloat(todayamount.textContent) || 0;
        const prevValue = parseFloat(prevamount.textContent) || 0;
        sumAmount.textContent = todayValue + prevValue;
        recalculateColumnTotals(14);
        recalculateColumnTotals(12);
        recalculateColumnTotals(13);
    }

    // Function to calculate and update prevamount and todayamount
    function updatePrevAmount() {
        const jileAttendValue = parseFloat(JileAttend.textContent) || 0;
        const bhopalAttendValue = parseFloat(BhopalAttend.textContent) || 0;
        
        // Calculate prevamount
        const prevValue = (jileAttendValue - bhopalAttendValue) * 150;
        prevamount.textContent = prevValue;
        recalculateColumnTotals(13);
        recalculateColumnTotals(12);
        recalculateColumnTotals(14);

        // Update todayamount based on bhopalAttendValue
        todayamount.textContent = bhopalAttendValue * 150;

        // Update sumAmount after updating prevamount and todayamount
        updateSumAmount();
    }
  
    // Initial updates
    updatePrevAmount();
    
    updateSumAmount();

    // Add event listeners to update sumAmount and prevamount when related fields change
    todayamount.addEventListener('input', updateSumAmount);
    prevamount.addEventListener('input', updateSumAmount);
    JileAttend.addEventListener('input', updatePrevAmount);
    BhopalAttend.addEventListener('input', updatePrevAmount);

    recordsBody.appendChild(row);

    // Attach event listeners to update totals for individual columns
    [JilePrapt, JileAttend, BhopalPrapt, BhopalAttend, Pending, Cancelled, reason, TodayAttend, todayamount, prevamount, sumAmount].forEach((cell, index) => {
        cell.addEventListener('input', () => { recalculateColumnTotals(index + 4) });
    });
});

// Update the footer totals initially
recalculateColumnTotals(4);  // Initial calculation for Jile Prapt
recalculateColumnTotals(5);  // Initial calculation for Jile Attend
recalculateColumnTotals(6);  // Initial calculation for Bhopal Prapt
recalculateColumnTotals(7);  // Initial calculation for Bhopal Attend
recalculateColumnTotals(8);  // Initial calculation for Pending
recalculateColumnTotals(9);  // Initial calculation for Cancelled
recalculateColumnTotals(11); // Initial calculation for Today Attend
recalculateColumnTotals(12); // Initial calculation for Today Amount
recalculateColumnTotals(13); // Initial calculation for Previous Collected
recalculateColumnTotals(14); // Initial calculation for Total Collected

}
// Function to show loading buffer
function showDataLoader() {
    document.getElementById('loader').style.display = 'block';
}
// Function to hide loading buffer
function hideDataLoader() {
    document.getElementById('loader').style.display = 'none';
}