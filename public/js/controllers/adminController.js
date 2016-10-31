mApp.controller('adminController',function($scope, $location ,surveyService) 
{
	$scope.message = "Kreiraj novu akretu!";
	
	//$scope.rows;
	
	surveyService.getServiceInfo().then(function(response)
	{
		if(response.data.admin)
		{
			document.getElementById("nav").style.visibility= "visible";
			//return;
		}
		//console.log("Pokrenuta anketa: " + response.data.run);
		if(response.data.run)
		{
			$scope.sRuning = true;
			$scope.message = "Anketa se izvodi!";
		}

	}).catch(function()
	{
		
	});
	
	
	surveyService.getQuestions().then(function(response)
	{
		//console.log(angular.toJson(response.data.rows));
		$scope.rows = response.data.rows;
	}).catch(
	function(err)
	{
		console.log(err);
	});
  
	$scope.addRow = function() 
	{
		if(!$scope.question) return;
		//console.log($scope.question);
	if (!~$scope.rows.indexOf($scope.question))
		$scope.rows.push($scope.question);
	else alert("Ovo pitanje vec postoji!");
	$scope.question='';
	}
	
	
	$scope.runSurvey = function()
	{
		if(!$scope.surveyName) return alert("Morate unjeti naziv ankete!");
		if($scope.rows.length === 0 )return alert("Anketa mora imati makar jedno pitanje!");
		//console.log("test");
		var survey = {name:"prviTest",rows:[]};
		survey.name =  $scope.surveyName;
		survey.rows = $scope.rows;

		for(i = 0;i < survey.rows.length;i++)
		{
			if(survey.rows[i] == null)
			{
				alert("Nije dozvoljeno postavljati prazna pitanja! " + Number(Number(i)+Number(1)) + ". pitanje je prazno.");
				return;
			}
			if(survey.rows.indexOf(survey.rows[i]) != i)
			{
				alert("Nije dozvoljeno unositi ista pitanja!");
				return;
			}
		}
		//console.log($scope.rows);
		surveyService.setSurvey(survey).then(function()
		{
			//TODO zamrzni kreiranje nove akete i omoguci zaustavljanje ankete
			$scope.sRuning = true;
			$scope.message = "Anketa se izvodi!";
		}).catch(function(err)
		{
			alert("Desila se greska! Provjerite server!");
			console.log(err);
		});
	}
	
	$scope.stopSurvey = function()
	{
		surveyService.stopSurvey().then(function()
		{
			$location.path( "/results" )
		}).catch(function(err)
		{
			alert("Desila se greska! Provjerite server!");
			console.log(err);
		});
	}
	
	$scope.removeRow = function(name){				
		var pom = $scope.rows.indexOf(name);
		$scope.rows.splice( pom, 1 );
			//console.log($scope.rows);
	};
	
	
});
///////////////////////////////////////////////////////////////////////////
