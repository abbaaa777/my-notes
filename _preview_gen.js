// Preview generator: replace Liquid tags with homepage values
var fs = require('fs');
var layout = fs.readFileSync('_layouts/default.html', 'utf8');
var index  = fs.readFileSync('index.html', 'utf8');
var searchData = fs.readFileSync('assets/search-index.json', 'utf8');

// Strip YAML front matter from index
var content = index.replace(/^---[\s\S]*?---\s*/, '');

// Replace all Liquid constructs
var html = layout
    .replace(/\{\{\s*site\.baseurl\s*\}\}/g, '/my-notes')
    // Strip all Liquid tags ({% ... %})
    .replace(/\{\%[\s\S]*?\%\}/g, '')
    // Replace {{ page.title }} and {{ variable }}
    .replace(/\{\{\s*page\.title\s*\}\}/g, '我的笔记')
    .replace(/\{\{\s*content\s*\}\}/g, content)
    .replace(/\{\{[^}]*\}\}/g, '')
    // Embed search index inline so preview search works (file:// protocol can't XHR)
    .replace('var searchIndex   = null;', 'var searchIndex   = ' + searchData.trim() + ';')
    // Add entrance animation
    .replace('<div class="container">', '<div class="container entrance-start">');

fs.writeFileSync('preview.html', html, 'utf8');
console.log('preview.html generated, size:', html.length);
