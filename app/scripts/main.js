/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap',
        localstorage: 'vendor/backbone.localStorage',
    }
});

require([
    'jquery',
    'backbone',
    'collections/board',
    'views/app',
], function ($, Backbone, BoardCollection, AppView) {

    Backbone.history.start();

    var gameBoard = new BoardCollection();

    var app = new AppView({collection: gameBoard, el: $('#minesweeper')});

    //for debugging
    window.app = app;
});
