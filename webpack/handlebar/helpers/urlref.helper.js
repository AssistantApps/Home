module.exports = function (context, options) {
    if (context == null) return '/';
    if (context.includes('?')) {
        return context + '&ref=AssistantApps';
    }
    return context + '?ref=AssistantApps';
};