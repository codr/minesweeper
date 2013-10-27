/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var SquareView = Backbone.View.extend({

        tagName: 'button',

        className: 'btn btn-primary btn-sm',

        template: JST['app/scripts/templates/square.ejs'],

        events: {
            'click':        'dig',
            'contextmenu':  'toggleFlag', //capture right-click
        },

        initialize: function() {
            this.listenTo(this.model, 'change:dug', this.displayDug);
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$('span')
                .toggleClass('glyphicon-cog', this.model.hasAMine() && this.shouldDisplayValue())
                .toggleClass('glyphicon-flag', this.shouldDisplayFlag())
                .toggleClass('disabled', this.shouldDisplayFlag());
            return this;
        },

        shouldDisplayValue: function() {
            return this.model.isDug() || !this.model.isHidden();
        },

        shouldDisplayFlag: function() {
            return this.model.get('flagged') && !this.shouldDisplayValue();
        },

        dig: function() {
            if (!this.model.get('flagged')) {
                this.model.digRecursively();
            }
        },

        toggleFlag: function(event) {
            event.preventDefault();
            this.model.toggleFlag();
        },

        displayDug: function(model, isDug) {
            this.$el
                .toggleClass('btn-primary', !isDug)
                .toggleClass('btn-danger', isDug && model.hasAMine());
        },
    });

    return SquareView;
});