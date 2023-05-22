import { Batch } from "./datatable/columns";

export async function getApiDataLastWeek(): Promise<Batch[]> {
  const batchSize = 2500; // set batch size for pagination
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 162 * 60 * 60 * 1000);
  const firstTradeTimestamp = Math.floor(sevenDaysAgo.getTime() / 1000);

  let page = 0;
  let allData: Batch[] = [];

  while (true) {
    const data = JSON.stringify({
      collection: process.env.MONGODB_COLLECTION_NAME,
      database: process.env.MONGODB_DB_NAME,
      dataSource: "Cluster0",
      filter: {
        firstTradeTimestamp: { $gte: firstTradeTimestamp },
      },
      sort: {
        firstTradeTimestamp: -1,
      },
      limit: batchSize,
      skip: page * batchSize,
    });
    //make a call to this api and send lastweek data post
    //https://webhook.site/25de2bc8-038b-44d1-a33d-cbaae96afdb6

    try {
      const response = await fetch(
        "https://us-east-2.aws.data.mongodb-api.com/app/data-fnjyq/endpoint/data/v1/action/find",
        {
          next: { revalidate: 24 * 60 * 60 },
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "api-key": "5KHg7ImnBlNQlXkGGbyyB4LFoN0g9hk4fxUdWJbyKdd1bxo3DDrr48YjCHQquWMG",
          },
          body: data,
        }
      );

      const responseData = await response.json();
      console.log(responseData.documents.length, "data historical api");

      if (responseData.documents.length === 0) {
        break; // break out of loop if no more data
      }

      allData.push(...(responseData.documents as unknown as Batch[]));
      page++;
    } catch (error) {
      console.log(error);
      break;
    }
  }

  return allData;
}
