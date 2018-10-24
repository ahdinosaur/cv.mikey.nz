var vfile = require('to-vfile')
var report = require('vfile-reporter')
var unified = require('unified')
var markdown = require('remark-parse')
var mdast2hast = require('mdast-util-to-hast')
var doc = require('rehype-document')
var format = require('rehype-format')
var html = require('rehype-stringify')
var raw = require('rehype-raw')

var title

unified()
  .use(markdown)
  .use(transform)
  .use(raw)
  .use((options) => {
    // pass options at runtime
    // to wait until we know the title
    var transformer
    return (tree, file) => {
      if (transformer == null) {
        transformer = doc(Object.assign({ title }, options))
      }
      return transformer(tree,  file)
    }
  }, {
    css: [
      //'https://fonts.googleapis.com/css?family=Robot',
      //'https://cdn.jsdelivr.net/npm/markdown-splendor@1/css/splendor.css',
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

function transform (options) {
  return function transformer (rootMdast) {
    var selfieMdast = rootMdast.children[0]
    var titleMdast = rootMdast.children[1]
    var contactMdast = rootMdast.children[2]

    var rootMdastWithoutChildren = Object.assign({}, rootMdast, { children: [] })

    var rootHastWithoutChildren = mdast2hast(rootMdastWithoutChildren)
    var selfieHast = mdast2hast(selfieMdast, { allowDangerousHTML: true })
    var titleMdast = mdast2hast(titleMdast)
    var contactMdast = mdast2hast(contactMdast)

    title = titleMdast.children[0].value

    var rootHast = Object.assign({}, rootHastWithoutChildren, {
      children: [
        selfieHast,
        titleMdast,
        contactMdast,
        ...rootMdast.children.slice(3).map(mdast2hast)
      ]
    })
    
    return rootHast
  }
}
