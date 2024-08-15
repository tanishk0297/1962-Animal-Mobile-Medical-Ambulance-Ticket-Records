// Include the Airtable library
const Airtable = require('airtable');

const apiKey = 'pat9fREdITpFW3UdB.13d5c2b0a2e5a4316b7124d354081bd11ced915241a18dc56a5b913501127ef2';
const baseIds = ['appiv05sV7faHOuK6', 'appCdJED3BCxjGlB4', 'app7u1ixwZ6YhhaLO','appym1xh8nuBogY9r','appna8sgnyyzTFRtL'];
const tableNames = ['Attendance', 'Collection', 'Ticket Detail'];

// Initialize Airtable bases
const bases = baseIds.map(id => new Airtable({ apiKey }).base(id));

async function fetchAllRecords(base, tableName, fromDate, toDate) {
    const allRecords = [];
    let offset = undefined;

    try {
        do {
            const options = {
                sort: [{ field: "Uid", direction: "desc" }],
                view: 'Grid view',
                filterByFormula: `AND(
                    OR(IS_SAME({Date}, "${fromDate}"), IS_AFTER({Date}, "${fromDate}")), 
                    OR(IS_SAME({Date}, "${toDate}"), IS_BEFORE({Date}, "${toDate}"))
                )`,
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



// Function to fetch all data from all bases and tables within the date range
async function fetchAllData(fromDate, toDate) {
    const allData = {};
    showDataLoader();
    for (const base of bases) {
        const baseId = base._base._id; // Get the base ID
        allData[baseId] = {};

        for (const tableName of tableNames) {
            const records = await fetchAllRecords(base, tableName, fromDate, toDate);
            allData[baseId][tableName] = records;
        }
    }

    // console.log(allData);
    hideDataLoader();
    return allData;
}

// Function to be called on button click to fetch records
function fetchRecords() {
    const fromDate = document.getElementById('from-date').value;
    const toDate = document.getElementById('to-date').value;

    if (!fromDate || !toDate) {
        alert("Please select both From and To dates.");
        return;
    }

    fetchAllData(fromDate, toDate).then(data => {
        console.log('Fetched data:', data);
        // Call a function to update the table with fetched data
        updateTable(data);
    }).catch(err => {
        console.error('Error fetching all data:', err);
    });
}

function sum(items, prop){
    return items.reduce( function(a, b){
        return a + b.fields[prop];
    }, 0);
};

// Function to update the table with fetched data (implement this function based on your table structure)
function updateTable(data) {
    const recordsBody = document.getElementById('records-body');
    recordsBody.innerHTML = ''; // Clear previous records

    var myArray = [
        {carno: 1, vehicleno: 'MP-02-ZA-0104', location: 'केसली', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0},
        {carno: 2, vehicleno: 'MP-02-ZA-0156', location: 'मालथौन', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0},
        {carno: 3, vehicleno: 'MP-02-ZA-0142', location: 'सागर 1', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0},
        {carno: 4, vehicleno: 'MP-02-ZA-0125', location: 'रहली', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0},
        {carno: 5, vehicleno: 'MP-02-ZA-0140', location: 'देवरी', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0},
        {carno: 6, vehicleno: 'MP-02-ZA-0126', location: 'जैसीनगर', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0},
        {carno: 7, vehicleno: 'MP-02-ZA-0151', location: 'खुरई', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0},
        {carno: 8, vehicleno: 'MP-02-ZA-0146', location: 'वण्‍डा', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0},
        {carno: 9, vehicleno: 'MP-02-ZA-0186', location: 'शाहगढ', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0},
        {carno: 10, vehicleno: 'MP-02-ZA-0139', location: 'सागर 2', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0},
        {carno: 11, vehicleno: 'MP-02-ZA-0199', location: 'सागर HQ', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0},
        {carno: 12, vehicleno: 'MP-02-ZA-0192', location: 'बीना', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0},
        {carno: 13, vehicleno: 'MP-02-ZA-0159', location: 'राहतगढ', doctor: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, paravet: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, driver: {p: 0, a: 0, wo: 0, lh: 0, cl: 0}, totalnewtickets: 0, totalattended: 0, amountcollected: 0, tobedeposited: 0}
    ];
    
    // Loop through the data and add rows to the table
    for (let i = 0; i < myArray.length;i++){
        
    for (const baseId in data) {
    
       myArray[i].doctor.p += data[baseId]['Attendance'].filter((item)=>  item.fields['Car Number'] == myArray[i].carno && item.fields['Doctor']== 1).length;              
       myArray[i].doctor.a += data[baseId]['Attendance'].filter((item)=>  item.fields['Car Number'] == myArray[i].carno && item.fields['Doctor']== 0).length;              
       myArray[i].doctor.wo += data[baseId]['Attendance'].filter((item)=>  item.fields['Car Number'] == myArray[i].carno && item.fields['Doctor']== 2).length;              
       myArray[i].doctor.lh += data[baseId]['Attendance'].filter((item)=>  item.fields['Car Number'] == myArray[i].carno && item.fields['Doctor']== 3).length;              
       myArray[i].doctor.cl += data[baseId]['Attendance'].filter((item)=>  item.fields['Car Number'] == myArray[i].carno && item.fields['Doctor']== 9).length;              
      // Example for paravet:
      myArray[i].paravet.p += data[baseId]['Attendance'].filter(item => item.fields['Car Number'] == myArray[i].carno && item.fields['Assistant'] == 1).length;
      myArray[i].paravet.a += data[baseId]['Attendance'].filter(item => item.fields['Car Number'] == myArray[i].carno && item.fields['Assistant'] == 0).length;
      myArray[i].paravet.wo += data[baseId]['Attendance'].filter(item => item.fields['Car Number'] == myArray[i].carno && item.fields['Assistant'] == 2).length;
      myArray[i].paravet.lh += data[baseId]['Attendance'].filter(item => item.fields['Car Number'] == myArray[i].carno && item.fields['Assistant'] == 3).length;
      myArray[i].paravet.cl += data[baseId]['Attendance'].filter(item => item.fields['Car Number'] == myArray[i].carno && item.fields['Assistant'] == 9).length;

      // Similarly for driver:
      myArray[i].driver.p += data[baseId]['Attendance'].filter(item => item.fields['Car Number'] == myArray[i].carno && item.fields['Driver'] == 1).length;
      myArray[i].driver.a += data[baseId]['Attendance'].filter(item => item.fields['Car Number'] == myArray[i].carno && item.fields['Driver'] == 0).length;
      myArray[i].driver.wo += data[baseId]['Attendance'].filter(item => item.fields['Car Number'] == myArray[i].carno && item.fields['Driver'] == 2).length;
      myArray[i].driver.lh += data[baseId]['Attendance'].filter(item => item.fields['Car Number'] == myArray[i].carno && item.fields['Driver'] == 3).length;
      myArray[i].driver.cl += data[baseId]['Attendance'].filter(item => item.fields['Car Number'] == myArray[i].carno && item.fields['Driver'] == 9).length;
      
      myArray[i].totalnewtickets += sum(data[baseId]['Ticket Detail'].filter(item => item.fields['Car Number'] == myArray[i].carno ), 'New Ticket');
      myArray[i].totalattended += sum(data[baseId]['Ticket Detail'].filter(item => item.fields['Car Number'] == myArray[i].carno ), 'Attended Ticket');
      myArray[i].amountcollected += sum(data[baseId]['Collection'].filter(item => item.fields['Car Number'] == myArray[i].carno ), 'Collected');
      myArray[i].tobedeposited += sum(data[baseId]['Collection'].filter(item => item.fields['Car Number'] == myArray[i].carno ), 'ToBeDeposited');
  
  
    }
}

       
           for(let j = 0 ; j< myArray.length; j++ ) {
                const row = document.createElement('tr');

           // Create and append cells to the row (adjust based on your record structure)
        const cellVehicleNumber = document.createElement('td');
        cellVehicleNumber.textContent = myArray[j].vehicleno;
        row.appendChild(cellVehicleNumber);

        const cellLocation = document.createElement('td');
        cellLocation.textContent = myArray[j].location;
        row.appendChild(cellLocation);

        // Doctor cells
        const cellDoctorP = document.createElement('td');
        cellDoctorP.textContent = myArray[j].doctor.p;
        row.appendChild(cellDoctorP);

        const cellDoctorA = document.createElement('td');
        cellDoctorA.textContent = myArray[j].doctor.a;
        row.appendChild(cellDoctorA);

        const cellDoctorWO = document.createElement('td');
        cellDoctorWO.textContent = myArray[j].doctor.wo;
        row.appendChild(cellDoctorWO);

        const cellDoctorLH = document.createElement('td');
        cellDoctorLH.textContent = myArray[j].doctor.lh;
        row.appendChild(cellDoctorLH);

        const cellDoctorCL = document.createElement('td');
        cellDoctorCL.textContent = myArray[j].doctor.cl;
        row.appendChild(cellDoctorCL);

        // Paravet cells
        const cellParavetP = document.createElement('td');
        cellParavetP.textContent = myArray[j].paravet.p;
        row.appendChild(cellParavetP);

        const cellParavetA = document.createElement('td');
        cellParavetA.textContent = myArray[j].paravet.a;
        row.appendChild(cellParavetA);

        const cellParavetWO = document.createElement('td');
        cellParavetWO.textContent = myArray[j].paravet.wo;
        row.appendChild(cellParavetWO);

        const cellParavetLH = document.createElement('td');
        cellParavetLH.textContent = myArray[j].paravet.lh;
        row.appendChild(cellParavetLH);

        const cellParavetCL = document.createElement('td');
        cellParavetCL.textContent = myArray[j].paravet.cl;
        row.appendChild(cellParavetCL);

        // Driver cells
        const cellDriverP = document.createElement('td');
        cellDriverP.textContent = myArray[j].driver.p;
        row.appendChild(cellDriverP);

        const cellDriverA = document.createElement('td');
        cellDriverA.textContent = myArray[j].driver.a;
        row.appendChild(cellDriverA);

        const cellDriverWO = document.createElement('td');
        cellDriverWO.textContent = myArray[j].driver.wo;
        row.appendChild(cellDriverWO);

        const cellDriverLH = document.createElement('td');
        cellDriverLH.textContent = myArray[j].driver.lh;
        row.appendChild(cellDriverLH);

        const cellDriverCL = document.createElement('td');
        cellDriverCL.textContent = myArray[j].driver.cl;
        row.appendChild(cellDriverCL);
       
        const cellnewticket = document.createElement('td');
        cellnewticket.textContent = myArray[j].totalnewtickets;
        row.appendChild(cellnewticket);
        const cellattended = document.createElement('td');
        cellattended.textContent = myArray[j].totalattended;
        row.appendChild(cellattended);

       const cellcollected = document.createElement('td');
cellcollected.textContent = `₹ ${myArray[j].amountcollected}`;
row.appendChild(cellcollected);

const celltobedeposited = document.createElement('td');
celltobedeposited.textContent = `₹ ${myArray[j].tobedeposited}`;
row.appendChild(celltobedeposited);

        // Append the row to the table body
        recordsBody.appendChild(row);
    }
}

// Function to show loading buffer
function showDataLoader() {
    document.getElementById('loader').style.display = 'block';
}
// Function to hide loading buffer
function hideDataLoader() {
    document.getElementById('loader').style.display = 'none';
}