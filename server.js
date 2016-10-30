var express = require('express');

var fs = require("fs");

var app = express();

//TODO service info{admin,survayRuning}

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var ansers = [];
var clientsWhoAnswered = [];

var survayRuning = false;


app.use(express.static('public'));
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
});

//TODO make asynchronous function like in survayService
getSurvays = function(callback)
{
	return fs.readFile('survays.json',callback);
}

getAnsers = function(callback)
{
	return fs.readFile('ansers.json',callback);
}

app.get('/questions', function (req, res) {
	getSurvays(function (err, data) 
	{
	   if (err) {
		  res.end(JSON.stringify(err));//MB
		  return console.error(err);
	   }
		var survaysData = JSON.parse(data);
		res.end(JSON.stringify(survaysData.survays[survaysData.survays.length - 1]));
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
	serviceInfo.run = survayRuning;
	//console.log(JSON.stringify(serviceInfo.admin));
	res.end(JSON.stringify(serviceInfo));
});

app.get('/stopSurvay', function (req, res) {
	var jsonMsg = {};
	//TODO add checking isAdmin
	survayRuning = false;
	var curentResults = {};
	
	getSurvays(function (err, data,getAnsers) 
	{
	   if (err) {
		  res.end(JSON.stringify(err));//MB
		  return console.error(err);
	   }
	var survaysData = JSON.parse(data);
	curentResults.survay = survaysData.survays[survaysData.survays.length - 1];
	//console.log(curentResults.survay);
	
	var sum =  [];
	sum[0] = Number(0);
	var comments = [];
	comments[0] = "";
	for(i = 0;i <curentResults.survay.rows.length;i++)
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
		comments[j] = (ansers[j][curentResults.survay.rows.length]);	
		//console.log("KOMENTAR : " + ansers[j][curentResults.survay.rows.length]);
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
	   
			survayRuning = false;
			clientsWhoAnswered = [];
			ansers = [];
			jsonMsg.status = true;
			res.json(jsonMsg);
			return res.end();
		
	});
		
	//res.end();
});

app.post('/pNewSurvay', function (req, res) {
	var jsonMsg = {};
	if(survayRuning)
	{
		jsonMsg.status = false;
		res.json(jsonMsg);
		return res.end();
	}
	getSurvays(function (err, data) 
	{
	   if (err) {
			console.log(JSON.stringify(err));//MB
			jsonMsg = false;
			res.json(jsonMsg);
			return res.end();
	   }
		survaysData = JSON.parse(data);
		var newSurvay = req.body;
		survaysData.survays.push(newSurvay);
		//console.log(JSON.stringify(survaysData.survays));
		
		fs.writeFile('survays.json', JSON.stringify(survaysData),  function(err) 
		{
			if (err) {
				console.log(JSON.stringify(err));//MB
				jsonMsg = false;
				res.json(jsonMsg);
				return console.error(err);
			}
		});
   
		survayRuning = true;
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