const { 
    OPCUAClient, 
    TimestampsToReturn,
    ClientMonitoredItemGroup } = require("node-opcua");
const chalk = require("chalk");

const port = 4840;
const endpointUri = `opc.tcp://192.168.0.190:${port}`;
let onSwitch = false;

(async () => {
    try{
        const client = OPCUAClient.create({
            endpointMustExist: false
        });

        //client on trying to reconnect
        client.on("backoff", (retryCount, delay) => {
            console.log(chalk.redBright(`
                Client is trying to connect to
                ${endpointUri},
                retry count: ${retryCount},
                delay: ${delay} ms
            `))
        });

        //connecting to the endpoint
        await client.connect(endpointUri);

        //event on connecting to the server
        client.on("connected", () => {
            console.log(chalk.greenBright(`Connected to the server: ${endpointUri}`));
        });

        //create a session
        const session = await client.createSession();
        console.log(`session name ${session.name}`);

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

        const parameters1 = {
            discardOldest: true,
            queueSize: 10,
            samplingInterval: 100
        };

        const itemsMonitor = [
            {
                nodeId: "ns=6;s=::AsGlobalPV:gi"
            },{
                nodeId: "ns=6;s=::AsGlobalPV:k"
            }
        ];

        const monitoredItemGroup = ClientMonitoredItemGroup.create(
            subscription,
            itemsMonitor,
            parameters1,
            TimestampsToReturn.Both
        );

        monitoredItemGroup.on("changed", (monitoredItem, data, index) => {
            switch(index) {
                case 1:
                    data.value.value ? onSwitch = true : onSwitch = false;
                    break;
                case 0:
                    if(onSwitch) {
                        console.log(data.value.value);
                        console.log(data.sourceTimestamp.toISOString());
                    }
            };  
        })

        //exit the process
        process.on('SIGINT', async () => {
            await item1.terminate();
            await subscription.terminate();

            await session.close();
            await client.disconnect();
            console.log("Closing time");
        })
    }
    catch(err){
        console.log(err);
    }
})();


