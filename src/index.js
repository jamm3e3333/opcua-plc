const  { opcSubCli } = require('./opcua_client/client.js');

//default port for br opcua server
const port = 4840;
//ip address of the plc
const endpointUri = `opc.tcp://192.168.0.190:${port}`;
//limit of the vars
const valuesInFile = 500;
//variables that are being read from PLC
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
//parameters for opcua communication
//DEF VALUES, shoulnd't be changed
const parameters = {
    discardOldest: true,
    queueSize: 10,
    samplingInterval: 100
};
//calling the function
opcSubCli(itemsMonitor, parameters, endpointUri, valuesInFile);