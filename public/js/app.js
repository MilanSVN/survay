// create the module and name it mApp
var mApp = angular.module('myApp', ['ngRoute']);

// configure our routes
mApp.config(function($routeProvider) 
{
	$routeProvider

		.when('/', {
			templateUrl : 'views/survey.html',
			controller  : 'mainController'
		})

		.when('/admin', {
			templateUrl : 'views/admin.html',
			controller  : 'adminController'
		})
		
		.when('/results', {
			templateUrl : 'views/results.html',
			controller  : 'resultsController'
		})
	
		.otherwise({
			redirectTo: '/'
		});
});



