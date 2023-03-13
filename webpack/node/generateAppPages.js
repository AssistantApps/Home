const fs = require('fs');
const util = require('util');
const Handlebars = require('handlebars');

const pjson = require('../../package.json');

const dateHelper = require('../handlebar/helpers/date.helper.js');
const loudHelper = require('../handlebar/helpers/loud.helper.js');
const urlrefHelper = require('../handlebar/helpers/urlref.helper.js');
const versionHelper = require('../handlebar/helpers/version.helper.js');
const sectionClassHelper = require('../handlebar/helpers/sectionclass.helper.js');
const urlrefescapedHelper = require('../handlebar/helpers/urlrefescaped.helper.js');
const cssvarHelper = require('../handlebar/helpers/cssvar.helper.js');

const readFile = util.promisify(fs.readFile);

async function generateOtherFiles() {
    process.env['NODE_ENV'] = pjson.version;
    const projectDataContents = await readFile('./webpack/data/project.json', 'utf8');
    const projectData = JSON.parse(projectDataContents);

    Handlebars.registerHelper('date', dateHelper);
    Handlebars.registerHelper('loud', loudHelper);
    Handlebars.registerHelper('urlref', urlrefHelper);
    Handlebars.registerHelper('version', versionHelper);
    Handlebars.registerHelper('sectionclass', sectionClassHelper);
    Handlebars.registerHelper('urlrefescaped', urlrefescapedHelper);
    Handlebars.registerHelper('cssvar', cssvarHelper);


    Handlebars.registerPartial('components/documentHead', require('../handlebar/components/documentHead.hbs'));
    Handlebars.registerPartial('components/banner', require('../handlebar/components/banner.hbs'));
    Handlebars.registerPartial('components/footer', require('../handlebar/components/footer.hbs'));
    Handlebars.registerPartial('components/scripts', require('../handlebar/components/scripts.hbs'));

    for (const assApp of projectData.assistantApps) {
        if (assApp.shortCode == null || assApp.shortCode.length < 2) continue;
        await createAppPageFromData(projectData, assApp, assApp.shortCode);

        if (assApp.shortCodeAlt == null || assApp.shortCodeAlt.length < 2) continue;
        await createAppPageFromData(projectData, assApp, assApp.shortCodeAlt);
    }

    const otherPageTemplateData = {
        ...projectData,
        htmlHeaders: [],
    };
    const otherTemplates = [
        'support.hbs',
    ];
    for (const otherTemplate of otherTemplates) {
        const otherTemplateContent = await readFile(`./webpack/handlebar/${otherTemplate}`, 'utf8');
        const otherTemplateFunc = Handlebars.compile(otherTemplateContent);
        const otherTemplateCompiled = otherTemplateFunc(otherPageTemplateData);
        fs.writeFile(`./${otherTemplate.replace('.hbs', '.html')}`, otherTemplateCompiled, ['utf8'], () => { });
    }

    for (const redirect of projectData.redirects) {
        const template = await readFile(`./webpack/handlebar/redirect.hbs`, 'utf8');
        const templateFunc = Handlebars.compile(template);
        const templateData = {
            title: redirect.pattern,
            url: redirect.url
        };
        const compiledTemplate = templateFunc(templateData);

        if (!fs.existsSync(redirect.pattern)) {
            fs.mkdirSync(redirect.pattern);
        }

        fs.writeFile(`./${redirect.pattern}/index.html`, compiledTemplate, ['utf8'], () => { });
    }
}

const createAppPageFromData = async (projectData, assApp, shortCode) => {

    const template = await readFile(`./webpack/handlebar/app.hbs`, 'utf8');
    const templateFunc = Handlebars.compile(template);

    const otherLinks = [];
    const storeBadges = [];
    const storeLinksTypes = ['apple', 'googlePlay'];
    for (const link of assApp.links) {
        if (storeLinksTypes.includes(link.icon)) {
            storeBadges.push(link);
        }
        else {
            otherLinks.push(link);
        }
    }

    const templateData = {
        kurt: projectData.kurt,
        theme: projectData.theme,
        meta: projectData.meta,
        rootLinks: projectData.link,
        twitter: {
            ...projectData.twitter,
            ...(assApp.link ?? {})
        },
        preconnect: [
            ...projectData.preconnect,
            assApp.image,
        ],

        documentTitle: assApp.name,
        rootUrl: assApp.link,
        downloadAppLink: (assApp.downloadAppLink ?? assApp.links?.[0]?.url) ?? assApp.link,
        storeBadges: storeBadges,
        otherLinks: otherLinks,
        backgroundImg: (assApp.customPrimaryColour != null)
            ? `url(/assets/img/bubble-${assApp.shortCode}.svg)`
            : `url(/assets/img/bubble.svg)`,

        ...assApp,

        assAppLinks: assApp.links,
        links: projectData.links,
    };
    const compiledTemplate = templateFunc(templateData);

    if (!fs.existsSync(shortCode)) {
        fs.mkdirSync(shortCode);
    }
    fs.writeFile(`./${shortCode}/index.html`, compiledTemplate, ['utf8'], () => { });

    if (assApp.customPrimaryColour != null) {
        const backgroundTemplate = await readFile(`./webpack/handlebar/bubble.svg.hbs`, 'utf8');
        const backgroundTemplateFunc = Handlebars.compile(backgroundTemplate);
        const backgroundCompiledTemplate = backgroundTemplateFunc(templateData);
        fs.writeFile(`./assets/img/bubble-${assApp.shortCode}.svg`, backgroundCompiledTemplate, ['utf8'], () => { });
    }
}

generateOtherFiles();
