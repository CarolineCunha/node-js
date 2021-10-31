const AWS = require('aws-sdk');

const cloudwatchlogs = new AWS.CloudWatchLogs();
const cloudwatch = new AWS.CloudWatch();
const logGroupNames = '/aws/lambda/logs-metrics-dev-log'.split(',');
const queryString = 'fields @timestamp,  @message| filter @message like /INFO/| parse @message "INFO" as info| stats count(info)/2 as result';
const queryPeriod = 3000;
const queryDelay = 1;
const queryRetry = 10;
let done = false;

function sleep(ms) {
  return x => new Promise(resolve => setTimeout(() => resolve(x), ms));
}

module.exports.log = async(event, context) => {
  const endTime = Math.floor(new Date().getTime() / 1000);
  const startT = endTime - (6 * 60);
  console.log("Asd")
  console.log(endTime)
  console.log(startT)

  const paramsStartQuery = {
    endTime: endTime,
    logGroupNames,
    queryString,
    startTime: startT,
    limit: 1,
  };
  return cloudwatchlogs.startQuery(paramsStartQuery).promise().then(async(data) => {
    var queryResults;
    var status = '';
    while (!['Complete', 'Failed', 'Cancelled'].includes(status)) {
      queryResults = await cloudwatchlogs.getQueryResults({ queryId: data.queryId }).promise().then(sleep(queryRetry)).catch((err) => { console.log(err); return { status: 'Failed' }; });
      ({ status } = queryResults);
      console.log(status);
    }
    if (status === 'Complete') {
      const metrics = [{
        MetricName: '% of Success',
        Value: queryResults.results[0][0].value,
        Timestamp: endTime
      }]
      const paramsPutMetricData = {
        MetricData: metrics,
        Namespace: 'teste-carol',
      };
      await cloudwatch.putMetricData(paramsPutMetricData).promise().catch((err) => { console.log(err); });
      console.log('oi')
      console.log(queryResults.statistics)
      console.log(JSON.stringify(queryResults))
      console.log(queryResults.results[0][0].value)
      return queryResults.results[0][0].value;
    }
    else {
      console.log('Query failed');
      return `Query ${data.queryId} failed:\n${queryString}`;
    }
  }).catch((err) => { console.log(err); });

};