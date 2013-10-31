function keyCtrl(){

}

function MainCtrl($scope){
	$scope.filter = new Array();
    $scope.keywords = new Array();


        // Create a counter variable
        var i = 0;
        // Create the empty keyword array
        keywords = new Array();
        $scope.showKeywords = function(){
            document.getElementById('keywordDisplay').style.visibility = "visible";
            var locationInput = document.getElementById('locationSearch').value;            
            var keywordInput = document.getElementById('keywordSearch').value
            var wordList = document.getElementById('words');
            // create second array for the new keywords
            var newkeywords = new Array();
            // Separate the keywords 
            newkeywords = keywordInput.split(' ');
            // Append all keywords into the original array
            $scope.keywords = keywords.concat(newkeywords);
            console.log($scope.keywords)

        }

}