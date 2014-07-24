define(['Backbone'], function (Backbone) {
    /**
     * @class Carousel
     * @extends Backbone.View
     */
    var Carousel = Backbone.View.extend(/**@lends Carousel*/{
        /**
         * @protected
         * @returns {object.<function({Event})>}
         * @see {@link Backbone.View.events}
         */
        events: function () {
            return {
                'click .carousel__arrow-left': this._onLeftArrowClick,
                'click .carousel__arrow-right': this._onRightArrowClick
            };
        },

        /**
         * @protected
         * @constructs
         */
        initialize: function () {
            /**
             * @type {jQuery}
             * @private
             */
            this._$items = null;

            /**
             * @type {jQuery}
             * @private
             */
            this._$itemsHolder = this.$el.find('.carousel__items');

            /**
             * @type {number}
             * @private
             */
            this._width = this.$el.find('.carousel__bounds').width();

            /**
             * @type {number}
             * @private
             */
            this._itemWidth = 0;

            /**
             * @type {number}
             * @private
             */
            this._itemsHolderWidth = 0;

            this._initItems();
        },

        /**
         * @private
         */
        _initItems: function () {
            var $items = this._$itemsHolder.find('.carousel__item'),
                $clonedItems = $items.clone();
            $clonedItems.appendTo(this._$itemsHolder);
            this._$items = $items.add($clonedItems);
            this._itemWidth = $items.outerWidth(true);
            this._itemsHolderWidth = this._itemWidth * this._$items.length;
            this._$itemsHolder.width(this._itemsHolderWidth);
        },

        /**
         * @param {Event} e
         * @private
         */
        _onLeftArrowClick: function (e) {
            e.preventDefault();
            this._move(-1);
        },

        /**
         * @param {Event} e
         * @private
         */
        _onRightArrowClick: function (e) {
            e.preventDefault();
            this._move(1);
        },

        /**
         * @param {number} direction
         * @private
         */
        _move: function (direction) {
            this._$itemsHolder.stop(true, true);

            var leftOffset = parseInt(this._$itemsHolder.css('left'));
            if (isNaN(leftOffset)) {
                leftOffset = 0;
            }

            var shift = '';
            if (direction < 0 && leftOffset === 0) {
                this._$items.last().insertBefore(this._$items.first());
                shift = '-=' + this._itemWidth;
            }
            else if (direction > 0 && leftOffset - this._itemWidth <= this._width - this._itemsHolderWidth) {
                this._$items.first().insertAfter(this._$items.last());
                shift = '+=' + this._itemWidth;
            }

            if (shift) {
                this._$itemsHolder.css({
                    left: shift
                });
                this._$items = this._$itemsHolder.find('.carousel__item');
            }

            this._$itemsHolder.animate({
                left: '-=' + (direction * this._itemWidth)
            });
        }
    });

    return Carousel;
});
