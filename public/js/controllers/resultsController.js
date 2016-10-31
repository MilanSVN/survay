mApp.controller('resultsController', function($scope,$location,surveyService) 
{
	// create a message to display in our view
	$scope.message = 'Dobrodošli!';
	
	surveyService.getServiceInfo().then(function(response)
	{
		if(response.data.run)
		{
			$location.path( "/" );
		}

	}).catch(function()
	{
		
	});
	
	
	surveyService.getResults().then(function(response)
	{
		//console.log(response.data);
		var ansers = [];
		for(i = 0;i < response.data.survey.rows.length;i++)
		{
			var temp = {};
			temp.quest = response.data.survey.rows[i];
			temp.value = response.data.sum[i];
			ansers.push(temp);
		}
		$scope.ansers = ansers;
		$scope.message = response.data.survey.name;
		$scope.comments = response.data.comments;
	}).catch(
	function(err)
	{
		console.log(err);
	});

	
});

