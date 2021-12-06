const queue =require('../producer');
var AWS = require('aws-sdk')
// test code
const AWSMock = require('aws-sdk-mock');

AWSMock.setSDKInstance(AWS);

test('sendMessage', async () => {
    AWS.mock('SQS', 'sendMessage', (params, callback) => {
        return { MessageId: 1 };
    })
 
    const result = await queue.sendMessage({ message: 'text' });
    expect(result).toBeTruthy();
 
    AWS.restore('SQS', 'sendMessage');
})