const version = '1-3';
module.exports = {
    router: {
        extendRoutes(routes) {
            routes.push({
                name: 'test',
                path: '/',
                component: '~/pages/login.vue'
            }, {
                name: 'test1',
                path: '/wms',
                component: '~/pages/login.vue'
            }, {
                name: 'test2',
                path: '/wms/',
                component: '~/pages/login.vue'
            })
        }
    },
    /*
     ** Headers of the page
     */
    head: {
        title: '药材买卖网仓储管理系统V1.0',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Nuxt.js project' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
        ]
    },
    /*
     ** Global CSS
     */
    css: ['element-ui/lib/theme-default/index.css', '~assets/iconfont/iconfont.css', '~assets/css/main.css'],
    filter: ['~filters/index.js'],
    /*
     ** Add axios globally
     */
    build: {
        vendor: ['babel-polyfill', 'axios', 'element-ui'],
        babel: {
            plugins: ['transform-async-to-generator',
                'transform-runtime', ['component', [{
                    libraryName: 'element-ui',
                    styleLibraryName: 'theme-default'
                }]]
            ],
            presets: [
                ['es2015', { modules: false }],
                'stage-2'
            ]
        },
        loaders: [{
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: '[name].[ext]?version=' + version
            }
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.less$/,
            loader: "style-loader!css-loader!less-loader"
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 1000, // 1 KO
                name: 'fonts/[name]-' + version + '.[ext]'
            }
        }],
        filenames: {
            vendor: 'vendor.' + version + '.js',
            app: 'app.' + version + '.js',
            // css: 'style.' + version + '.css'
        },
    },
    plugins: ['~plugins/axios', '~plugins/element']
}
