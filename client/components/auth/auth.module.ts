'use strict';

angular.module('tobiaswinklerBerlinApp.auth', [
  'tobiaswinklerBerlinApp.constants',
  'tobiaswinklerBerlinApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
