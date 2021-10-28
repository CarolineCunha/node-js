const AWS = require('aws-sdk');

const cloudwatchlogs = new AWS.CloudWatchLogs();
const cloudwatch = new AWS.CloudWatch();
const logGroupNames = '/aws/lambda/logs-metrics-dev-log'.split(',');
const queryString = 'fields @timestamp,  @message| filter @message like /INFO/| parse @message "INFO" as info| stats count(info) as result';
const queryPeriod = 3000;
const queryDelay = 1;
const queryRetry = 10;
let done = false;

function sleep(ms) {
  return x => new Promise(resolve => setTimeout(() => resolve(x), ms));
}

module.exports.log = async(event, context) => {
  const endTime = Math.floor(new Date().getTime() / 1000);
  const startT = endTime - (5 * 60);
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
    let queryResults;
    let status = '';
    while (!['Complete', 'Failed', 'Cancelled'].includes(status)) {
      queryResults = await cloudwatchlogs.getQueryResults({ queryId: data.queryId }).promise().then(sleep(queryRetry)).catch((err) => { console.log(err); return { status: 'Failed' }; });
      ({ status } = queryResults);
      console.log(status);
    }
    if (status === 'Complete') {
      const metrics = [{
        MetricName: 'DSEvent',
        Value: queryResults.statistics.recordsMatched,
        Timestamp: endTime
      }]
      const paramsPutMetricData = {
        MetricData: metrics,
        Namespace: 'DSEvent',
      };
      await cloudwatch.putMetricData(paramsPutMetricData).promise().catch((err) => { console.log(err); });
      return queryResults.statistics.recordsMatched;
    }
    else {
      console.log('Query failed');
      return `Query ${data.queryId} failed:\n${queryString}`;
    }
  }).catch((err) => { console.log(err); });
};