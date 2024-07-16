var myArray = [
    {carno: 1, vehicleno: 'MP-02-ZA-0104', location: 'kesli', p: 0, a:0, wo:0, amount: 0},
    {carno: 2, vehicleno: 'MP-02-ZA-0105', location: 'khurai', p: 0, a:0, wo:0, amount: 0},
    {carno: 3, vehicleno: 'MP-02-ZA-0106', location: 'bina', p: 0, a:0, wo:0, amount: 0},
    
]
for( let i = 0; i < myArray.length; i++){
    //db1 query for carno=myArray[i].carno, fromdate, todate
    //db2 query for carno, fromdate, todate
    //db3 query for carno, fromdate, todate
const arr1 = [{doctor: 1, col1: 'abc', col2: '77'}, {doctor: 1, col1: 'abc', col2: '77'}, {doctor: 0, col1: 'abc', col2: '77'}]
const arr2 = [{doctor: 0, col1: 'abc', col2: '77'}, {doctor: 1, col1: 'abc', col2: '77'}, {doctor: 0, col1: 'abc', col2: '77'}]
const arr3 = [{doctor: 0, col1: 'abc', col2: '77'}, {doctor: 0, col1: 'abc', col2: '77'}, {doctor: 0, col1: 'abc', col2: '77'}]
const p1 = arr1.filter((item)=> item.doctor == 1).length;
const p2 = arr2.filter((item)=> item.doctor == 1).length;
const p3 = arr3.filter((item)=> item.doctor == 1).length;
myArray[i].p = p1+p2+p3;

myArray[i].a = p1+p2+p3;
myArray[i].wo = p1+p2+p3;
myArray[i].amount = p1+p2+p3;
}
//display myArray