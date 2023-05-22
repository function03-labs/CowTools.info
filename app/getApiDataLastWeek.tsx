import { Batch } from "./datatable/columns";
import chalk from "chalk";

export async function getApiDataLastWeek(): Promise<Batch[]> {
  const batchSize = 1000; // set batch size for pagination
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 162 * 60 * 60 * 1000);
  const firstTradeTimestamp = Math.floor(sevenDaysAgo.getTime() / 1000);

  const promises: Promise<any>[] = [];
  console.log(chalk.yellow("Starting API call long calls"));

  fetch(
    "https://webhook.site/25de2bc8-038b-44d1-a33d-cbaae96afdb6",
    {
      next: { revalidate: 24 * 60 * 60 },

      method: "POST",

      body: JSON.stringify({
        "time": "lastweek"
      }),
    }
  );

  for (let page = 0; page < 20; page++) {
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
    console.log(chalk.yellow(`Fetching data for page ${page}`));

    promises.push(
      fetch(
        "https://us-east-2.aws.data.mongodb-api.com/app/data-fnjyq/endpoint/data/v1/action/find",
        {
          next: { revalidate: 24 * 60 * 60 },
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "api-key": "BVoQG8gP315yFGK3Jnr73DLU4HPj7bIC6fUo9eqbhrNMtDuaKu5dWLppRG9i7Mer",
          },
          method: "POST",
          body: data,
        }

      )
        .then((response) => response.json())
        .then((responseData) => responseData.documents as unknown as Batch[])
        .catch((error) => {
          console.log(chalk.red(error));
          return [];
        })
    );
  }
  console.log(chalk.yellow("Waiting for all promises to resolve"));

  const allData = await Promise.all(promises).then((results) =>
    results.reduce((acc, val) => acc.concat(val), [])
  );

  console.log(
    chalk.green(allData.length),
    chalk.blue("data historical api")
  );

  return allData;
}
