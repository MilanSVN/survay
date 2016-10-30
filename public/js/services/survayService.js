mApp.service('survayService', ['$http', function($http)
{


    this.getQuestions = function()
	{
	    return $http.get("/questions");
    };
	this.getQuestions1 = function()
	{
	    return $http.get("/questions");
    };
	
	this.getServiceInfo = function()
	{
		return $http.get("/serviceInfo");
	}
	
	this.getResults = function()
	{
		return $http.get("/results");
	}
	
	this.setSurvay = function(survay)
	{
		postBody = 	JSON.stringify(survay);
		//console.log(postBody);
	    return $http.post('/pNewSurvay',postBody);
    };
	
	this.stopSurvay = function()
	{
		return $http.get("/stopSurvay");
	}
	
	this.setAnser = function(anser)
	{
		postBody = 	JSON.stringify(anser);
		//console.log(postBody);
	    return $http.post('/anser',postBody);
    };
	
	
}]
);