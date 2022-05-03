const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware('/ws-log',{
            target: 'http://localhost:8083',
            changeOrigin: true,
        })
    );

   // app.use(
     //   createProxyMiddleware('/ws-log', {
       //     target: 'ws://localhost:8083',
         //   ws: true,
           // changeOrigin: true,
       // })
    //);
};