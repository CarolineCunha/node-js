// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const { sendMessage } = require('./sqsClient');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
var queue = process.env.AWS_QUEUE_URL;

var params = {
   // Remove DelaySeconds parameter and value for FIFO queues
  //DelaySeconds: 10,
  MessageAttributes: {
    "Title": {
      DataType: "String",
      StringValue: "The Whistler"
    },
    "Author": {
      DataType: "String",
      StringValue: "John Grisham"
    },
    "WeeksOn": {
      DataType: "Number",
      StringValue: "6"
    }
  },
  MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
  MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
  MessageGroupId: "1",  // Required for FIFO queues
  QueueUrl: "https://sqs.us-east-1.amazonaws.com/328367910941/teste.fifo"
  
};


sqs.sendMessage(params, function async(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.MessageId);
  }
});
module.exports=sendMessage;