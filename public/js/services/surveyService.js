mApp.service('surveyService', ['$http', function($http)
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
	
	this.setSurvey = function(survey)
	{
		postBody = 	JSON.stringify(survey);
		//console.log(postBody);
	    return $http.post('/pNewSurvey',postBody);
    };
	
	this.stopSurvey = function()
	{
		return $http.get("/stopSurvey");
	}
	
	this.setAnser = function(anser)
	{
		postBody = 	JSON.stringify(anser);
		//console.log(postBody);
	    return $http.post('/anser',postBody);
    };
	
	
}]
);