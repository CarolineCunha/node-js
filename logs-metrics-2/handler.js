'use strict';
const AWS = require('aws-sdk');
var cloudwatchlogs = new AWS.CloudWatchLogs();
module.exports.hello = async (event) => {

  // Cloudwatch Log Group name
  const logGroupName = '/aws/lambda/logs-metrics-dev-log';
  const timestamp = new Date();

  const params = {
    endTime: timestamp.getTime(),
    queryString: `fields @timestamp,  @message| filter @message like /INFO/| parse @message "INFO" as info| stats count(info)/2 as result`, // Group by Day
    startTime: timestamp.setDate( timestamp.getDate() - 3 ), // Last 3 days
    logGroupName: logGroupName
  };
  
  // 1. Start the query. When we start a query, this returns a queryId for us to use on our next step.
  const data = await cloudwatchlogs.startQuery(params).promise();
  const { queryId } = data;
  console.debug('query id', queryId);

  while (true) {
    
    // 2. Send Insight query to CloudwatchLogs
    const insightData = await cloudwatchlogs.getQueryResults({ queryId })
        .promise();
        console.log(insightData)
    
    // 3. Check if it is available    
    if (Array.isArray(insightData.results) && insightData.status === 'Complete') {
      const insightResult = insightData.results;
      console.log(insightResult)
      
      // Change this line to publish to SNS or send to Slack
      console.log(JSON.stringify(insightResult, null, 4))
      break;
    }
    
    // 4. Otherwise, Wait for 100 ms for insight api result
    await new Promise((resolve, reject) => setTimeout(resolve, 100));
  } 

  return 'ok';
}
