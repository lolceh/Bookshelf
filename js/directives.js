//Button for remove
app.directive('removeButton', function(){
	return{
		link: function(scope, element, attr){
			element.css({
				cursor: 'pointer'
			});

			//On click argument function
			element.on('mousedown', function(event){
				scope.funct();
			});
		},

		restrict: 'E',
		scope:{
			funct: '&',
		},
		templateUrl:'./img/remove.svg'
	};
});


//Button for editing
app.directive('settingsButton', function(){
	return{
		link: function(scope, element, attr){
			element.css({
				cursor: 'pointer'
			});

			//On click argument function
			element.on('mousedown', function(event){
				scope.funct();
			});
		},
		restrict: 'E',
		scope:{
			funct: '&',
		},
		templateUrl:'./img/settings.svg'
	};
});


//Button for file uploading
app.directive('fileModel', ['$parse', function ($parse) { 
    return { 
        restrict: 'A', 
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel); 
            var modelSetter = model.assign;		

            //On change update scope model
            element.bind('change', function(){ 
                scope.$apply(function(){
                  modelSetter(scope, element[0].files[0]);
                }); 
            }); 
        }
    }; 
}]);

