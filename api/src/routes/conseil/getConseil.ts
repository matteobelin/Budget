import express from "express";
import type { Request, Response } from "express";
import type {ConseilDataResponse,ConseilDataError } from "../../interface/ConseilData";
import { userInfoCollection } from "../../dataBase/chromaDB";
import { ConseilSchema } from "../../schema/ConseilSchema";
import { client } from "../../dataBase/redis";

const router = express.Router();

router.post("/", async ( req: Request, res: Response<ConseilDataError | ConseilDataResponse> )=>{
  try {
    const user = (req as any).user;
    const customerId = user.id;
    const result = ConseilSchema.safeParse(req.body);
            
    if (!result.success) {
      res.status(400).json({ message: "Donnée de saisis invalides" });
      return;
    }
            
    const { requete } = result.data;

    const sessionKey = `chat:session:${customerId}`;
    const historyRaw = (await client.lRange(sessionKey, -6, -1)) as string[] | null;

    const history = Array.isArray(historyRaw)
      ? historyRaw.map(item => JSON.parse(item))
      : [];

    await client.rPush(sessionKey, JSON.stringify({ role: 'user', content: requete }));

    const userInfo = await userInfoCollection.query({
      queryTexts: [requete],
      nResults: 5, 
      where: { user_id: customerId }
    });

    const tips = await userInfoCollection.query({
      queryTexts: [requete],
      nResults: 3
    });

    const contextUser = userInfo.documents.flat().join('\n');
    const contextTips = tips.documents.flat().join('\n');

    const prompt = `Voici des informations sur le budget de l'utilisateur :${contextUser}
                    Voici des conseils généraux en gestion de budget :${contextTips}
                    En te basant sur ces informations, réponds à la question suivante :${requete}`;

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          { role: 'system', content: 'Tu es un assistant expert en gestion de budget.' },
          ...history,
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      res.status(500).json({ message: "Erreur lors de l'appel à l'API Mistral" });
      return;
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      res.status(500).json({ message: "Réponse API Mistral inattendue" });
      return;
    }

    const assistantMessage = data.choices[0].message.content;

     await client.rPush(sessionKey, JSON.stringify({ role: 'assistant', content: assistantMessage }));


    res.status(200).json(assistantMessage);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
export default router