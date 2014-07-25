define(['Backbone', 'lib/Carousel'], function (Backbone, Carousel) {
    /**
     * @class CarouselPage
     * @extends Backbone.View
     */
    return Backbone.View.extend(/**@lends CarouselPage*/{
        /**
         * @protected
         * @constructs
         */
        initialize: function () {
            /**
             * @type {Array.<Carousel>}
             * @protected
             */
            this._carousels = [];

            this.$el.find('.carousel').each(this._initCarousel.bind(this));
        },

        /**
         * @private
         * @param {number} i
         * @param {HTMLElement} el
         */
        _initCarousel: function (i, el) {
            this._carousels.push(new Carousel({
                el: el
            }));
        }
    });
});
