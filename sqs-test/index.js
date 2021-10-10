var AWS = require('aws-sdk');

require('dotenv').config()

var queueUrl = process.env.AWS_QUEUE_URL;

const sqs = new AWS.SQS({
  region: 'us-east-1'
});
msg = "Caroline";
const sendMessage = async (msg, queueUrl) => {
    
  try {
    const params = {
      MessageBody: JSON.stringify(msg),
      QueueUrl: queueUrl,
      MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
      MessageGroupId: "1",  // Required for FIFO queues
    };
    const res = await sqs.sendMessage(params).promise();
    console.log(res)
    return res;
  } catch (err) {
    console.log('Error:', `failed to send message ${err}`);
    throw new Error(err);
  }
};

module.exports = sendMessage;
sendMessage(msg,queueUrl);