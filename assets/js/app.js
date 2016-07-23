var app = angular.module('dashboard', ['chart.js']);

app.controller('main', ['$scope', '$http', function ($scope, $http) {

    $scope.loading = true;
    $scope.charts = [];

    $http({
        method: 'GET',
        url: 'http://localhost:1337/event/find'
    }).then(
        function success(response) {

            buildDoughnutChart(response.data, 'os', 'Visitor OS distribution');
            buildDoughnutChart(response.data, 'browser', 'Visitor Browser distribution');

            $scope.loading = false;

            // start listening for socket messages
            io.socket.on('event', function (event) {
                console.log(event);
            });

        },
        function failure(error) {
            console.log(error);
        }
    );

    function buildDoughnutChart(events, property, title) {

        var prop,
            temp = {},
            data = {
                title: title,
                type: 'doughnut',
                labels: [],
                data: []
            };

        events.forEach(function (event) {
            // build up labels array
            if (data.labels.indexOf(event[property]) === -1) {
                data.labels.push(event[property]);
            }

            // build object to contain counts
            if (!temp[event[property]]) {
                temp[event[property]] = {
                    count: 0
                };
            }

            temp[event[property]].count += 1;
        });

        for (prop in temp) {
            data.data.push(temp[prop].count);
        }

        $scope.charts.push(data);
    }

}]);

app.controller('signinController', ['$scope', '$http', function ($scope, $http) {

    $scope.userData = {};

    $scope.validateForm = function ($event) {

        $event.preventDefault();

        $scope.usernameError = false;
        $scope.passwordError = false;
        $scope.signInError = false;


        if (!$scope.userData.username) {
            $scope.usernameError = true;
            $scope.usernameErrorMessage = 'Username required';
        }

        if (!$scope.userData.password) {
            $scope.passwordError = true;
            $scope.passwordErrorMessage = 'Password required';
        }

        if (!$scope.userData.username || !$scope.userData.password) {
            return false;
        } else {
            $http.post('/signin', JSON.stringify($scope.userData)).then(
                function success (res) {
                    document.location = ('/');
                },
                function failure (res) {
                    $scope.signInError = true;
                    $scope.signInErrorMessage = res.data.message;
                }
            );
        }
    };

    $scope.hideError = function ($event) {
        var field = $event.target;

        $scope[field.id + 'Error'] = false;
    };

}]);
