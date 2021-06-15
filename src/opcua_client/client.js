const { 
    OPCUAClient, 
    TimestampsToReturn,
    ClientMonitoredItemGroup } = require("node-opcua");
const chalk = require("chalk");
const { getFileName, writeCsvFile } = require('../csv/csv_writer.js');

//trigger variabel for wrtiting to the csv file
let onSwitchL = false;
let onSwitchR = false;

//the index of the variables for the csv file
let indexL = 0;
let indexR = 0;

//the variable for the name of the file
let fileNameL = '';
let fileNameR = '';

const opcSubCli = async (variables, params, endpoint, limit) => {
    try{
        const client = OPCUAClient.create({
            endpointMustExist: false
        });

        //client on trying to reconnect
        client.on("backoff", (retryCount, delay) => {
            console.log(chalk.inverse.redBright(`
                Client is trying to connect to
                ${endpoint},
                retry count: ${retryCount},
                delay: ${delay} ms
            `));
        });

        client.on("connected", () => {
            console.log(chalk.inverse.blueBright("Client connected"));
        })
        //connecting to the endpoint
        await client.connect(endpoint);
        
        //create a session
        const session = await client.createSession();
        console.log(chalk.inverse.greenBright(`session name ${session.name}`));
        

        //ENDPOINTS
        // const endpoints = await client.getEndpoints();
        // endpoints.forEach((end) => {
        //     console.log(end.endpointUrl);
        //     console.log(end.server.applicationName);
        // });

        //---------------------------------------------------
        //----------------------SUBSCRIPTION-----------------
        //---------------------------------------------------
        const subscription = await session.createSubscription2({
            maxNotificationsPerPublish: 1000,
            publishingEnabled: true,
            requestedLifetimeCount: 100,
            requestedMaxKeepAliveCount: 10,
            requestedPublishingInterval: 100,
        });

        const monitoredItemGroup = ClientMonitoredItemGroup.create(
            subscription,
            variables,
            params,
            TimestampsToReturn.Both
        );

        monitoredItemGroup.on("changed", (monitoredItem, data, index) => {

            switch(index) {
                case 1:
                    if(data.value.value){
                        onSwitchL = true;
                    } 
                    else{
                        onSwitchL = false;
                        indexL = 0;
                    }   
                    break;
                case 0:
                    if(onSwitchL) {
                        if(indexL === 0) {
                            fileNameL = getFileName('Left','Left');
                        }
                        if(indexL > limit) {
                            indexL = 0;
                        }
                        else {
                            writeCsvFile(fileNameL, indexL, data.value.value, new Date().toISOString());
                            indexL++;
                        }
                    }
                    break;
                case 3:
                    if(data.value.value) {
                        onSwitchR = true;
                    } 
                    else{
                        onSwitchR = false;
                        IndexR = 0;
                    }
                    break;
                case 2:
                    if(onSwitchR) {
                        if(indexR === 0) {
                            fileNameR = getFileName('Right','Right');
                        }
                        if(indexR > limit) {
                            indexR = 0;
                        }
                        else {
                            writeCsvFile(fileNameR, indexR, data.value.value, new Date().toISOString());
                            indexR++;
                        }
                    }                  
                    break;
            };  
        })

        //exit the process
        process.on('SIGINT', async () => {
            await subscription.terminate();

            await session.close();
            await client.disconnect();
            console.log("Closing time");
        });
    }
    catch(err){
        console.log(err);
    };
};

module.exports = {
    opcSubCli
}


