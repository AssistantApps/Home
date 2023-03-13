const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const pjson = require('../../package.json');

async function generateFullJson() {
    process.env['NODE_ENV'] = pjson.version;

    const siteDataContents = await readFile('./webpack/data/site.json', 'utf8');
    const liveDataContents = await readFile('./webpack/data/live.json', 'utf8');
    const appsDataContents = await readFile('./webpack/data/apps.json', 'utf8');

    const siteData = JSON.parse(siteDataContents);
    const liveData = JSON.parse(liveDataContents);
    const appsData = JSON.parse(appsDataContents);

    const comingSoonApp = {
        shortCode: "coming",
        hiddenOnMenu: true,
        game: "Coming Soon",
        title: "Assistant for Unknown",
        titleStart: "Coming Soon",
        titleEnd: "",
        link: "#",
        image: "/assets/img/Unknown.webp",
        icon: "/assets/img/Unknown.webp",
        description: "Yet another Assistant app is under development. Can you guess what game it will be about? Let us know what you think we are working on 😁",
        links: []
    }

    const cspContents = await readFile('./webpack/data/csp.json', 'utf8');
    const cspContent = JSON.parse(cspContents);

    const headerString = cspContent.options
        .map(opt =>
            opt.name +
            ((opt.values != null && opt.values.length > 0) ? ' ' : '') +
            opt.values.join(' ')
        ).join('; ') + ';';

    const htmlHeaderString = cspContent.options
        .filter(hdr => hdr.hideInHtml !== true)
        .map(opt =>
            opt.name +
            ((opt.values != null && opt.values.length > 0) ? ' ' : '') +
            opt.values.join(' ')
        ).join('; ') + ';';

    const siteDataFull = {
        ...siteData,
        ...liveData,
        assistantApps: [...appsData, comingSoonApp],
        headers: [
            ...cspContent.headers.map(csp => ({ "name": csp, "value": headerString })),
            ...siteData.headers,
        ],
        htmlHeaders: [
            ...cspContent.headers.map(csp => ({ "name": csp, "value": htmlHeaderString })),
            ...siteData.headers.filter(hdr => hdr.hideInHtml !== true),
        ]
    };

    fs.writeFile(`./webpack/data/project.json`, JSON.stringify(siteDataFull), ['utf8'], () => { });
}


generateFullJson();
