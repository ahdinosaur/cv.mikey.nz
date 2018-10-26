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

function process ({ inputFile, outputPath, title }) {
  return unified()
    .use(markdown)
    .use(htmlEmojiImage, { base: '/images/' })
    .use(mdast2hast, {
      allowDangerousHTML: true
    })
    .use(raw)
    .use(doc, {
      title,
      css: [
        '/index.css'
      ]
    })
    .use(format)
    .use(html)
    .process(inputFile, function(err, file) {
      console.error(report(err || file))
      vfile.writeSync({
        path: outputPath,
        contents: file.contents
      })
    })

}

process({
  inputFile: vfile.readSync('README.md'),
  outputPath: 'index.html',
  title: '😺🎉 Mikey Williams ☀️🌈'
})
process({
  inputFile: vfile.readSync('references/mix.md'),
  outputPath: 'references/mix.html',
  title: 'Mix on Mikey Williams'
})
