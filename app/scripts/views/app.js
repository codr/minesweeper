/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/row',
], function ($, _, Backbone, JST, RowView) {
    'use strict';

    var AppView = Backbone.View.extend({

        template: JST['app/scripts/templates/app.ejs'],

        events: {
            'click .new-game':  'newGame',
            'click .validate':  'validate',
            'click .cheat':     'toggleCheat',
        },

        initialize: function() {

            this.listenTo(this.collection, 'change:dug', this.evaluateGame);

            this.hideAll = true;

            this.render();
        },

        render: function() {
            this.$el.html(this.template({hideAll: this.hideAll}));

            var rows = this.collection.getRows();
            _(rows).each(this.addRow, this);
        },

        addRow: function(row) {
            var rowView = new RowView({model: row});
            this.$('.game-board').append(rowView.render().el);
        },

        newGame: function() {
            this.collection.reset();
            this.collection.initialize();
            this.hideAll = true;
            this.render();
        },

        validate: function() {
            if (this.collection.haveWon() || this.collection.haveFailed()) {
                this.evaluateGame();
            } else {
                this.displayMessage('You\'re not quite there. <strong>Keep going!</strong><br>' +
                    '<small>Don\t worry I\'ll let you know when you\'re there.</small>', 'info');
            }
        },

        evaluateGame: function() {
            if (this.collection.haveWon()) {
                this.displayMessage('<strong>Well done!</strong> You\'ve won!', 'success');
            }
            if (this.collection.haveFailed()) {
                this.displayMessage('<strong>Oh No!</strong> It seems you hit a mine.', 'danger');

                // Disable the game.
                this.$('.game-board .btn').addClass('disabled');

                // Expose the mines.
                this.collection.chain()
                    .filter(function(square) {
                        return square.hasAMine();
                    })
                    .invoke('setHidden', false);
            }
        },

        toggleCheat: function() {
            this.hideAll = !this.hideAll;

            this.collection.invoke('setHidden', this.hideAll);
            this.displayCheatIcon(!this.hideAll);
        },

        displayCheatIcon: function(isCheating) {
            this.$('.cheat .glyphicon')
                .toggleClass('glyphicon-eye-open', !isCheating)
                .toggleClass('glyphicon-eye-close', isCheating);
        },

        displayMessage: function(message, status) {
            this.$('.status').html(message)
                .toggleClass('alert-success', status === 'success')
                .toggleClass('alert-info', status === 'info' || !status) //default
                .toggleClass('alert-danger', status === 'danger');
        },

    });

    return AppView;
});