import { MongoClient } from "mongodb";
import { Batch } from "@/app/datatable/columns";

export const revalidate = 0;
export async function getDataAsyncQuick(): Promise<Batch[]> {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db(process.env.MONGODB_DB_NAME);
  const collection = db.collection(
    process.env.MONGODB_COLLECTION_NAME as string
  );

  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const query = {
    firstTradeTimestamp: { $gte: Math.floor(twoDaysAgo.getTime() / 1000) },
  };
  const cursor = collection.find(query).sort({ $natural: -1 });
  // only 200 results
  const data = await cursor.toArray();

  await client.close();
  console.log(data.length, "data dn quick");

  return data as unknown as Batch[];
}
