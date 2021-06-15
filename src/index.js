const  { opcSubCli } = require('./opcua_client/client.js');

const port = 4840;
const endpointUri = `opc.tcp://192.168.0.190:${port}`;
const valuesInFile = 500;

const itemsMonitor = [
    {
        nodeId: "ns=6;s=::AsGlobalPV:gi" //0 - measured value for left side
    },{
        nodeId: "ns=6;s=::AsGlobalPV:k"  //1 - trigger value for measuring for left side
    },{
        nodeId: "ns=6;s=::AsGlobalPV:gj"  //2 - measured value for right side
    },{
        nodeId: "ns=6;s=::AsGlobalPV:l"  //3 - trigger value for measuring for right side
    }
];

const parameters = {
    discardOldest: true,
    queueSize: 10,
    samplingInterval: 100
};

opcSubCli(itemsMonitor, parameters, endpointUri, valuesInFile);