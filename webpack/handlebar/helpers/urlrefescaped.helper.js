module.exports = function (context, options) {
    if (context == null) return '/';
    if (context.includes('?')) {
        return context + '&amp;ref=AssistantApps';
    }
    return context + '?ref=AssistantApps';
};