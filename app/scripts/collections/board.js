/*global define*/

define([
    'underscore',
    'backbone',
    'models/square',
    'localstorage',
], function (_, Backbone, Square) {
    'use strict';

    var BoardCollection = Backbone.Collection.extend({

        model: Square,

        localStorage: new Backbone.LocalStorage('minesweeper'),

        initialize: function(models, options) {
            options = options || {};

            this.size = options.size || 8;
            this.mines = options.mines || 10;

            this.generateBoard();
        },

        generateBoard: function() {
            this.generateSquares();
            this.setNeighbours();
            this.placeMines();
            this.numberSquares();
        },

        generateSquares: function() {
            var numSquares = Math.pow(this.size, 2);

            _(numSquares).times(function(id) {
                this.create({id: id});
            }, this);
        },

        /**
         *  Sets the neighbours for each square.
         */
        setNeighbours: function() {
            var rows = _(this.getRows()).toArray();

            _(rows).each(function(row, rowNum) {
                _(row).each(function(square, squareNum) {
                    if (rows[rowNum - 1]) {
                        // top left
                        square.setNeighbour(rows[rowNum - 1][squareNum - 1]);
                        // top middle
                        square.setNeighbour(rows[rowNum - 1][squareNum]);
                        // top right
                        square.setNeighbour(rows[rowNum - 1][squareNum + 1]);
                    }
                    // left
                    square.setNeighbour(row[squareNum - 1]);
                    // right
                    square.setNeighbour(row[squareNum + 1]);
                    if (rows[rowNum + 1]) {
                        // bottom left
                        square.setNeighbour(rows[rowNum + 1][squareNum - 1]);
                        // bottom middle
                        square.setNeighbour(rows[rowNum + 1][squareNum]);
                        // bottom right
                        square.setNeighbour(rows[rowNum + 1][squareNum + 1]);
                    }
                });
            });
        },

        placeMines: function() {
            var mineIds = _.range(this.length);

            _(this.mines).times(function() {
                var mineSquareId = mineIds[Math.floor(Math.random() * mineIds.length)];

                this.get(mineSquareId).setMine(true);

                // remove square from list
                mineIds = _(mineIds).without(mineSquareId);
            }, this);
        },

        numberSquares: function() {
            this.chain()
            .reject(function(square) {
                return square.hasAMine();
            })
            .each(this.calculateSquaresNumber);
        },

        /**
         * Calculates the number to be displayed on the square.
         */
        calculateSquaresNumber: function(square) {
            square.calculateNumber();
        },

        /**
         *  Returns an array of arrays of squars representing the board.
         */
        getRows: function() {
            return this.groupBy(function(model) {
                return Math.floor(model.id / this.size);
            }, this);
        },

        /**
         *  Checks to see if we've won the game.
         *  We've won if we've dug all non-mine square and
         *  haven't dug any mines.
         */
        haveWon: function() {
            return this.chain()
            // Of all undug squares...
            .reject(function(square) {
                return square.isDug();
            })
            // ...remove those that have a mine...
            .reject(function(square) {
                return square.hasAMine();
            })
            // ...what remains are undug mineless squares.
            // If this is empty we've exposed all that we should.
            .isEmpty().value() &&
            // Just make sure we haven't exposed to much.
            !this.haveFailed();
        },

        /**
         * Checks to see if we've failed the game.
         * We've failed if we've dug a mine.
         */
        haveFailed: function() {
            return !this.chain()
            // Of all squares with mines...
            .filter(function(square) {
                return square.hasAMine();
            })
            // ...take those that are dug...
            .filter(function(square) {
                return square.isDug();
            })
            // ...we have left the dug mines.
            // If this is empty we have not failed.
            .isEmpty().value();
        },

    });

    return BoardCollection;
});