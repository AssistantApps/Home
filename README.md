# AssistantApps 
## Home page

This site is built with [Handlebars](https://handlebarsjs.com/) to inject data from [project.json](./webpack/data/project.json) into the [template](./webpack/handlebar/index.hbs), which generates the [index.html](./index.html) file. There is also [SCSS](https://sass-lang.com/) files that are compiled to CSS

## How to Build the files
- First ensure that you have all of the NPM packages by running `npm i`
- After that you can run `npm run build` to generate all the files

In future I will add a script to watch for file changes so that I wont have to run `npm run build` after each change I want to test.

I will also probably create a script that will be executed using node to fetch data from the [AssistantApps API](https://api.assistantapps.com) and populate additional data to the [project.json](./webpack/data/project.json) file.