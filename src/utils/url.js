export function isValidUrl(href) {
    if (!href || typeof href !== 'string') return false;
    try {
        const url = new URL(href);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}
