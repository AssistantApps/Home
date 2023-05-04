const path = require('path');
const HandlebarsPlugin = require("handlebars-webpack-plugin");
const moveFile = require('move-file');
const fs = require('fs');

const bundleFileName = 'bundle';
const dirName = 'dist';
const distPath = path.resolve(__dirname, dirName);

const packageVersion = require('./package.json').version || '1.0.0';

module.exports = (env, argv) => {
    process.env['NODE_ENV'] = packageVersion;
    return {
        mode: argv.mode === "production" ? "production" : "development",
        entry: [
            './webpack/js/custom.js',
        ],
        output: {
            filename: bundleFileName + '.js',
            path: distPath,
            library: 'AssistantApps',
            // libraryTarget: 'window'
        },
        plugins: [
            new HandlebarsPlugin({
                // path to hbs entry file(s). Also supports nested directories if write path.join(process.cwd(), "app", "src", "**", "*.hbs"),
                entry: path.join(process.cwd(), "webpack", "handlebar", "*.hbs"),
                // output path and filename(s). This should lie within the webpacks output-folder
                // if ommited, the input filepath stripped of its extension will be used
                output: path.join(process.cwd(), "[name].html"),
                // you can also add a [path] variable, which will emit the files with their relative path, like
                // output: path.join(process.cwd(), "build", [path], "[name].html"),

                // // data passed to main hbs template: `main-template(data)`
                // data: require("./webpack/data/project.json"),
                // or add it as filepath to rebuild data on change using webpack-dev-server
                data: path.join(__dirname, "webpack/data/project.json"),

                // globbed path to partials, where folder/filename is unique
                partials: [
                    path.join(process.cwd(), "webpack", "handlebar", "*", "*.hbs")
                ],

                // register custom helpers. May be either a function or a glob-pattern
                helpers: {
                    nameOfHbsHelper: Function.prototype,
                    sectionclass: require("./webpack/handlebar/helpers/sectionclass.helper"),
                    urlref: require("./webpack/handlebar/helpers/urlref.helper"),
                    loud: require("./webpack/handlebar/helpers/loud.helper"),
                    date: require("./webpack/handlebar/helpers/date.helper"),
                    version: require("./webpack/handlebar/helpers/version.helper"),
                    urlrefescaped: require("./webpack/handlebar/helpers/urlrefescaped.helper"),
                    times: require("./webpack/handlebar/helpers/times.helper"),
                    cssvar: require("./webpack/handlebar/helpers/cssvar.helper"),
                },

                // hooks
                // getTargetFilepath: function (filepath, outputTemplate) {},
                // getPartialId: function (filePath) {}
                onBeforeSetup: function (Handlebars) { },
                onBeforeAddPartials: function (Handlebars, partialsMap) { },
                onBeforeCompile: function (Handlebars, templateContent) { },
                onBeforeRender: function (Handlebars, data, filename) { },
                onBeforeSave: function (Handlebars, resultHtml, filename) { },
                onDone: function (Handlebars, filename) {
                    if (filename.includes('web.config.html')) {
                        (async () => {
                            await moveFile('web.config.html', 'web.config');
                            console.log('The web.config file has been renamed');
                        })();
                    }
                    if (filename.includes('_slider-generated.sass')) {
                        (async () => {
                            await moveFile('_slider-generated.sass.html', 'webpack/scss/custom/_slider-generated.sass');
                            console.log('The _slider-generated.sass file has been renamed');
                        })();
                    }
                    if (filename.includes('.htaccess')) {
                        (async () => {
                            await moveFile('.htaccess.html', `\.htaccess`);
                            console.log('The htaccess file has been renamed');
                        })();
                    }
                    if (filename.includes('app.html')) {
                        (async () => {
                            fs.unlinkSync('app.html');
                            console.log('The app.html has been removed');
                        })();
                    }
                    if (filename.includes('redirect.html')) {
                        (async () => {
                            fs.unlinkSync('redirect.html');
                            console.log('The redirect.html has been removed');
                        })();
                    }
                }
            }),
        ],
    };
};