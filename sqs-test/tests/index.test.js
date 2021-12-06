var sendMessage = require('../index');
var AWS = require('aws-sdk');
jest.mock('aws-sdk', () => {
  const SQSMocked = {
    sendMessage: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    SQS: jest.fn(() => SQSMocked)
  };
});

const sqs = new AWS.SQS({
  region: 'us-east-1'
});

describe.only('Test case for SQS SendMessage', () => {
    
  beforeEach(() => {
    (sqs.sendMessage().promise).mockReset();
  });
  it('should return the UserEvent', async () => {
    expect(jest.isMockFunction(sqs.sendMessage)).toBeTruthy();
    expect(jest.isMockFunction(sqs.sendMessage().promise)).toBeTruthy();
  
    /** const actualValue = await sendMessage('testURL', 'data')
    expect(actualValue).toEqual('mocked data');
    expect(sqs.sendMessage).toBeCalledWith({ QueueUrl: expect.anything(), MessageBody: expect.anything(), MessageDeDuplication: expect.anything(), MessageGroupId: expect.anything()})
  **/ });

});

describe.only('Test', () => {
  /**afterAll(() => {
    (sqs.sendMessage().promise).mockReset();
  }); **/
  
  it('should return', async () => {
    
    expect(sqs.sendMessage).toBeCalledWith({ QueueUrl: 'https://sqs.us-east-1.amazonaws.com/328367910941/teste.fifo', MessageDeduplicationId:"TheWhistler", MessageGroupId:'1', MessageBody:'\"Caroline\"' })
  });

});

/**
 * (sqs.sendMessage().promise as jest.MockedFunction<any>).mockResolvedValueOnce('mocked data');
 * const actualValue = await sendMessage('testURL', 'data');
    expect(actualValue).toEqual('mocked data');
    expect(sqs.sendMessage).toBeCalledWith({ QueueUrl: 'https://sqs.us-east-1.amazonaws.com/328367910941/teste.fifo', MessageBody:'\"Caroline\"', MessageDeDuplicationId:"TheWhistler", MessageGroupId:'1' });
    expect(sqs.sendMessage().promise).toBeCalledTimes(1); 
 */