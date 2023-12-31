import { Request, Response, NextFunction } from "express";
import { getIronSession } from "iron-session";
import { SiweMessage } from "siwe";
import {
  db,
  emailPreferences,
  eq,
  users,
} from "@district-labs/intentify-database";
import { SafeProxy, WalletFactory } from '@district-labs/intentify-deployments' 
import { DEFAULT_SALT, walletFactoryABI } from '@district-labs/intentify-core' 
import { ironOptions } from "../../iron-session";
import { z } from "zod";
import { publicClients } from "../../blockchain-clients";

const verifySchema = z.object({
  signature: z.string(),
  message: z.object({
    domain: z.string(),
    address: z.string(),
    statement: z.string(),
    uri: z.string(),
    version: z.string(),
    chainId: z.number(),
    nonce: z.string(),
    issuedAt: z.string(),
  }),
});

export const authSiweSignIn = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const session = await getIronSession(request, response, ironOptions);
    const { message, signature } = verifySchema.parse(await request.body);
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.validate(signature);
    if (fields.nonce !== session.nonce) {
      return response
        .status(422)
        .json(JSON.stringify({ message: "Invalid nonce." }));
    }

    session.siwe = fields;
    session.address = fields.address;

    const user = await db.query.users.findFirst({
      where: eq(users.address, fields.address),
    });

    if (user) {
      session.user = user;
    } else {
      const client = publicClients[fields.chainId]
      if(!client) throw new Error('Invalid chainId')
      const data = await client.readContract({
        address: WalletFactory[fields.chainId],
        abi: walletFactoryABI,
        functionName: 'getDeterministicWalletAddress',
        args: [SafeProxy[fields.chainId], fields.address, DEFAULT_SALT],
      })

      session.address = fields.address;
      await db.insert(users).values({
        address: fields.address,
        safeAddress: data as string,
      });

      await db.insert(emailPreferences).values({
        marketing: false,
        newsletter: false,
        transactional: true,
        userId: session.address,
      });
    }

    await session.save();
    return response.status(200).json({ oke: true });
  } catch (error) {
    next(error);
  }
};
