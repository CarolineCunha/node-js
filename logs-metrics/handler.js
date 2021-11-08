const AWS = require('aws-sdk');

const cloudwatchlogs = new AWS.CloudWatchLogs()
const cloudwatch = new AWS.CloudWatch()
const logGroupName = process.env.LOG_GROUP_NAME
const queryString = `fields @timestamp,  @message
                      | filter @message like /INFO/
                      | parse @message "INFO" as info
                      | stats count(info)/2 as result`
console.log(logGroupName)
//logGroupName.split(',')
console.log(logGroupName)

module.exports.log = async (event, context) => {
  const endTime = Math.floor(new Date().getTime() / 1000)
  const startT = endTime - (60 * 60)
  console.log(endTime)
  console.log(startT)

  const paramsStartQuery = {
    endTime: endTime,
    logGroupName,
    queryString,
    startTime: startT,
    limit: 1,
  }

  try {
    const data = await cloudwatchlogs.startQuery(paramsStartQuery).promise()
    var queryResults
    const status = ''

    while (!['Complete', 'Failed', 'Cancelled'].includes(status)) {
      queryResults = await cloudwatchlogs.getQueryResults({ queryId: data.queryId }).promise().catch((err) => {
        console.log(err)
        return { status: 'Failed' }
      })
      var { status } = queryResults
      console.log(status)
    }

    if (status === 'Complete') {
      const metrics = [{
        MetricName: '% of Success1',
        Value: queryResults.results[0][0].value
      }]

      const paramsPutMetricData = {
        MetricData: metrics,
        Namespace: 'teste-caroline'
      }
      await cloudwatch.putMetricData(paramsPutMetricData).promise().catch((err) => {
        console.log(err)
      })
      console.log('oi')
      console.log(queryResults.statistics)
      console.log(JSON.stringify(queryResults))
      console.log(`Query ${queryResults.results[0][0].value}`)
      return queryResults.results[0][0].value
    }
    else {
      console.log('Query failed')
      return `Query ${data.queryId} failed:\n${queryString}`
    }
  }
  catch (err) {
    console.log(err)
  }
}