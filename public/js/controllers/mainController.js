mApp.controller('mainController', function($scope,$location,surveyService) 
{
	// create a message to display in our view
	$scope.message = 'Dobrodošli!';
	$scope.admin = true;
	
	surveyService.getServiceInfo().then(function(response)
	{
		if(response.data.admin)
		{
			document.getElementById("nav").style.visibility= "visible";
			//return;
		}
		//console.log("Pokrenuta anketa: " + response.data.run);
		if(!response.data.run)
		{
			$location.path( "/results" );
		}
		
		
		
	}).catch(function()
	{
		
	});
//ako napravim od ovoga svega funkciju koja se poziva iz surveyService.getServiceInfo() nece radi.
		surveyService.getQuestions1().then(function(response)
		{
			var questions = [];
			for(i = 0;i < response.data.rows.length;i++)
			{
				var temp = {};
				temp.quest = response.data.rows[i];
				temp.value = "3";
				questions.push(temp);	
			}
			$scope.questions = questions;
			//console.log(questions);
			$scope.message = response.data.name;
		}).catch(function(err)
		{
			console.log(err);
		});

	

	
	$scope.submitSurvey = function()
	{
		$scope.submitBtn = true;
		//console.log("Submit disabled:" + $scope.submitBtn);
		var ansers = [];
		for (i = 0;i < $scope.questions.length;i++)
		{
			ansers.push($scope.questions[i].value);
		}
		ansers.push($scope.comment);
		//console.log(ansers);
		
		surveyService.setAnser(ansers).then(function(res)
		{
			//TODO refresh page - on server should be seted that survey is anserd
			//console.log(res.data.status);
			
			if(!res.data.status)
			{
				alert("Već ste predali anketu! Anketu je moguće predati samo jednom!");
			}
		}).catch(function()
		{
			alert("Desila se greska! Provjerite server!");
		});
	}
	
});

