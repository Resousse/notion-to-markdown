const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const fs = require('fs').promises;

const notionClient = new Client({ auth: process.env['INPUT_NOTION-TOKEN'] });

const notionToMarkdown = new NotionToMarkdown({ 
  notionClient: notionClient,
    config:{
     convertImagesToBase64: true
  }
 });

(async () => {
  const search = await notionClient.search({});

  search.results.forEach (async result => {
    const baseName = result.url.split('/').pop();

    const mdBlocks = await notionToMarkdown.pageToMarkdown(result.id);

    const { parent } = notionToMarkdown.toMarkdownString(mdBlocks);

    if(typeof parent !== "undefined") {
      await fs.writeFile(`${baseName}.md`, parent);
    }
    await new Promise(r => setTimeout(r, 500));
  });
})();
