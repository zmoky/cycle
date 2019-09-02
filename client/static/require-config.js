require.config({
    paths: {
        'svg.js': 'svg.min',
        'socket.io-client': 'socket.io-client/dist/socket.io',
        'jquery': 'js/jquery/jquery',
        'jquery-ui': 'js/jquery/jquery-ui.min',
        'crypto-js': 'crypto-js/crypto-js',
        'resize-observer-polyfill': 'resize-observer-polyfill/dist/ResizeObserver',
    }
});
require(['main']); // run main.ts from here.