import app from "../.."
import getVersion from "../../utils/functions/getVersion";
import verifyAuth from "../../utils/handlers/verifyAuth";
import eventsManager from "../../utils/handlers/events";

export default function () {
    app.get("/fortnite/api/calendar/v1/timeline", verifyAuth, async (c) => {
        const ver = getVersion(c);
        const Events = eventsManager.getEvents(ver);
    
        const storefrontDate = new Date();
        const dUTC = new Date(
          Date.UTC(
            storefrontDate.getUTCFullYear(),
            storefrontDate.getUTCMonth(),
            storefrontDate.getUTCDate(),
            24,
            0,
            0,
            0
          )
        );
        const midnight = new Date(dUTC.getTime() - 60000);
        const storefrontFixed = midnight.toISOString();
    
        return c.json({
          channels: {
            "client-matchmaking": {
              states: [],
              cacheExpire: "9999-01-01T00:00:00.000Z",
            },
            "client-events": {
              states: [
                {
                  validFrom: "0001-01-01T00:00:00.000Z",
                  activeEvents: Events,
                  state: {
                    activeStorefronts: [],
                    eventNamedWeights: {},
                    seasonNumber: ver.season,
                    seasonTemplateId: `AthenaSeason:athenaseason${ver.season}`,
                    matchXpBonusPoints: 0,
                    seasonBegin: "2020-01-01T00:00:00Z",
                    seasonEnd: "9999-01-01T00:00:00Z",
                    seasonDisplayedEnd: "9999-01-01T00:00:00Z",
                    weeklyStoreEnd: storefrontFixed,
                    stwEventStoreEnd: "9999-01-01T00:00:00.000Z",
                    stwWeeklyStoreEnd: "9999-01-01T00:00:00.000Z",
                    sectionStoreEnds: {
                      Featured: storefrontFixed,
                    },
                    dailyStoreEnd: storefrontFixed,
                  },
                },
              ],
              cacheExpire: storefrontFixed,
            },
          },
          eventsTimeOffsetHrs: 0,
          cacheIntervalMins: 10,
          currentTime: new Date().toISOString(),
        });
      });
}