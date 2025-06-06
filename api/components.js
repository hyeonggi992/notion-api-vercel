export default async function handler(req, res) {
  // ✅ CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("X-Debug-Route", "components-handler");

  // ✅ OPTIONS 요청에 대한 빠른 응답
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    console.log("🔥 Notion API 요청 시작");

    const { Client } = require("@notionhq/client");
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const databaseId = process.env.NOTION_DB_ID;

    const response = await notion.databases.query({ database_id: databaseId });

    const results = response.results.map((page) => {
      const props = page.properties;
      return {
        ComponentName: props.ComponentName?.title?.[0]?.plain_text || "",
        Description: props.Description?.rich_text?.[0]?.plain_text || "",
      };
    });

    console.log("✅ Notion 데이터 fetch 성공");
    res.status(200).json(results);
  } catch (error) {
    console.error("❌ Notion API Error:", error);
    res.status(500).json({ message: "Failed to fetch data from Notion" });
  }
}
