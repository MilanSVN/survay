var express = require('express');

var fs = require("fs");

var app = express();

//TODO service info{admin,surveyRuning}

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var ansers = [];
var clientsWhoAnswered = [];

var surveyRuning = false;


app.use(express.static('public'));
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
});

//TODO make asynchronous function like in surveyService
getSurveys = function(callback)
{
	return fs.readFile('surveys.json',callback);
}

getAnsers = function(callback)
{
	return fs.readFile('ansers.json',callback);
}

app.get('/questions', function (req, res) {
	getSurveys(function (err, data) 
	{
	   if (err) {
		  res.end(JSON.stringify(err));//MB
		  return console.error(err);
	   }
		var surveysData = JSON.parse(data);
		res.end(JSON.stringify(surveysData.surveys[surveysData.surveys.length - 1]));
	});
});

app.get('/results', function (req, res) {
	fs.readFile('ansers.json',function (err, data) 
	{
	   if (err) {
		  res.end(JSON.stringify(err));//MB
		  return console.error(err);
	   }
	   
	var resultsData = data.toString().split("|!|");
	//console.log("ODGOVORI " + resultsData[resultsData.length - 1] + "++++++++++++++++++++++");
	res.end(resultsData[resultsData.length - 1]);
	});
});

isAdmin = function(req)
{
	var cli = req.connection.remoteAddress;
	if("::1" == cli) return true;
	else return false;
}

app.get('/serviceInfo', function (req, res) {
	
	var serviceInfo = {};
	serviceInfo.admin = isAdmin(req);
	serviceInfo.run = surveyRuning;
	//console.log(JSON.stringify(serviceInfo.admin));
	res.end(JSON.stringify(serviceInfo));
});

app.get('/stopSurvey', function (req, res) {
	var jsonMsg = {};
	//TODO add checking isAdmin
	surveyRuning = false;
	var curentResults = {};
	
	getSurveys(function (err, data,getAnsers) 
	{
	   if (err) {
		  res.end(JSON.stringify(err));//MB
		  return console.error(err);
	   }
	var surveysData = JSON.parse(data);
	curentResults.survey = surveysData.surveys[surveysData.surveys.length - 1];
	//console.log(curentResults.survey);
	
	var sum =  [];
	sum[0] = Number(0);
	var comments = [];
	comments[0] = "";
	for(i = 0;i <curentResults.survey.rows.length;i++)
	{
		sum[i] = Number(0); //:@ 
		for(j = 0;j < ansers.length;j++)
		{
			sum[i] += Number(ansers[j][i]);
			//console.log(sum[i] );

		}

	}

	for(i = 0;i < sum.length;i++)
	{
		sum[i] = sum[i] / ansers.length;
		//console.log(sum);
	}
	
	for(j = 0;j < ansers.length;j++)
	{
		comments[j] = "";
		comments[j] = (ansers[j][curentResults.survey.rows.length]);	
		//console.log("KOMENTAR : " + ansers[j][curentResults.survey.rows.length]);
	}
	
	curentResults.sum = sum;
	curentResults.comments = comments;
	//console.log(curentResults);
		
			fs.appendFile('ansers.json', "|!|" + JSON.stringify(curentResults),  function(err) 
			{
				if (err) {
					console.log(JSON.stringify(err));//MB
					jsonMsg = false;
					res.json(jsonMsg);
					res.end();
					return console.error(err);
				}
			});
	   
			surveyRuning = false;
			clientsWhoAnswered = [];
			ansers = [];
			jsonMsg.status = true;
			res.json(jsonMsg);
			return res.end();
		
	});
		
	//res.end();
});

app.post('/pNewSurvey', function (req, res) {
	var jsonMsg = {};
	if(surveyRuning)
	{
		jsonMsg.status = false;
		res.json(jsonMsg);
		return res.end();
	}
	getSurveys(function (err, data) 
	{
	   if (err) {
			console.log(JSON.stringify(err));//MB
			jsonMsg = false;
			res.json(jsonMsg);
			return res.end();
	   }
		surveysData = JSON.parse(data);
		var newSurvey = req.body;
		surveysData.surveys.push(newSurvey);
		//console.log(JSON.stringify(surveysData.surveys));
		
		fs.writeFile('surveys.json', JSON.stringify(surveysData),  function(err) 
		{
			if (err) {
				console.log(JSON.stringify(err));//MB
				jsonMsg = false;
				res.json(jsonMsg);
				return console.error(err);
			}
		});
   
		surveyRuning = true;
		clientsWhoAnswered = [];
		ansers = [];
		jsonMsg.status = true;
		res.json(jsonMsg);
		return res.end();
	});

	   // console.log("Asynchronous read: " + req.body.name.toString());
	   // res.end("jo");

});

app.post('/anser', function (req, res) {
	var jsonMsg = {};
	var cli = req.connection.remoteAddress;
	
	if (clientsWhoAnswered.indexOf(cli) != -1)
	{
		jsonMsg.status = false;
		res.json(jsonMsg);
		console.log("vec predao anketu!");
		return res.end();		
	}
	clientsWhoAnswered.push(req.connection.remoteAddress);
	ansers.push(req.body);
	//console.log("ANSER: " + JSON.stringify(ansers));
	jsonMsg.status = true;
	res.json(jsonMsg);
	return res.end();

});

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

});