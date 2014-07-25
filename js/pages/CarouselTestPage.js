require([
    'jquery',
    'pages/CarouselPage',
    'jasmine/jasmine',
    'jasmine/jasmine-html'
], function ($, CarouselPage, jasmineRequire) {
    /**
     * @class CarouselTestPage
     * @extends CarouselPage
     */
    var CarouselTestPage = CarouselPage.extend({
        /**
         * @protected
         * @constructs
         */
        initialize: function () {
            CarouselPage.prototype.initialize.apply(this, arguments);

            this._jasmineEnv = null;

            this._prepareJasmine();
            this._prepareCarousels();
            this.describe('Carousel', this._describeTests);
            this._jasmineEnv.execute();
        },

        /**
         * @private
         */
        _prepareJasmine: function () {
            var jasmine = jasmineRequire.core(jasmineRequire);
            jasmineRequire.html(jasmine);
            this._jasmineEnv = jasmine.getEnv();

            var queryString = new jasmine.QueryString({
                getWindowLocation: function () {
                    return window.location;
                }
            });

            var self = this;
            var htmlReporter = new jasmine.HtmlReporter({
                env: this._jasmineEnv,
                onRaiseExceptionsClick: function () {
                    queryString.setParam("catch", !self._jasmineEnv.catchingExceptions());
                },
                getContainer: function () {
                    return document.body;
                },
                createElement: function () {
                    return document.createElement.apply(document, arguments);
                },
                createTextNode: function () {
                    return document.createTextNode.apply(document, arguments);
                },
                timer: new jasmine.Timer()
            });

            this._jasmineEnv.addReporter(htmlReporter);
            htmlReporter.initialize();

            /**
             * @param {string} description
             * @param {function(this:CarouselTestPage)} specDefinitions
             * @returns {jasmine.Suite}
             */
            this.describe = function (description, specDefinitions) {
                return self._jasmineEnv.describe(description, specDefinitions.bind(this));
            };

            /**
             * @param {string} description
             * @param {function(this:CarouselTestPage)} func
             * @returns {jasmine.Suite}
             */
            this.it = function (description, func) {
                return self._jasmineEnv.it(description, func.bind(this));
            };

            /**
             * @method
             * @see jasmine.expect
             */
            this.expect = this._jasmineEnv.expect.bind(this._jasmineEnv);
        },

        _prepareCarousels: function () {
            this._carousels.forEach(function (carousel) {
                carousel.setAnimationTime(0);
            });
        },

        _describeTests: function () {
            this.describe('During initialization', this._checkInitialization);
            this.describe('Mouse events', this._checkMouseEvents);
            this.describe('Keyboard events', this._checkKeyboardEvents);
        },

        _checkInitialization: function () {
            this.it('should duplicate items to provide carousel effect, if capacity of holder equals number of items', function () {
                this._shouldHaveItems(0, 10);
                this._shouldHaveItems(1, 10);
                this._shouldHaveItems(2, 3);
            });

            this.it('should hide arrows if all items are shown', function () {
                this._shouldHaveVisibleArrows(0, 2);
                this._shouldHaveVisibleArrows(1, 2);
                this._shouldHaveVisibleArrows(2, 0);
            });
        },

        _checkMouseEvents: function () {
            this.it('should move to left and right when user click by arrows', function () {
                this._shouldHaveIndent(0, 0, 'Slide #1');
                this._emulateClick(0, '.carousel__arrow-left');
                this._shouldHaveIndent(0, 0, 'Slide #5');
                this._emulateClick(0, '.carousel__arrow-left');
                this._shouldHaveIndent(0, 0, 'Slide #4');
                this._emulateClick(0, '.carousel__arrow-right');
                this._shouldHaveIndent(0, -110, 'Slide #4');
                this._emulateClick(0, '.carousel__arrow-right');
                this._shouldHaveIndent(0, -220, 'Slide #4');
            });

            this.it('should move items circularly', function () {
                this._shouldHaveIndent(1, 0, 'Slide #1');
                this._emulateClick(1, '.carousel__arrow-right');
                this._shouldHaveIndent(1, -110, 'Slide #1');
                this._emulateClick(1, '.carousel__arrow-right');
                this._shouldHaveIndent(1, -220, 'Slide #1');
                var i;
                for (i = 0; i < 4; i++) {
                    this._emulateClick(1, '.carousel__arrow-right');
                }
                this._shouldHaveIndent(1, -550, 'Slide #2');
                for (i = 0; i < 6; i++) {
                    this._emulateClick(1, '.carousel__arrow-left');
                }
            });
        },

        _checkKeyboardEvents: function () {
            var LEFT = 37, RIGHT = 39;

            this.it('should have possibility to move slides by pressing arrow keys on the keyboard', function () {
                this._emulateFocus(1);
                this._emulateKeypress(1, LEFT);
                this._shouldHaveIndent(1, 0, 'Slide #10');
                this._emulateKeypress(1, RIGHT);
                this._shouldHaveIndent(1, -110, 'Slide #10');
            });
        },

        _shouldHaveItems: function (carousel, number) {
            this.expect(this._carousels[carousel].$el.find('.carousel__item').length).toBe(number);
        },

        _shouldHaveVisibleArrows: function (carousel, number) {
            this.expect(this._carousels[carousel].$el.find('.carousel__arrow:visible').length).toBe(number);
        },

        _shouldHaveIndent: function (carousel, indent, firstItemText) {
            this.expect(this._carousels[carousel].$el.find('.carousel__items').css('left')).toBe(indent + 'px');
            this.expect(this._carousels[carousel].$el.find('.carousel__item:first').text()).toBe(firstItemText);
        },

        _emulateClick: function (carousel, selector) {
            this._carousels[carousel].$el.find(selector).click();
        },

        _emulateFocus: function (carousel) {
            this._carousels[carousel].$el.focus();
        },

        _emulateKeypress: function (carousel, keyCode) {
            var eventParams = {
                keyCode: keyCode
            };
            var $carousel = this._carousels[carousel].$el;
            $carousel.trigger($.Event('keydown', eventParams));
            $carousel.trigger($.Event('keypress', eventParams));
            $carousel.trigger($.Event('keyup', eventParams));
        }
    });

    new CarouselTestPage({
        el: document.body
    });
});
