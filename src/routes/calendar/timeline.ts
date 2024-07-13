import app from "../.."
import getVersion from "../../utils/functions/getVersion";
import verifyAuth from "../../utils/handlers/verifyAuth";
import eventsManager from '../../utils/handlers/events'

export default function () {
  app.get("/fortnite/api/calendar/v1/timeline", verifyAuth, async (c) => {
    const ver = getVersion(c);
    let events = [
      eventsManager.createEvent(`EventFlag.Season${Number(ver.season)}`),
      eventsManager.createEvent(`EventFlag.${ver.lobby}`),
    ];

    if (Number(ver.build) === 4.5) {
      events.push(eventsManager.createEvent("EventFlag.BR_S4_Geode_Countdown"));
    }

    if (Number(ver.build) === 7.2) {
      events.push(eventsManager.createEvent("EventFlag.LTM_14DaysOfFortnite"));
      events.push(eventsManager.createEvent("P1"));
    }

    if (Number(ver.build) === 7.3) {
      events.push(eventsManager.createEvent("F0"));
      events.push(eventsManager.createEvent("FEST_POSTER"));
    }

    if (Number(ver.build) === 8.51) {
      events.push(eventsManager.createEvent("EventFlag.UnvaultingCountdown"));
      events.push(eventsManager.createEvent("GWS1"));
    }

    if (Number(ver.build) === 9.4) {
      events.push(eventsManager.createEvent("CDTime"));
    }

    if (Number(ver.season) === 10) {
      events.push(eventsManager.createEvent("EventFlag.S10_Mystery"));
    }

    if (Number(ver.build) === 10.4) {
      events.push(eventsManager.createEvent("NN1"));
    }

    if (Number(ver.build) === 12.41) {
      events.push(eventsManager.createEvent("JCD01"));
    }

    if (Number(ver.build) === 12.61) {
      events.push(eventsManager.createEvent("FLA01"));
    }

    if (Number(ver.season) === 13) {
      if (Number(Bun.env.WL) === 1) {
        events.push(eventsManager.createEvent("WL1"));
      }
      if (Number(Bun.env.WL) === 2) {
        events.push(eventsManager.createEvent("WL2"));
      }
      if (Number(Bun.env.WL) === 3) {
        events.push(eventsManager.createEvent("WL3"));
      }
      if (Number(Bun.env.WL) === 4) {
        events.push(eventsManager.createEvent("WL4"));
      }
      if (Number(Bun.env.WL) === 5) {
        events.push(eventsManager.createEvent("WL5"));
      }
      if (Number(Bun.env.WL) === 6) {
        events.push(eventsManager.createEvent("WL6"));
      }
        if (Number(Bun.env.WL) === 7) {
      events.push(eventsManager.createEvent("WL7"));
      }
    }

    if (Number(ver.build) === 13.4) {
      events.push(eventsManager.createEvent("SM1"));
    }

    if (Number(ver.build) === 14.6) {
      events.push(eventsManager.createEvent("FLA01"));
    }

    if (Number(ver.season) === 15) {
      events.push(eventsManager.createEvent("EventFlag.LTQ_S15_Legendary_Week_01"))
      events.push(eventsManager.createEvent("EventFlag.Event_HiddenRole "))
      events.push(eventsManager.createEvent("EventFlag.Event_OperationSnowdown"))
      events.push(eventsManager.createEvent("EventFlag.Event_PlumRetro"))
    }

    console.log(events)

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
              activeEvents: events,
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