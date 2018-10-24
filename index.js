var vfile = require('to-vfile')
var report = require('vfile-reporter')
var unified = require('unified')
var markdown = require('remark-parse')
var htmlEmojiImage = require('remark-html-emoji-image');
var mdast2hast = require('remark-rehype')
var doc = require('rehype-document')
var format = require('rehype-format')
var html = require('rehype-stringify')
var raw = require('rehype-raw')

unified()
  .use(markdown)
  .use(htmlEmojiImage, { base: './images/' })
  .use(mdast2hast, {
    allowDangerousHTML: true
  })
  .use(raw)
  .use(doc, {
    title: '😺🎉 Mikey Williams ☀️🌈',
    css: [
      './index.css'
    ]
  })
  .use(format)
  .use(html)
  .process(vfile.readSync('README.md'), function(err, file) {
    console.error(report(err || file))
    vfile.writeSync({
      path: 'index.html',
      contents: file.contents
    })
  })
