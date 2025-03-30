export function escapeHTML(str) {
    return str.replace(/[&<>'"`]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;',
        "'": '&#39;', '"': '&quot;', '`': '&#96;'
    }[tag]));
}

export function escapeHTMLAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
