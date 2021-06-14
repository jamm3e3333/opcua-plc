const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");

const csvPath = path.join(__dirname, "./file.csv");

const csvWriter = createCsvWriter({
    path: csvPath,
    header: [
        {id: 'i', title: 'INDEX'},
        {id: 'value', title: 'VALUE'}
    ]
});

const records = [
    {i: 0, value: 23 },
    {i: 1, value: 24 }
]

const getData = async () => {
    try{
        const data = await csvWriter.writeRecords(records);
        console.log(data);
    }
    catch(err){
        console.log(err);
    }
};

getData();
