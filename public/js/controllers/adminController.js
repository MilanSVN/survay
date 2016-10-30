mApp.controller('adminController',function($scope, $location ,survayService) 
{
	$scope.message = "Kreiraj novu akretu!";
	
	//$scope.rows;
	
	survayService.getServiceInfo().then(function(response)
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
	
	
	survayService.getQuestions().then(function(response)
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
		console.log($scope.question);
	if (!~$scope.rows.indexOf($scope.question))
		$scope.rows.push($scope.question);
	else alert("Ovo pitanje vec postoji!");
	$scope.question='';
	}
	
	$scope.runSurvay = function()
	{
		if(!$scope.survayName) return alert("Morate unjeti naziv ankete!");
		if($scope.rows.length === 0 )return alert("Anketa mora imati makar jedno pitanje!");
		//TODO check if rows is empty, if thay bean deleted
		//console.log("test");
		var survay = {name:"prviTest",rows:[]};
		survay.name =  $scope.survayName;
		survay.rows = $scope.rows;
		//console.log(survay);
		survayService.setSurvay(survay).then(function()
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
	
	$scope.stopSurvay = function()
	{
		survayService.stopSurvay().then(function()
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
			console.log($scope.rows);
	};
	
	
});
///////////////////////////////////////////////////////////////////////////
