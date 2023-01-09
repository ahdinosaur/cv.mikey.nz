import { write, read } from 'to-vfile'
import { reporter } from 'vfile-reporter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkEmoji from 'remark-html-emoji-image'
import remarkRehype from 'remark-rehype'
import rehypeDocument from 'rehype-document'
import rehypeRaw from 'rehype-raw'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'

async function process ({ inputPath, outputPath, title }) {
  const inputFile = await read(inputPath)

  const outputFile = await unified()
    .use(remarkParse)
    .use(remarkEmoji, { base: '/images/' })
    .use(remarkRehype, {
      allowDangerousHtml: true
    })
    .use(rehypeRaw)
    .use(rehypeDocument, {
      title,
      css: [
        '/index.css'
      ]
    })
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(inputFile)

  console.error(reporter(outputFile))

  await write({
    path: outputPath,
    value: outputFile.value
  })
}

Promise.all([
  process({
    inputPath: 'README.md',
    outputPath: 'public/index.html',
    title: '😺🎉 Mikey Williams ☀️🌈'
  }),
  process({
    inputPath: 'references/mix.md',
    outputPath: 'public/references/mix.html',
    title: 'Mix on Mikey Williams'
  })
])
