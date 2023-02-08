module.exports = function (context, options) {
    const keys = [];
    const values = [];
    const rootInternal = [];

    for (var i = 0; i < (arguments.length - 1); i++) {
        if ((i % 2) == 0) {
            keys.push(arguments[i]);
        } else {
            values.push(arguments[i]);
        }
    }

    const lowestCount = Math.min(keys.length, values.length);
    for (let lowestCountIndex = 0; lowestCountIndex < lowestCount; lowestCountIndex++) {
        const key = keys[lowestCountIndex];
        const value = values[lowestCountIndex];
        rootInternal.push(`${key}: ${value};`);
    }
    const rawHtml = `<style>
        :root {
            ${rootInternal.join('\n\t\t\t')}
        }
    </style>`
    return rawHtml;
};