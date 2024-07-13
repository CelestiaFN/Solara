export function createEvent(eventType: any) {
  return {
    eventType,
    activeUntil: "9999-01-01T00:00:00.000Z",
    activeSince: "2020-01-01T00:00:00.000Z",
  };
}

function getEvents(ver: any) {
  let events = [
    createEvent(`EventFlag.Season${Number(ver.season)}`),
    createEvent(`EventFlag.${ver.lobby}`),
  ];

  if (Number(ver.build) === 4.5) {
    events.push(createEvent("EventFlag.BR_S4_Geode_Countdown"));
  }

  if (Number(ver.build) === 7.2) {
    events.push(createEvent("EventFlag.LTM_14DaysOfFortnite"));
    events.push(createEvent("P1"));
  }

  if (Number(ver.build) === 7.3) {
    events.push(createEvent("F0"));
    events.push(createEvent("FEST_POSTER"));
  }

  if (Number(ver.build) === 8.51) {
    events.push(createEvent("EventFlag.UnvaultingCountdown"));
    events.push(createEvent("GWS1"));
  }

  if (Number(ver.build) === 9.4) {
    events.push(createEvent("CDTime"));
  }

  if (Number(ver.season) === 10) {
    events.push(createEvent("EventFlag.S10_Mystery"));
  }

  if (Number(ver.build) === 10.4) {
    events.push(createEvent("NN1"));
  }

  if (Number(ver.season) === 11) {
    events = events.concat([
      createEvent("EventFlag.LTE_CoinCollectXP"),
      createEvent("EventFlag.LTE_Fortnitemares2019"),
      createEvent("EventFlag.LTE_Galileo_Feats"),
      createEvent("EventFlag.LTE_Galileo"),
      createEvent("EventFlag.LTE_WinterFest2019"),
    ]);

    if (Number(ver.build) >= 11.2) {
      events.push(createEvent("EventFlag.Starlight"));
    }

    if (Number(ver.build) < 11.3) {
      events = events.concat([
        createEvent("EventFlag.Season11.Fortnitemares.Quests.Phase1"),
        createEvent("EventFlag.Season11.Fortnitemares.Quests.Phase2"),
        createEvent("EventFlag.Season11.Fortnitemares.Quests.Phase3"),
        createEvent("EventFlag.Season11.Fortnitemares.Quests.Phase4"),
        createEvent("EventFlag.StormKing.Landmark"),
      ]);
    } else {
      events = events.concat([
        createEvent("EventFlag.HolidayDeco"),
        createEvent("EventFlag.Season11.WinterFest.Quests.Phase1"),
        createEvent("EventFlag.Season11.WinterFest.Quests.Phase2"),
        createEvent("EventFlag.Season11.WinterFest.Quests.Phase3"),
        createEvent("EventFlag.Season11.Frostnite"),
      ]);
    }

    if (Number(ver.build) === 11.31 || Number(ver.build) === 11.4) {
      events = events.concat([
        createEvent("EventFlag.Winterfest.Tree"),
        createEvent("EventFlag.LTE_WinterFest"),
        createEvent("EventFlag.LTE_WinterFest2019"),
      ]);
    }

    if (Number(ver.build) === 12.41) {
      events.push(createEvent("JCD01"));
    }

    if (Number(ver.build) === 12.61) {
      events.push(createEvent("FLA01"));
    }

    if (Number(ver.season) === 13) {
      // if (Number(Bun.env.WL) === 1) {
      //   events.push(createEvent("WL1"));
      // }
      // if (Number(Bun.env.WL) === 2) {
      //   events.push(createEvent("WL2"));
      // }
      // if (Number(Bun.env.WL) === 3) {
      //   events.push(createEvent("WL3"));
      // }
      // if (Number(Bun.env.WL) === 4) {
      //   events.push(createEvent("WL4"));
      // }
      // if (Number(Bun.env.WL) === 5) {
      //   events.push(createEvent("WL5"));
      // }
      // if (Number(Bun.env.WL) === 6) {
      //   events.push(createEvent("WL6"));
      // }
   //   if (Number(Bun.env.WL) === 7) {
        events.push(createEvent("WL7"));
     // }
    }

    if (Number(ver.build) === 13.4) {
      events.push(createEvent("SM1"));
    }

    if (Number(ver.build) === 14.6) {
      events.push(createEvent("FLA01"));
    }

    if (Number(ver.season) === 15) {
      events.push(createEvent("EventFlag.LTQ_S15_Legendary_Week_01"))
      events.push(createEvent("EventFlag.Event_HiddenRole "))
      events.push(createEvent("EventFlag.Event_OperationSnowdown"))
      events.push(createEvent("EventFlag.Event_PlumRetro"))
    }

    if (Number(ver.build) === 17.3) {
      events.push(createEvent("BEL01"));
      events.push(createEvent("BEL02"));
      events.push(createEvent("BEP02"));
      events.push(createEvent("BPLS"));
      events.push(createEvent("BTP"));
      events.push(createEvent("BAP"));
      events.push(createEvent("BTL01"));
    }

    if (Number(ver.build) === 17.5) {
      events.push(createEvent("KEL01"));
      events.push(createEvent("KEL02"));
    }

    if (Number(ver.build) === 18.4 || Number(ver.season) === 18) {
      events.push(createEvent("GGL01"));
      events.push(createEvent("GGL02")); // Chapter 2 Finale Event (Countdown)
      events.push(createEvent("LCCS02"));
      events.push(createEvent("LCCS01"));
      events.push(createEvent("LCCSP01"));
      events.push(createEvent("CTCS01"));
      events.push(createEvent("GCFP01"));
      events.push(createEvent("GCMFP01"));
      events.push(createEvent("CSAWS01"));
      events.push(createEvent("CSAWS02"));
      events.push(createEvent("CSAWS03"));
      events.push(createEvent("CSAWS04"));
      events.push(createEvent("CSAWS05"));
    }

    if (Number(ver.build) === 20.4) {
      // Collision Event
      events.push(createEvent("AL01"));
      events.push(createEvent("AL02"));
    }

    if (Number(ver.build) === 21.4) {
      // Dragon Ball
      events.push(createEvent("Event_S21_Stamina"));
    }

    if (Number(ver.build) === 22.4) {
      // Fracture Event
      events.push(createEvent("RL01"));
    }

    if (Number(ver.build) === 23.1) {
      // Winterfest 2022
      events.push(createEvent("CalendarEvent_Season23_Winterfest"));
      events.push(createEvent("EventFlag.LTE_WinterFestTab"));
    }

    if (Number(ver.build) === 23.5) {
      // Most Wanted tab
      events.push(createEvent("EventFlag.Event_Vaultbreakers"));
    }

    if (Number(ver.build) === 24.4) {
      // Star Wars 2023 tab
      events.push(createEvent("EventFlag.Event_PlotTwist"));
    }

    if (Number(ver.build) === 25.3) {
      // Jujutsu Kaisen tab
      events.push(createEvent("EventFlag.Event_BelongTreaty"));
    }

    if (Number(ver.build) === 27.11) {
      // Durian Event
      events.push(createEvent("DL01"));
      events.push(createEvent("DL02"));
      //    events.push(createEvent("RufusWeek2"))
      //  events.push(createEvent("RufusWeek3"))
      events.push(createEvent("RufusWeek4"));
    }

    if (Number(ver.build) === 28.1) {
      // TMNT Tab countdown
      events.push(createEvent("EventFlag.Event_LinedNotebook_Teaser"));
    }

    if (Number(ver.build) === 28.2) {
      // TMNT mini pass
      events.push(createEvent("EventFlag.Event_LinedNotebook"));
    }

    if (Number(ver.build) === 28.3) {
      //Pre-Emergence Event
      events.push(createEvent("CH5S1CPPE"));
    }

    if (Number(ver.build) === 29.0) {
      events.push(createEvent("EventFlag.Event_S29_SeasonalActivation"));
    }

    if (Number(ver.build) === 29.2 || Number(ver.build) === 29.3) {
      events.push(createEvent("EventFlag.Event_S29_ColdDay"));
      events.push(createEvent("AtlaShrines"));
      events.push(createEvent("AtlaScrolls"));
      events.push(createEvent("AtlaChests"));
    }

    if (Number(ver.build) === 29.4) {
      events.push(createEvent("EventFlag.Event_Osiris"));
      events.push(createEvent("SUPERSPORT_BUILDUP_1"));
      events.push(createEvent("SUPERSPORT_BUILDUP_2"));
      events.push(createEvent("SUPERSPORT_BUILDUP_3"));
      events.push(createEvent("SUPERSPORT_CHARGE_1"));
      events.push(createEvent("SUPERSPORT_STRIKE_1"));
      events.push(createEvent("SUPERSPORT_CHARGE_2"));
      events.push(createEvent("SUPERSPORT_STRIKE_2"));
      events.push(createEvent("SUPERSPORT_CHARGE_3"));
      events.push(createEvent("SUPERSPORT_STRIKE_3"));
      events.push(createEvent("SUPERSPORT_SANDSTORM"));
      events.push(createEvent("SUPERSPORT_LIGHT_2"));
    }
  }
  console.log(events)
  return events;
}

export default {
  getEvents,
  createEvent,
};