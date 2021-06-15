const {writeFileSync, appendFileSync } = require("fs");
const path = require("path");
const chalk = require("chalk");
//creating a file name
const getFileName = (subfolder, side) => {
    const s = new Date().getSeconds();
    const m = new Date().getMinutes();
    const h = new Date().getHours();
    const month = new Date().getMonth() + 1;
    const d = new Date().getUTCDate();
    const y = new Date().getFullYear();

    const csvPath = `${subfolder}/${month}_${d}_${y}_${h}_${m}_${s}mqbData${side}.csv`;
    return csvPath;
};
//writing into a created file
const writeCsvFile = (name, i, value, timestamp) => {
    //stringifying the data for a csv file
    let indexStr = JSON.stringify(i);
    let valueStr = JSON.stringify(value);
    let timestampStr = JSON.stringify(timestamp);
    
    let strStr = `${indexStr}, ${valueStr}, ${timestampStr}\n`;

    if(!i) {
        //when index is 0 creating a header of the csv file
        writeFileSync(path.join(__dirname, '../../CSVdata/' + name), `i, value, timestamp\n`);
        console.log('The file with the name: ', chalk.inverse.blueBright(name.split("/")[1]), 'was created.');
    }
    //appending data to a csv file
    appendFileSync(path.join(__dirname, '../../CSVdata/' + name), strStr);
}

module.exports = {
    getFileName,
    writeCsvFile
};