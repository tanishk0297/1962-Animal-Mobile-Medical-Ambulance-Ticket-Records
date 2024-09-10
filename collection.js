const Airtable = require('airtable');
const base1 = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('appiv05sV7faHOuK6');
const base2 = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('appCdJED3BCxjGlB4');
const base3 = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('app7u1ixwZ6YhhaLO');
const base4 = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('appym1xh8nuBogY9r');
const base5 = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('appna8sgnyyzTFRtL');
const base6 = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('appDb3Dttu2fjJl1b');

let currentPageIndex = 0;
const itemsPerPage = 1; // Display only one item at a time
let allRecords = [];
let isLoading = false;

// Function to get custom month range
function getCustomMonthRange(currentDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    let startDate, endDate;

    if (currentDate.getDate() >= 16) {
        startDate = new Date(year, month, 16);
        endDate = new Date(year, month + 1, 15);
    } else {
        startDate = new Date(year, month - 1, 16);
        endDate = new Date(year, month, 15);
    }

    return { startDate, endDate };
}

// Function to fetch records based on selected car number from base1
async function fetchRecordsFromBase1(selectedCarNumber, startDate, endDate) {
    try {
        const filterFormula = generateFilterFormula(selectedCarNumber, startDate, endDate);
        const records = await base1('Collection').select({
            maxRecords: 10000,
            view: 'Grid view',
            filterByFormula: filterFormula
        }).firstPage();
        return records.reverse(); // Reverse the array of records
    } catch (err) {
        console.error('Error fetching Collection records from base1:', err);
        return []; // Return an empty array in case of an error
    }
}

// Function to fetch records based on selected car number from base2
async function fetchRecordsFromBase2(selectedCarNumber, startDate, endDate) {
    try {
        const filterFormula = generateFilterFormula(selectedCarNumber, startDate, endDate);
        const records = await base2('Collection').select({
            maxRecords: 10000,
            view: 'Grid view',
            filterByFormula: filterFormula
        }).firstPage();
        return records.reverse(); // Reverse the array of records
    } catch (err) {
        console.error('Error fetching Collection records from base2:', err);
        return []; // Return an empty array in case of an error
    }
}
// Function to fetch records based on selected car number from base2
async function fetchRecordsFromBase3(selectedCarNumber, startDate, endDate) {
    try {
        const filterFormula = generateFilterFormula(selectedCarNumber, startDate, endDate);
        const records = await base3('Collection').select({
            maxRecords: 10000,
            view: 'Grid view',
            filterByFormula: filterFormula
        }).firstPage();
        return records.reverse(); // Reverse the array of records
    } catch (err) {
        console.error('Error fetching Collection records from base3:', err);
        return []; // Return an empty array in case of an error
    }
}
async function fetchRecordsFromBase4(selectedCarNumber, startDate, endDate) {
    try {
        const filterFormula = generateFilterFormula(selectedCarNumber, startDate, endDate);
        const records = await base4('Collection').select({
            maxRecords: 10000,
            view: 'Grid view',
            filterByFormula: filterFormula
        }).firstPage();
        return records.reverse(); // Reverse the array of records
    } catch (err) {
        console.error('Error fetching Collection records from base4:', err);
        return []; // Return an empty array in case of an error
    }
}
async function fetchRecordsFromBase5(selectedCarNumber, startDate, endDate) {
    try {
        const filterFormula = generateFilterFormula(selectedCarNumber, startDate, endDate);
        const records = await base5('Collection').select({
            maxRecords: 10000,
            view: 'Grid view',
            filterByFormula: filterFormula
        }).firstPage();
        return records.reverse(); // Reverse the array of records
    } catch (err) {
        console.error('Error fetching Collection records from base5:', err);
        return []; // Return an empty array in case of an error
    }
}
async function fetchRecordsFromBase6(selectedCarNumber, startDate, endDate) {
    try {
        const filterFormula = generateFilterFormula(selectedCarNumber, startDate, endDate);
        const records = await base6('Collection').select({
            maxRecords: 10000,
            view: 'Grid view',
            filterByFormula: filterFormula
        }).firstPage();
        return records.reverse(); // Reverse the array of records
    } catch (err) {
        console.error('Error fetching Collection records from base6:', err);
        return []; // Return an empty array in case of an error
    }
}

function generateFilterFormula(selectedCarNumber, startDate, endDate) {
    return `AND(
        {Car Number} = '${selectedCarNumber}',
        IS_AFTER({Date}, '${startDate.toISOString()}'),
        IS_BEFORE({Date}, '${endDate.toISOString()}')
    )`;
}

// Function to fetch records based on selected car number
async function fetchRecords() {
    try {
        showLoadingIndicator(true);

        const selectedCarNumber = document.getElementById('car-number-selector').value;
        const currentDate = new Date();
        const { startDate, endDate } = getCustomMonthRange(currentDate);

        const recordsFromBase1 = await fetchRecordsFromBase1(selectedCarNumber, startDate, endDate);
        const recordsFromBase2 = await fetchRecordsFromBase2(selectedCarNumber, startDate, endDate);
        const recordsFromBase3 = await fetchRecordsFromBase3(selectedCarNumber, startDate, endDate);
        const recordsFromBase4 = await fetchRecordsFromBase4(selectedCarNumber, startDate, endDate);
        const recordsFromBase5 = await fetchRecordsFromBase5(selectedCarNumber, startDate, endDate);
        const recordsFromBase6 = await fetchRecordsFromBase6(selectedCarNumber, startDate, endDate);

        allRecords = recordsFromBase6.concat(recordsFromBase5,recordsFromBase4, recordsFromBase3,recordsFromBase2,recordsFromBase1); // Concatenate records from all three bases
        updatePageNavigation();

        const totals = calculateTotals(allRecords);
        displayTotalsCard(totals);

        if (allRecords.length > 0) {
            displayRecord(allRecords[0]); // Display the first record initially
        } else {
            displayNoRecordsBanner();
        }

        console.log('Collection records fetched successfully!');
    } catch (err) {
        console.error('Error fetching Collection records:', err);
        displayNoRecordsBanner(); // Display the no records banner in case of an error
    } finally {
        showLoadingIndicator(false);
    }
}

// Function to calculate totals
function calculateTotals(records) {
    const totals = {
        generalAnimals: 0,
        dogs: 0,
        otherAnimals: 0,
        collected: 0,
        toBeDeposited: 0
    };

    records.forEach(record => {
        totals.generalAnimals += record.get('General Animals') || 0;
        totals.dogs += record.get('Dogs') || 0;
        totals.otherAnimals += record.get('Other Animals') || 0;
        totals.collected += record.get('Collected') || 0;
        totals.toBeDeposited += record.get('ToBeDeposited') || 0;
    });

    return totals;
}

async function addNewRecord(generalAnimals, dogs, otherAnimals, carNumber) {
    try {
        const date = new Date().toISOString(); // Current date and time in ISO format
        await base6('Collection').create({
            "General Animals": generalAnimals,
            "Dogs": dogs,
            "Other Animals": otherAnimals,
            "Car Number": carNumber,
        });
        console.log('New record added successfully!');
        window.location.reload(); // Reload the page
    } catch (err) {
        console.error('Error adding new record:', err);
    }
}

// Event listener for form submission
document.getElementById('new-collection-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const generalAnimals = parseInt(document.getElementById('general-animals').value);
    const dogs = parseInt(document.getElementById('dogs').value);
    const otherAnimals = parseInt(document.getElementById('other-animals').value);
    const carNumber = parseInt(document.getElementById('car-number-selector').value);

    await addNewRecord(generalAnimals, dogs, otherAnimals, carNumber);
    await fetchRecords(); // Fetch the latest records based on selected car number and update the display
});

// Function to update page navigation buttons
function updatePageNavigation() {
    const prevButton = document.getElementById('prev-page-btn');
    const nextButton = document.getElementById('next-page-btn');
    prevButton.disabled = currentPageIndex === 0;
    nextButton.disabled = (currentPageIndex + 1) * itemsPerPage >= allRecords.length;
}

// Function to fetch the next page of records
function nextPage() {
    currentPageIndex++;
    const startIndex = currentPageIndex * itemsPerPage;
    const record = allRecords[startIndex];
    if (record) {
        displayRecord(record);
    }
    updatePageNavigation();
}

// Function to fetch the previous page of records
function prevPage() {
    currentPageIndex--;
    const startIndex = currentPageIndex * itemsPerPage;
    const record = allRecords[startIndex];
    if (record) {
        displayRecord(record);
    }
    updatePageNavigation();
}

// Event listener for pagination buttons
document.getElementById('prev-page-btn').addEventListener('click', prevPage);
document.getElementById('next-page-btn').addEventListener('click', nextPage);

// Event listener for car number selector
document.getElementById('car-number-selector').addEventListener('change', async function() {
    await fetchRecords(); // Fetch records based on the newly selected car number
});

// Initial fetch of records based on selected car number when the page loads
window.onload = async function() {
    await fetchRecords();
};

// Function to display a banner when no records are found
function displayNoRecordsBanner() {
    const recordContainer = document.getElementById('record-list');
    recordContainer.innerHTML = '';
    const noRecordsBanner = document.createElement('div');
    noRecordsBanner.textContent = 'No records found. Please add a record or refresh the page.';
    noRecordsBanner.classList.add('no-records-banner');
    recordContainer.appendChild(noRecordsBanner);
}

// Function to delete a record by its ID
async function deleteRecord(recordId) {
    try {
        await base6('Collection').destroy(recordId);
        console.log(`Record ${recordId} deleted successfully!`);
        
        // Re-fetch records to update the display
        await fetchRecords();
    } catch (err) {
        console.error('Error deleting record:', err);
    }
}

// Updated function to display a record with a delete button
function displayRecord(record) {
    const recordContainer = document.getElementById('record-list');
    recordContainer.innerHTML = ''; // Clear existing content

    const card = document.createElement('div');
    card.classList.add('card');

    // Display selected car number
    const carNumberElement = document.createElement('p');
    const selectedCarNumber = document.getElementById('car-number-selector').value;
    carNumberElement.textContent = `Car Number: ${selectedCarNumber}`;
    card.appendChild(carNumberElement);

    // Create elements to display record details
    const dateElement = document.createElement('p');
    const date = new Date(record.get('Date'));
    dateElement.textContent = `Date: ${date.toLocaleDateString()}`;
    card.appendChild(dateElement);

    const generalAnimalsElement = document.createElement('p');
    generalAnimalsElement.textContent = `General Animals: ${record.get('General Animals')}`;
    card.appendChild(generalAnimalsElement);

    const dogsElement = document.createElement('p');
    dogsElement.textContent = `Dogs: ${record.get('Dogs')}`;
    card.appendChild(dogsElement);

    const otherAnimalsElement = document.createElement('p');
    otherAnimalsElement.textContent = `Other Animals: ${record.get('Other Animals')}`;
    card.appendChild(otherAnimalsElement);

    const collectedElement = document.createElement('p');
    collectedElement.textContent = `Amount Collected: ${record.get('Collected')}`;
    card.appendChild(collectedElement);

    const toBeDepositedElement = document.createElement('p');
    toBeDepositedElement.textContent = `Amount to be Deposited: ${record.get('ToBeDeposited')}`;
    card.appendChild(toBeDepositedElement);

    // Add a Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Record';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = () => deleteRecord(record.id); // Call deleteRecord with record ID

    card.appendChild(deleteButton);

    // Append the card to the container
    recordContainer.appendChild(card);
}

function displayTotalsCard(totals) {
    const totalRecordsContainer = document.getElementById('total-records');
    totalRecordsContainer.innerHTML = ''; // Clear existing content

    const card = document.createElement('div');
    card.classList.add('card', 'total-records-card');

    // Get the start and end months
    const currentDate = new Date();
    let startMonthIndex, endMonthIndex;
    if (currentDate.getDate() >= 16) {
        startMonthIndex = currentDate.getMonth(); // Current month
        endMonthIndex = (currentDate.getMonth() + 1) % 12; // Next month
    } else {
        startMonthIndex = (currentDate.getMonth() - 1 + 12) % 12; // Previous month
        endMonthIndex = currentDate.getMonth(); // Current month
    }
    const startMonth = getMonthName(startMonthIndex);
    const endMonth = getMonthName(endMonthIndex);

    const titleElement = document.createElement('h3');
    titleElement.textContent = `Total Records For ${startMonth}-${endMonth}`;
    card.appendChild(titleElement);

    const generalAnimalsElement = document.createElement('p');
    generalAnimalsElement.textContent = `Total General Animals: ${totals.generalAnimals}`;
    card.appendChild(generalAnimalsElement);

    const dogsElement = document.createElement('p');
    dogsElement.textContent = `Total Dogs: ${totals.dogs}`;
    card.appendChild(dogsElement);

    const otherAnimalsElement = document.createElement('p');
    otherAnimalsElement.textContent = `Total Other Animals: ${totals.otherAnimals}`;
    card.appendChild(otherAnimalsElement);

    const collectedElement = document.createElement('p');
    collectedElement.textContent = `Total Amount Collected: ${totals.collected}`;
    card.appendChild(collectedElement);

    const toBeDepositedElement = document.createElement('p');
    toBeDepositedElement.textContent = `Total Amount to be Deposited: ${totals.toBeDeposited}`;
    card.appendChild(toBeDepositedElement);

    totalRecordsContainer.appendChild(card);
}

function getMonthName(monthIndex) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[monthIndex];
}

function showLoadingIndicator(show) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (show) {
        loadingIndicator.style.display = 'block';
    } else {
        loadingIndicator.style.display = 'none';
    }
}
