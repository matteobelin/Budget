import { ChromaClient, ChromaUniqueError } from 'chromadb';

const client = new ChromaClient({ path: process.env.CHROMADB_URL });

export let tipsCollection: any;     
export let userInfoCollection: any;  

async function initCollections(): Promise<void> {
  try {
    tipsCollection = await client.createCollection({ name: 'budget_tips' });
  } catch (error) {
    if (error instanceof ChromaUniqueError) {
      tipsCollection = await client.getCollection({ name: 'budget_tips' });
    } else {
      throw error;
    }
  }

  try {
    userInfoCollection = await client.createCollection({ name: 'budget_user_info' });
  } catch (error) {
    if (error instanceof ChromaUniqueError) {
      userInfoCollection = await client.getCollection({ name: 'budget_user_info' });
    } else {
      throw error;
    }
  }
}

await initCollections();
