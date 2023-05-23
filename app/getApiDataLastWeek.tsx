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

  try {
    const response = await fetch(
      "https://us-east-2.aws.data.mongodb-api.com/app/data-fnjyq/endpoint/data/v1/action/find?t",
      {
        next: { revalidate: 86400 },
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
