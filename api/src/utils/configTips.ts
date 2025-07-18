import tips from './tips.json';
import { v4 as uuidv4 } from 'uuid';
import { tipsCollection } from '../dataBase/chromaDB';  

async function initializeTips() {
  const existing = await tipsCollection.count(); 

  if (existing > 0) {
    console.log("Tips déjà initialisés, skip");
    return;
  }

  const ids = tips.map(() => uuidv4());
  const documents = tips;

  await tipsCollection.add({ ids, documents });
  console.log("Tips initialisés");
}
export default initializeTips