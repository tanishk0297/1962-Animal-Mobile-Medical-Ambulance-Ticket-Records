const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2' }).base('appiv05sV7faHOuK6');

let currentPageIndex = 0;
const itemsPerPage = 1; // Display only one item at a time
let reversedRecords = [];

function displayRecord(record) {
    const recordContainer = document.getElementById('record-list');
    recordContainer.innerHTML = ''; // Clear existing content

    const card = document.createElement('div');
    card.classList.add('card');

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
    const record = reversedRecords[startIndex];
    if (record) {
        displayRecord(record);
    }
    updatePageNavigation();
}

function prevPage() {
    currentPageIndex--;
    const startIndex = currentPageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const record = reversedRecords[startIndex];
    if (record) {
        displayRecord(record);
    }
    updatePageNavigation();
}

async function fetchRecords() {
    try {
        const records = await base('Collection').select({
            maxRecords: 10000,
            view: 'Grid view'
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

function displayNoRecordsBanner() {
    const recordContainer = document.getElementById('record-list');
    recordContainer.innerHTML = '';

    const noRecordsBanner = document.createElement('div');
    noRecordsBanner.textContent = 'No records found. Please add a record or refresh the page.';
    noRecordsBanner.classList.add('no-records-banner');

    recordContainer.appendChild(noRecordsBanner);
}
async function addNewRecord(generalAnimals, dogs, otherAnimals) {
    try {
        // Create the new record
        await base('Collection').create({
            "General Animals": generalAnimals,
            "Dogs": dogs,
            "Other Animals": otherAnimals,
        });

        console.log('New record created successfully!');
    } catch (err) {
        console.error('Error creating record:', err);
        displayNoRecordsBanner(); // You might want to handle the error display here
    }
}



// Event listener for pagination buttons
document.getElementById('prev-page-btn').addEventListener('click', prevPage);
document.getElementById('next-page-btn').addEventListener('click', nextPage);



document.getElementById('new-collection-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const generalAnimals = parseInt(document.getElementById('general-animals').value);
    const dogs = parseInt(document.getElementById('dogs').value);
    const otherAnimals = parseInt(document.getElementById('other-animals').value);

    // Call the function to add a new record
    await addNewRecord(generalAnimals, dogs, otherAnimals);

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
