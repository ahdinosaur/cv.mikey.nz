import { argv } from 'node:process'
import { write, read } from 'to-vfile'
import { reporter } from 'vfile-reporter'
import { unified } from 'unified'
import markdown from 'remark-parse'
import htmlEmojiImage from 'remark-html-emoji-image'
import mdast2hast from 'remark-rehype'
import doc from 'rehype-document'
import format from 'rehype-format'
import html from 'rehype-stringify'
import raw from 'rehype-raw'

const outputDir = argv[2]

async function process ({ inputPath, outputPath, title }) {
  const inputFile = await read(inputPath)

  const outputFile = await unified()
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
    .process(inputFile)

  console.error(reporter(outputFile))

  await write({
    path: outputPath,
    value: outputFile.value
  })
}

process({
  inputPath: 'README.md',
  outputPath: 'public/index.html',
  title: '😺🎉 Mikey Williams ☀️🌈'
})
process({
  inputPath: 'references/mix.md',
  outputPath: 'public/references/mix.html',
  title: 'Mix on Mikey Williams'
})
