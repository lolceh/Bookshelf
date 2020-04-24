var app = angular.module("bookbase",["ngRoute", "ui.bootstrap"]);

//Navigation router
app.config(function($routeProvider, $httpProvider){
	
	//Add route provider
	$routeProvider
	.when("/",{
		templateUrl:"./views/main.html"
	})
	.when("/books",{
		templateUrl:"./views/books.html"
	})
	.when("/authors",{
		templateUrl:"./views/authors.html"
	})
	.otherwise({ 
		redirectTo: '/' 
	});

	//Register interceptor
	$httpProvider.interceptors.push('APIinterceptor');
});



//Main controller for all data
app.controller('mainController', ['$scope', '$http', '$uibModal', '$interval','bookFactory', function($scope, $http, $uibModal, $interval, bookFactory) {
	$scope.authors = [];
	$scope.books = [];

	//Read all data to main scope
	$scope.reload = function(){
		bookFactory.getallData().then(function (response) {
			$scope.books = response.books;
			$scope.authors = response.authors;
		}).catch(function(response){
			var error = response.status + " - " + response.data.status;
			console.log("Error when reloading data: " + error);
		});		
	}

	$scope.reload();

	//Interval for reloading data
    $interval($scope.reload, 3000);

	//Confirm popup with body text as input
	$scope.confirmPopup = function(text) {

		return $uibModal.open({
		  templateUrl: "./views/popupConfirm.html",
		  controller: "confirmModalCtrl",
		  size: 'sm',
          resolve: {
	        text: function () {
	          return text;
	        },
	      }
		}).result.then(function(result){
			return result;
		});
	};

}]);




app.controller('booksController', ['$scope', '$http','$uibModal', 'bookFactory', function($scope, $http, $uibModal, bookFactory) {
	
	//Delete selected book
	$scope.deleteBook = function(book){
		
		$scope.confirmPopup("Zbrisem knjigo " + book.title + " ?").then(function(result){
			//Delete if confirmation
			if(result){
				bookFactory.deleteBook(book.id).then(function (response) {
					$scope.error = "";
					$scope.update();
				}).catch(function(response){
					$scope.error = response.status + " - " + response.data.status;
					console.log("Error when deleting book: " + $scope.error);
				});
			}
		});
	}

	//Update books after action
	$scope.update = function (){

		bookFactory.getallBooks().then(function (response) {
			$scope.books = response;
		}).catch(function(response){
			var error = response.status + " - " + response.data.status;
			console.log("Error when updating book after action: " + error);
		});		
	}


	//Call modal addbook popup
	$scope.bookPopup = function(mode, book) {
		var modalInstance =  $uibModal.open({
		  templateUrl: "./views/popupBook.html",
		  controller: "bookModalCtrl",
		  size: 'lg',
          resolve: {
	        mode: function () {
	        	return mode;
	        },
	        authors: function () {
	        	return $scope.authors;
	        },
	        book: function(){
	        	return book;
	        }
	      }
		}).result.then(function(result){
			$scope.update();
			//$scope.books.push(result);
		});
	};
}]);





app.controller('authorsController', ['$scope', '$http','$uibModal', 'bookFactory', function($scope, $http, $uibModal, bookFactory) {
	//Delete selected author
	$scope.deleteAuthor = function(author){
			
			$scope.confirmPopup("Zbrisem avtorja " + author.name + " " + author.surname + " ?").then(function(result){
				//Delete if confirmation on popup
				if(result){
					bookFactory.deleteAuthor(author.id).then(function (response) {
						$scope.error = "";
						$scope.update();
					}).catch(function(response){
						$scope.error = response.status + " - " + response.data.status;
						console.log("Error when deleting author: " + $scope.error);
					});
				}
			});
	}

	$scope.update = function(){
		bookFactory.getallAuthors().then(function (response) {
			$scope.authors = response;
		}).catch(function(response){
			var error = response.status + " - " + response.data.status;
			console.log("Error when updating book after action: " + error);
		});		
	}

	//Call modal addbook popup
	$scope.authorPopup = function(mode, author) {
		var modalInstance =  $uibModal.open({
		  templateUrl: "./views/popupAuthor.html",
		  controller: "authorModalCtrl",
		  size: 'lg',
		  scope: $scope,
          resolve: {
	        mode: function () {
	        	return mode;
	        },
	        author: function(){
	        	return author;
	        }
	      }
		}).result.then(function(result){
			$scope.update();
		});
	};
}]);



//Controler for add/edit book MODAL
app.controller('bookModalCtrl', function($scope, $uibModalInstance, bookFactory, mode ,authors, book) {

  	let edit_mode = mode == 'edit' ? true: false;
  	$scope.book = {};
  	$scope.authors = authors;

  	//Texts for popup with edit/add mode
  	if(edit_mode) {
  		$scope.book = angular.copy(book);
  		$scope.buttonText = "Posodobi"; 
  		$scope.header = "Uredi knjigo";

  		//Fill name of author if in edit mode
  		if($scope.book.author){
	  		for(i = 0; i < authors.length ; i++){
	  			if($scope.book.author.name == authors[i].name && $scope.book.author.surname == authors[i].surname)
	  				$scope.book.selectedAuthor = authors[i].id;
	  		}
  		}

  	}else{
  		$scope.header = "Dodaj knjigo";
  		$scope.buttonText = "Dodaj"; 
  	}

  	$scope.submit = function(){
  		
  		//Check if title is entered
  		if(!$scope.book.title){
  		  	$scope.error = "Prosim vnesi naslov knjige";
  		  	return;
  		}

  		//Create and fill form data
  		var bookData = new FormData();
		
		bookData.append('title', $scope.book.title);
		if($scope.uploadFile)bookData.append('file', $scope.uploadFile);
		if($scope.book.description)	bookData.append('description', $scope.book.description);
		if($scope.book.selectedAuthor) bookData.append('author_id', $scope.book.selectedAuthor);
		if($scope.book.file_id) bookData.append('file_id', $scope.book.file_id);


		//Edit mode post
		if(edit_mode){
			//Update book
			bookData.append('id', $scope.book.id);
			bookFactory.editBook(bookData).then(function (response) {
				console.log("Book succesfully edited");
				$uibModalInstance.close();
			}).catch(function(response){
				console.log("Error when editing book");
				$scope.error = response.status + " - " + response.data.status;
			});

		//Add mode post
		}else{
			//Add book
			bookFactory.createBook(bookData).then(function (response) {
				console.log("Book succesfully added");
				$uibModalInstance.close();
			}).catch(function(response){
				console.log("Error when adding book");
				$scope.error = response.status + " - " + response.data.status;
			});
		}
  	}
   
  	//Cancel button
	$scope.cancel = function(){
		$uibModalInstance.dismiss();
	} 

	//Remove added file button
	$scope.clearFile = function () {
		angular.element("input[type='file']").val(null);
		$scope.uploadFile = null;
	}
  
});


//Controler for add/edit author MODAL
app.controller('authorModalCtrl', function($scope, $uibModalInstance, bookFactory, mode, author) {

  	let edit_mode = mode == 'edit' ? true: false;
  	$scope.author = {};

  	//Texts for popup with edit/add mode
  	if(edit_mode){
  		$scope.author = angular.copy(author);
  		if(author.dateBirth) $scope.author.dateBirth = new Date(author.dateBirth);
  		$scope.buttonText = "Posodobi"; 
  		$scope.header = "Uredi avtorja"
  	}else{
  		$scope.header = "Dodaj avtorja";
  		$scope.buttonText = "Dodaj"; 
  	}

  	//Submit data
	$scope.submit = function(){
		//Check name
  		if(!$scope.author.name){
  		  	$scope.error = "Prosim vnesi ime";
  		  	return;
  		}
  		//Check surname
  		if(!$scope.author.surname){
  		  	$scope.error = "Prosim vnesi priimek";
  		  	return;
  		}  		

  		//Fill data for user
  		var authorData = {
  			"name": $scope.author.name,
  			"surname": $scope.author.surname
  		}

  		//If date is entered change it to proper format
		if($scope.author.dateBirth)
			authorData["dateBirth"] = ($scope.author.dateBirth.getFullYear() + "-"+ ($scope.author.dateBirth.getMonth()+1) + "-" + $scope.author.dateBirth.getDate());


		//Edit mode
		if(edit_mode){
			authorData["id"] = $scope.author.id

			//Update author
			bookFactory.editAuthor(authorData).then(function (response) {
				console.log("Author succesfully edited");
				$uibModalInstance.close();
			}).catch(function(response){
				console.log("Error when editing author");
				$scope.error = response.status + " - " + response.data.status;
			});

		//Add mode
		}else{
			//Add author
			bookFactory.createAuthor(authorData).then(function (response) {
				console.log("Author succesfully added");
				$uibModalInstance.close();
			}).catch(function(response){
				console.log("Error when adding author");
				$scope.error = response.status + " - " + response.data.status;
			});
		}
  }
   
  $scope.cancel = function(){
    $uibModalInstance.dismiss();
  } 
});




//Cofirm modal
app.controller('confirmModalCtrl', function($scope, $uibModalInstance, text) {
  $scope.text = text;

  $scope.submit = function(){
	$uibModalInstance.close(true);
  }
   
  $scope.cancel = function(){
    $uibModalInstance.close(false);
  } 
});

//Filter for date
app.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});


