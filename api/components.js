const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DB_ID;

async function handler(req, res) {
  // ✅ CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const response = await notion.databases.query({ database_id: databaseId });
    const results = response.results.map((page) => {
      const props = page.properties;
      return {
        ComponentName: props.ComponentName?.title?.[0]?.plain_text || "",
        Description: props.Description?.rich_text?.[0]?.plain_text || "",
      };
    });
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch data from Notion");
  }
}

module.exports = handler;
