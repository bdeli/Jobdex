'use strict';

var app = angular.module('jobdex_app', ['ngCookies']);

app.controller('UserController', function($scope, $http) {
	this.user = {};

	this.sign_up = function(){		
		//Modeled off of http://tutorials.jenkov.com/angularjs/ajax.html
		$scope.myData = JSON.stringify({user: this.user.username, password: this.user.password, email: this.user.email});
		
		var responsePromise = $http.post(dummyURL.herokuapp.com/UserModel/sign_up, $scope.myData);

		responsePromise.success(function(data, status headers, config) {
			dummyUsers.push(this.user);
			this.user = {};
		});

		responsePromise.error(function(data, status headers, config) {
			//add error handling function
		});
	};

	this.login = function(){
		//Modeled off of http://tutorials.jenkov.com/angularjs/ajax.html
		$scope.myData = JSON.stringify({user: this.user.username, password: this.user.password});
		
		var responsePromise = $http.post(dummyURL.herokuapp.com/UserModel/login, $scope.myData);

		responsePromise.success(function(data, status headers, config) {
			//add success result
		});

		responsePromise.error(function(data, status headers, config) {
			//add error handling function
		});
	};

	this.logout = function(){
		this.user = {};
		
		$scope.myData = JSON.stringify({user: this.user.username, password: this.user.password}); //SEND COOKIES AS WELL
		
		var responsePromise = $http.post(dummyURL.herokuapp.com/UserModel/login, $scope.myData);

		responsePromise.success(function(data, status headers, config) {
			//add success result
		});

		responsePromise.error(function(data, status headers, config) {
			//add error handling function
		});

		//Add navigation for HTML
		//Save cookies to the backend
	}


});

app.controller('CardController', ['$http', function($http){

	this.add_tag = function(tagName){
		

		$http.post('/add-tags.json', {tagName: tagName}).success(function(data){
			this.tags.push(tagName);
		});

		$http.post('/add-tags.json', {tagName: tagName}).error(function(data){
			//Handle error
		});

	};

	this.modify_tag = function(currentTagName, newTagName){

		this.currentTagIndex = this.tags.indexOf(currentTagName);

		$http.post('/modify-tag.json', {currentTagName: 'currentTagName', newTagName: newTagName}).success(function(data){
			this.tags.splice(this.currentTagIndex, 1);
			this.tags.push(tagName);
		});

		$http.post('/add-tags.json', {tagName: tagName}).error(function(data){
			//Handle error
		});

	};

	this.get_tags = function(tagName){


		$http.get('/get-tags.json').success(function(data){
			//LOG??
		});

		$http.post('/get-tags.json').error(function(data){
			//Handle error
		});

	};

	this.remove_tag = function(cardId, tagName){

		this.tagIndex = this.tags.indexOf(tagName);

		$http.post('/modify-tag.json', {currentTagName: currentTagName, newTagName: newTagName}).success(function(data){
			this.tags.splice(this.tagIndex, 1);
		});

		$http.post('/add-tags.json', {tagName: tagName}).error(function(data){
			//Handle error
		});

	};

	this.create_card = function(companyName, jobTitle, status){
	

		$http.post('/create-card.json', {companyName: companyName, jobTitle: jobTitle, status: status}).success(function(data){
		});

		$http.post('/add-tags.json', {tagName: tagName}).error(function(data){
			//Handle error
		});

	};

	this.modify_card_status = function(cardId, updatedStatus){

		$scope.myData = JSON.stringify({card_id: cardId, status: updatedStatus});
		var responsePromise = $http.post('/modify_card_status/json', $scope.myData);
		
		responsePromise.success(function(data, status, headers, config) {
			//add success result
		});

		responsePromise.error(function(data, status headers, config) {
			//add error handling function
		});		

	};

	this.get_user_cards = function(user){
		$scope.myData = JSON.stringify({username: user});
		var responsePromise = $http.get('/get_user_cards.json', $scope.myData);

		responsePromise.success(function(data, status, headers, config) {

		});

		responsePromise.error(function(data, status, headers, config){


		});
	};

}]);

app.controller('DocumentController', ['$scope', '$http', function($scope, $http) {
	
	$scope.upload_document = function(user, PDFdoc){
		$scope.myData = JSON.stringify({username: user, PDF: PDFdoc});
		var responsePromise = $http.post('/upload_document.json', $scope.myData);

		responsePromise.success(function(data, status, headers, config) {

		});

		responsePromise.error(function(data, status, headers, config){


		});
	};

	$scope.remove_document = function(doc_id){
		$scope.myData = JSON.stringify({username: user, docId: doc_id});
		var responsePromise = $http.post('/remove_document.json', $scope.myData);

		responsePromise.success(function(data, status, headers, config) {

		});

		responsePromise.error(function(data, status, headers, config){


		});
	};

	$scope.get_documents = function(user_id){
		$scope.myData = JSON.stringify({userId: user_id});
		var responsePromise = $http.get('/get_documents.json', $scope.myData);

		responsePromise.success(function(data, status, headers, config) {

		});

		responsePromise.error(function(data, status, headers, config){


		});
	};

});

var dummyUsers = [{
	username: 'seth',
	password: 'hello',
	email: 'sethanderson@berkeley.edu',
	id: 1234
}, {
	username: 'yaxin',
	password: 'goodbye',
	email: 'yaxin.t@berkeley.edu',
	id: 5678
}];

var dummyCards = [{
	companyName: 'Uber',
	jobTitle: 'Software Engineer',
	status: 0,
	tags: [
	'backend',
	'SF',
	'python'
	]
	id: 9999
}, {
	companyName: 'Uber',
	jobTitle: 'Sales Assistant',
	status: 1,
	tags: [
	'client-side',
	'SF',
	'low salary'
	]
	id: 5555
}, {
	companyName: 'Google',
	jobTitle: 'Software Engineer',
	status: 1,
	tags: [
	'frontend',
	'Mountain View',
	'good culture'
	]
	id: 3333
}];
