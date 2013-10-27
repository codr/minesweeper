/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var SquareModel = Backbone.Model.extend({
        defaults: {
            hasAMine: false,
            hidden: true,
            dug: false,
            flagged: false,
        },

        initialize: function() {
            this.neighbours = [];
        },

        setMine: function(val) {
            this.set({hasAMine: val});
        },

        hasAMine: function() {
            return this.get('hasAMine');
        },

        setNumber: function(num) {
            this.set({number: num});
        },

        isZero: function() {
            return !this.hasAMine() && this.get('number') === 0;
        },

        isHidden: function() {
            return this.get('hidden');
        },

        setHidden: function(hide) {
            this.set({hidden: hide});
        },

        isDug: function() {
            return this.get('dug');
        },

        toggleFlag: function() {
            this.set({flagged: !this.get('flagged')});
        },

        setNeighbour: function(square) {
            if (square) {
                this.neighbours.push(square);
            }
        },

        calculateNumber: function() {
            this.setNumber(_(this.neighbours).reduce(function(sum, square) {
                return sum + (square.hasAMine() ? 1 : 0);
            }, 0));
        },

        /**
         *  Digs the tile and checks to see if we sould be dig it's neibours.
         */
        digRecursively: function() {
            this.set({dug: true});
            if (this.isZero()) {
                _(this.neighbours).each(function(square) {
                    if (square.isZero() && !square.isDug()) {
                        square.digRecursively();
                    } else {
                        square.set({dug: true});
                    }
                });
            }
        }
    });

    return SquareModel;
});