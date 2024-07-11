import mongoose from "mongoose";
import Tokens from "../../database/models/tokens";
export async function updateTokens(
  accountId: string,
  type: string,
  token: any,
  permissions: any[]
): Promise<void> {
  try {
    let existingToken = await Tokens.findOne({ accountId, type });

    existingToken = new Tokens({
      accountId,
      type,
      token,
      permissions,
    });

    await existingToken.save();
  } catch (error) {
    console.error("Error updating tokens:", error);
  }
}
