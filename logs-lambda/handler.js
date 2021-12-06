const AWS = require('aws-sdk');

var cloudwatchlogs = new AWS.CloudWatchLogs();

const logTeste = () => {

  const logGroupName = '/aws/lambda/logs-metrics-dev-log'.split(',');
  const queryString = 'fields @timestamp,  @message| filter @message like /INFO/| parse @message "INFO" as info| stats count(info)/2 as result';
  const endTime = Math.floor(new Date().getTime() / 1000);
  const startTime = endTime - (12 * 60);
    const params = {
        endTime: endTime, 
        startTime: startTime,
        queryString: queryString,
        logGroupName: logGroupName
    };

    console.log("Running query with params", params);

    return new Promise((resolve, reject) => {
        cloudwatchlogs.startQuery(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(`Query started with id ${data.queryId}, getting results...`);

                const queryResultsParams = {
                    queryId: data.queryId
                }

                const fetchQueryResult = () => {
                    cloudwatchlogs.getQueryResults(queryResultsParams, function(err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            // if the query hasn't ended, retry result fetching...
                            if (data.status != "Complete") {
                                console.log("Fetching query results, current status", data.status);
                                setTimeout(fetchQueryResult, 500);
                                return;
                            }
                            
                            let results = data.results;
                            try {
                                // if defined, a chain of configurable processors can be specified
                                processors.forEach(processFn => {
                                    results = processFn(results)
                                })
                            } catch (e) {
                                console.log("Error when post-processing result", e)
                                reject(e)
                            }
                            resolve(results);
                        }   
                    });
                }

                setTimeout(fetchQueryResult, 500);
            }
        });
    })

}

module.exports.logTeste = logTeste