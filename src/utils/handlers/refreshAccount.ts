import logger from "../logger/logger";
import { config } from "../..";

export async function refreshAccount(accountId: string, username: string) {
  try {
    const response = await fetch(
      `http://127.0.0.1:${config.PORT}/fortnite/api/game/v3/profile/${accountId}/client/emptygift`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerId: "e406693aa12adbc8b04ba7e6409c8ab3d598e8c3",
          currency: "MtxCurrency",
          currencySubType: "",
          expectedTotalPrice: "0",
          gameContext: "",
          receiverAccountIds: [accountId],
          giftWrapTemplateId: "GiftBox:gb_makegood",
          personalMessage: "Thank you for playing Fortnite",
          accountId: accountId,
          playerName: username,
          receiverPlayerName: username,
        }),
      },
    );

    if (!response.ok) {
      logger.error(`HTTP Error: ${response.status} - ${response.statusText}`);
      return;
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
}