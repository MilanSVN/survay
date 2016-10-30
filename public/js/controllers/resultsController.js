mApp.controller('resultsController', function($scope,$location,survayService) 
{
	// create a message to display in our view
	$scope.message = 'Dobrodošli!';
	
	survayService.getServiceInfo().then(function(response)
	{
		if(response.data.run)
		{
			$location.path( "/" );
		}

	}).catch(function()
	{
		
	});
	
	
	survayService.getResults().then(function(response)
	{
		//console.log(response.data);
		var ansers = [];
		for(i = 0;i < response.data.survay.rows.length;i++)
		{
			var temp = {};
			temp.quest = response.data.survay.rows[i];
			temp.value = response.data.sum[i];
			ansers.push(temp);
		}
		$scope.ansers = ansers;
		$scope.message = response.data.survay.name;
		$scope.comments = response.data.comments;
	}).catch(
	function(err)
	{
		console.log(err);
	});

	
});

