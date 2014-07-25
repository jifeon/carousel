var require = {
    baseUrl: 'js',
    paths: {
        Backbone: 'vendor/backbone-min',
        underscore: 'vendor/underscore-min',
        jquery: 'vendor/jquery-2.1.1.min',
        jasmine: 'vendor/jasmine'
    },
    shim: {
        'jquery': {
            exports: 'jQuery'
        },
        'jasmine/jasmine-html': {
            deps: ['jasmine/jasmine']
        },
        'jasmine/jasmine': {
            exports: 'jasmineRequire'
        }
    }
};
