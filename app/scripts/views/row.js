/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/square'
], function ($, _, Backbone, JST, SquareView) {
    'use strict';

    var RowView = Backbone.View.extend({

        // template: JST['app/scripts/templates/row.ejs'],

        className: 'row btn-toolbar',

        render: function() {
            _(this.model).each(this.addSquare, this);
            return this;
        },

        addSquare: function(square) {
            var view = new SquareView({model: square});
            this.$el.append(view.render().el);
        },
    });

    return RowView;
});