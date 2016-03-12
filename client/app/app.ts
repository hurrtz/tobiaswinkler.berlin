'use strict';

angular.module('tobiaswinklerBerlinApp', [
  'tobiaswinklerBerlinApp.auth',
  'tobiaswinklerBerlinApp.admin',
  'tobiaswinklerBerlinApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
