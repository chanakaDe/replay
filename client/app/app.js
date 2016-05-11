import angular from 'angular';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';
import commentService from './service/comment.service';
import gapiLoaded from './service/gapiLoad.service';
import videoService from './service/video.service';
import playListService from './service/playList.service';
import starService from './service/star.service';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import ngMaterial from 'angular-material';
import 'angular-material/angular-material.css';

angular.module('app', [
  uiRouter,
  ngResource,
  ngMaterial,
  Common.name,
  Components.name
])
  .service({videoService})
  .service({commentService})
  .service({playListService})
  .service({starService})
  .factory({gapiLoaded})
  .config(($locationProvider, $mdThemingProvider, $stateProvider) => {
    "ngInject";

    $locationProvider.html5Mode(true).hashPrefix('!');

    $mdThemingProvider.theme('forest')
      .primaryPalette('brown')
      .accentPalette('green');

    $stateProvider
      .state('main', {
        abstract: true,
        template: '<ui-view/>'
      });
  })
  .run(($rootScope, $urlRouter, $state, User) => {
    "ngInject";

    var loginState = 'loginPage';

    $rootScope.$on('$stateChangeStart',
      (event, toState, toParams, fromState, fromParams, options) => {
        $rootScope.$state = $state;
        $rootScope.fromState = fromState;

        console.log('$stateChangeStart');
        //debugger;

        if (toState.name === loginState) return;

        if (User.authInitialized) {
          if (!User.isLogged()) {
            event.preventDefault();
            console.log('going to login page 1');
            $state.go(loginState);
          }
        } else {
            event.preventDefault();
            User.authInitialize().then(() => {
              if (!User.isLogged()) {
                console.log('going to login page 2');
                $state.go(loginState);
              } else {
                $urlRouter.sync();
              }
            })
        }

      })
  })
  .component('app', AppComponent);
