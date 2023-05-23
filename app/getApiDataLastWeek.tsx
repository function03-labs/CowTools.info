import { Batch } from "./datatable/columns";

export async function getApiDataLastWeek(): Promise<Batch[]> {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 162 * 60 * 60 * 1000);
  const firstTradeTimestamp = Math.floor(sevenDaysAgo.getTime() / 1000);

  const data = JSON.stringify({
    collection: process.env.MONGODB_COLLECTION_NAME,
    database: process.env.MONGODB_DB_NAME,
    dataSource: "Cluster0",
    filter: {
      firstTradeTimestamp: { $gte: firstTradeTimestamp },
    },
    limit: 8000,
  });
  const resp_test = fetch(
    "https://webhook.site/d887b08e-01f1-48e1-bcf1-f26e93b15a88",
    {
      next: { revalidate: 24 * 60 * 60 },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": "daily fetch",
      },
      body: JSON.stringify({
        text: "Hello, world, daily fetch!"
      }
      ),
    }
  );
  try {
    const response = await fetch(
      "https://us-east-2.aws.data.mongodb-api.com/app/data-fnjyq/endpoint/data/v1/action/find",
      {
        next: { revalidate: 24 * 60 * 60 },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          "api-key": process.env.API_KEY as string,
        },
        body: data,
      }
    );

    const responseData = await response.json();
    console.log(responseData.documents.length, "data historical api");

    return responseData.documents as unknown as Batch[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
