const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DB_ID;

module.exports = async (req, res) => {
  // ✅ CORS 헤더: origin null 포함 허용
  res.setHeader("Access-Control-Allow-Origin", "*"); // or use 'null' explicitly if needed
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ OPTIONS 사전 요청 처리
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
console.log("🔥 Notion fetch triggered");	

    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const results = response.results.map((page) => {
      const props = page.properties;
      return {
        ComponentName: props.ComponentName?.title?.[0]?.plain_text || "",
        Description: props.Description?.rich_text?.[0]?.plain_text || "",
      };
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("❌ Notion API Error:", error);
    res.status(500).json({ message: "Failed to fetch data from Notion" });
  }
};
