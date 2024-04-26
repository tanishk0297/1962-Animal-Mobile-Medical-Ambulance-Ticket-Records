(function() {
    // Function to fetch the latest record from the Ticket Detail table based on the selected car number
    async function fetchLatestTicket(selectedCarNumber) {
        try {
            const records = await base('Ticket Detail').select({
                maxRecords: 1,
                sort: [{ field: "Uid", direction: "desc" }],
                filterByFormula: `{Car Number} = '${selectedCarNumber}'` // Filter by the selected car number
            }).firstPage();

            if (records.length > 0) {
                const latestRecord = records[0];
                const fields = latestRecord.fields;
                return {
                    date: fields['Date'],
                    prevPendingTickets: fields['Prev Days Pending Ticket'],
                    newTicket: fields['New Ticket'],
                    attendedTickets: fields['Attended Ticket'],
                    cancelledTickets: fields['Cancelled Ticket'],
                    pendingTickets: fields['Pending Ticket']
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching latest ticket record:', error);
            return null;
        }
    }

    // Function to fetch the latest record from the Collection table based on the selected car number
    async function fetchLatestCollection(selectedCarNumber) {
        try {
            const records = await base('Collection').select({
                maxRecords: 1,
                sort: [{ field: "Uid", direction: "desc" }],
                filterByFormula: `{Car Number} = '${selectedCarNumber}'` // Filter by the selected car number
            }).firstPage();

            if (records.length > 0) {
                const latestRecord = records[0];
                const fields = latestRecord.fields;
                return {
                    generalAnimals: fields['General Animals'] || 0, // Set default value if field is undefined
                    dogs: fields['Dogs'] || 0,
                    otherAnimals: fields['Other Animals'] || 0,
                    collectedAmount: fields['Collected'] || 0,
                    toBeDeposited: fields['ToBeDeposited'] || 0
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching latest collection record:', error);
            return null;
        }
    }

    // Function to create and format the display element for the records
    function createDisplay(selectedCarNumber, ticketRecord, collectionRecord,vehicleDetails) {
        const element = document.createElement('div');
        element.classList.add('display-item');
        if (ticketRecord && collectionRecord) {
            element.textContent = formatDisplay(selectedCarNumber, ticketRecord, collectionRecord,vehicleDetails);
        } else {
            element.textContent = 'No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.No records matching the selected car number were found. Please choose another car or refresh the page.';

        }
        return element;
    }

    // Function to start scrolling the display strip to the left
    function startScrolling(displayStrip) {
        // Set the scroll amount and interval
        const scrollAmount = 2; // Adjust as needed
        const scrollInterval = 30; // Adjust as needed

        // Start scrolling
        const scroll = () => {
            displayStrip.scrollLeft += scrollAmount;
            if (displayStrip.scrollLeft >= displayStrip.scrollWidth - displayStrip.clientWidth) {
                displayStrip.scrollLeft = 0; // Reset to the beginning
            }
        };

        // Set the scrolling interval
        let intervalId = setInterval(scroll, scrollInterval);

        // Stop scrolling when the mouse hovers over the display strip
        displayStrip.addEventListener('mouseover', () => {
            clearInterval(intervalId);
        });

        // Resume scrolling when the mouse leaves the display strip
        displayStrip.addEventListener('mouseleave', () => {
            intervalId = setInterval(scroll, scrollInterval);
        });
    }

    // Function to display the fetched records and start scrolling them
    async function displayAndScroll() {
        const displayStrip = document.getElementById('display-strip');
        const selectedCarNumberElement = document.getElementById('car-number-selector');
        const selectedCarNumber = selectedCarNumberElement.value;

        const ticketRecord = await fetchLatestTicket(selectedCarNumber);
        const collectionRecord = await fetchLatestCollection(selectedCarNumber);

        const displayElement = createDisplay(selectedCarNumber, ticketRecord, collectionRecord,vehicleDetails);
        displayStrip.innerHTML = ''; // Clear existing content
        displayStrip.appendChild(displayElement);
        startScrolling(displayStrip);
    }

    // Function to format the records into a single line
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
        // Add more options as needed
    };
    
   function formatDisplay(selectedCarNumber, ticketRecord, collectionRecord, vehicleDetails) {
    const vehicleInfo = vehicleDetails[selectedCarNumber] ? `Vehicle Number: ${vehicleDetails[selectedCarNumber].number} | Vikas Khand: ${vehicleDetails[selectedCarNumber].location}` : '';
    const ticketInfo = `Car Number: ${selectedCarNumber} | Date: ${ticketRecord.date} | Prev Pending Tickets: ${ticketRecord.prevPendingTickets} | New Ticket: ${ticketRecord.newTicket} | Attended Tickets: ${ticketRecord.attendedTickets} | Cancelled Tickets: ${ticketRecord.cancelledTickets} | Pending Tickets: ${ticketRecord.pendingTickets}`;
    const collectionInfo = `General Animals: ${collectionRecord.generalAnimals} | Dogs: ${collectionRecord.dogs} | Other Animals: ${collectionRecord.otherAnimals} | Collected Amount: ${collectionRecord.collectedAmount} | To Be Deposited: ${collectionRecord.toBeDeposited}`;
    
    // Repeat the fields as needed
    return `${vehicleInfo} | ${ticketInfo} |${vehicleInfo}| ${collectionInfo} | ${vehicleInfo} | ${ticketInfo} |${vehicleInfo}| ${collectionInfo}${vehicleInfo} | ${ticketInfo} |${vehicleInfo}| ${collectionInfo} | ${vehicleInfo} | ${ticketInfo} |${vehicleInfo}| ${collectionInfo}${vehicleInfo} | ${ticketInfo} |${vehicleInfo}| ${collectionInfo} | ${vehicleInfo} | ${ticketInfo} |${vehicleInfo}| ${collectionInfo}`;
}

    

    // Call the displayAndScroll function with the selected car number
    const selectedCarNumber = '1'; // Replace with the selected car number
    displayAndScroll(selectedCarNumber);

    // Add event listener to update display and scrolling when the car number changes
    document.getElementById('car-number-selector').addEventListener('change', displayAndScroll);
})();
