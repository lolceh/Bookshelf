//Interceptor for auth header
app.factory('APIinterceptor',function() {
	return {	
	    //Add auth header to all requests
	    'request': function(config) {
			config.headers["X-ARC-AUTH"] = "ciC2uBCa37";
			return config;
	    }
	};
});



app.factory('bookFactory', ['$http', '$q', function($http, $q) {
	//Api main url
    var urlApi = "https://frontend-test.si.arctur.net/api/v1/";
    var bookFactory = {};

    //Read all data with promise
    bookFactory.getallData = function () {
    	return $q.all([this.getallBooks(),this.getallAuthors()]).then(function(data){
    			return {"books": data[0], "authors": data[1]};
    	});
    };


    //Read all books
	bookFactory.getallBooks = function () {
	    return $http({
	        method : 'GET',
	        url : urlApi+"book-secured",
		}).then(function (response){
			return response.data.data;
    	});
	};

    //Read all authors
	bookFactory.getallAuthors = function () {
	    return $http({
	        method : 'GET',
	        url : urlApi+"author-secured",
		}).then(function (response){
			return response.data.data;
    	});
	};

	//Read one book by id
	bookFactory.getBook = function (id) {
	    return $http({
	        method : 'GET',
	        url : urlApi+"book-secured/"+id,
		}).then(function (response){
			return response.data.data;
    	});
	};

	//Read one author
	bookFactory.getAuthor = function (id) {
	    return $http({
	        method : 'GET',
	        url : urlApi+"author-secured/"+id,
		}).then(function (response){
			return response.data.data;
    	});
	};

    //Create book
	bookFactory.createBook = function (data) {
	    return $http({
	        method : 'POST',
	        url : urlApi+"book-secured/",
	        data: data,
	        transformRequest: angular.identity,
        	headers: {
            	'Content-Type': undefined
        	}
		}).then(function (response){
			return response;
    	});
	};

    //Create author
	bookFactory.createAuthor = function (data) {
	    return $http({
	        method : 'POST',
	        url : urlApi+"author-secured/",
	        data: data,
        	headers: {
            	'Content-Type': 'application/json'
        	}
		}).then(function (response){
			return response;
    	});
	};


    //Create book
	bookFactory.deleteBook = function (id) {
	    return $http({
	        method : 'DELETE',
	        url : urlApi+"book-secured/"+id,
		}).then(function (response){
			return response;
    	});
	};

    //Create author
	bookFactory.deleteAuthor = function (id) {
	    return $http({
	        method : 'DELETE',
	        url : urlApi+"author-secured/"+id,
		}).then(function (response){
			return response;
    	});
	};

    //Edit book
	bookFactory.editBook = function (data) {
	    return $http({
	        method : 'PUT',
	        url : urlApi+"book-secured",
	        data: data,
        	headers: {
            	'Content-Type': undefined
        	}
		}).then(function (response){
			return response;
    	});
	};


	//Edit author
	bookFactory.editAuthor = function (data) {
	    return $http({
	        method : 'PUT',
	        url : urlApi+"author-secured",
	        data: data,
        	headers: {
            	'Content-Type': 'application/json'
        	}
		}).then(function (response){
			return response;
    	});
	};

    return bookFactory;
}]);
