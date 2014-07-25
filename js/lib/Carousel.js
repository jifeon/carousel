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
                'click .carousel__arrow-right': this._onRightArrowClick,
                keydown: this._onKeyDown
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

            /**
             * @type {number}
             * @private
             */
            this._animationTime = 200;

            this._initItems();
        },

        /**
         * @private
         */
        _initItems: function () {
            var $items = this._$items = this._$itemsHolder.find('.carousel__item');
            this._itemWidth = $items.outerWidth(true);

            var capacity = Math.ceil(this._width / this._itemWidth),
                itemsCount = $items.length;
            if (itemsCount === capacity) {
                var $clonedItems = $items.clone();
                $clonedItems.appendTo(this._$itemsHolder);
                this._$items = $items.add($clonedItems);
                itemsCount *= 2;
            }
            else if (itemsCount < capacity) {
                this.$el.find('.carousel__arrow').hide();
            }

            this._itemsHolderWidth = this._itemWidth * itemsCount;
            this._$itemsHolder
                .width(this._itemsHolderWidth)
                .css('left', 0);
        },

        /**
         * @param {number} time
         * @public
         */
        setAnimationTime: function (time) {
            this._animationTime = time;
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
         * @param {Event} e
         * @private
         */
        _onKeyDown: function (e) {
            var direction;
            switch (e.keyCode) {
                case 37: // left
                    direction = -1;
                    break;

                case 39: // right
                    direction = 1;
                    break;
            }

            if (direction) {
                e.preventDefault();
                this._move(direction);
            }
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
            }, this._animationTime);
        }
    });

    return Carousel;
});
