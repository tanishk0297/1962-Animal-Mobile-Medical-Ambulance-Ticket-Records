const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('appiv05sV7faHOuK6');

let currentPageIndex = 0;
const itemsPerPage = 1; // Display only one item at a time
let reversedRecords = [];

// Function to fetch records based on selected car number
async function fetchRecords() {
    try {
        const selectedCarNumber = document.getElementById('car-number-selector').value;
        const records = await base('Collection').select({
            maxRecords: 10000,
            view: 'Grid view',
            filterByFormula: `{Car Number} = '${selectedCarNumber}'`
        }).firstPage();

        reversedRecords = records.reverse(); // Reverse the array of records
        updatePageNavigation();

        if (reversedRecords.length > 0) {
            displayRecord(reversedRecords[0]); // Display the first record initially
        } else {
            displayNoRecordsBanner();
        }

        console.log('Collection records fetched successfully!');
    } catch (err) {
        console.error('Error fetching Collection records:', err);
        displayNoRecordsBanner(); // Display the no records banner in case of an error
    }
}

// Function to add a new record
async function addNewRecord(generalAnimals, dogs, otherAnimals, carNumber) {
    try {
        const date = new Date().toISOString(); // Current date and time in ISO format
        await base('Collection').create({
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
    nextButton.disabled = (currentPageIndex + 1) * itemsPerPage >= reversedRecords.length;
}

// Function to fetch the next page of records
function nextPage() {
    currentPageIndex++;
    const startIndex = currentPageIndex * itemsPerPage;
    const record = reversedRecords[startIndex];
    if (record) {
        displayRecord(record);
    }
    updatePageNavigation();
}

// Function to fetch the previous page of records
function prevPage() {
    currentPageIndex--;
    const startIndex = currentPageIndex * itemsPerPage;
    const record = reversedRecords[startIndex];
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

    recordContainer.appendChild(card);
}
