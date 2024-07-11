import app from "../..";
import verifyAuth from "../../utils/handlers/verifyAuth";


export default function () {
    app.post("/api/v1/assets/Fortnite/*/*", verifyAuth, async (c) => {
        const body: any = await c.req.json();
        if (body.hasOwnProperty("FortCreativeDiscoverySurface") && body.FortCreativeDiscoverySurface == 0) {
            const discovery_api_assets = {
                "FortCreativeDiscoverySurface": {
                    "meta": {
                        "promotion": 1
                    },
                    "assets": {
                        "CreativeDiscoverySurface_Frontend": {
                            "meta": {
                                "revision": 1,
                                "headRevision": 1,
                                "revisedAt": "2022-04-11T16:34:03.517Z",
                                "promotion": 1,
                                "promotedAt": "2022-04-11T16:34:49.510Z"
                            },
                            "assetData": {
                                "AnalyticsId": "t412",
                                "TestCohorts": [
                                    {
                                        "AnalyticsId": "c522715413",
                                        "CohortSelector": "PlayerDeterministic",
                                        "PlatformBlacklist": [],
                                        "ContentPanels": [
                                            {
                                                "NumPages": 1,
                                                "AnalyticsId": "p536",
                                                "PanelType": "AnalyticsList",
                                                "AnalyticsListName": "ByEpicWoven",
                                                "CuratedListOfLinkCodes": [],
                                                "ModelName": "",
                                                "PageSize": 7,
                                                "PlatformBlacklist": [],
                                                "PanelName": "ByEpicWoven",
                                                "MetricInterval": "",
                                                "SkippedEntriesCount": 0,
                                                "SkippedEntriesPercent": 0,
                                                "SplicedEntries": [],
                                                "PlatformWhitelist": [],
                                                "EntrySkippingMethod": "None",
                                                "PanelDisplayName": {
                                                    "Category": "Game",
                                                    "NativeCulture": "",
                                                    "Namespace": "CreativeDiscoverySurface_Frontend",
                                                    "LocalizedStrings": [],
                                                    "bIsMinimalPatch": false,
                                                    "NativeString": "Play Your Way",
                                                    "Key": "ByEpicWoven"
                                                },
                                                "PlayHistoryType": "RecentlyPlayed",
                                                "bLowestToHighest": false,
                                                "PanelLinkCodeBlacklist": [],
                                                "PanelLinkCodeWhitelist": [],
                                                "FeatureTags": [],
                                                "MetricName": ""
                                            }
                                        ],
                                        "PlatformWhitelist": [],
                                        "SelectionChance": 0.1,
                                        "TestName": "Solara"
                                    }
                                ],
                                "GlobalLinkCodeBlacklist": [],
                                "SurfaceName": "CreativeDiscoverySurface_Frontend",
                                "TestName": "20.10_4/11/2022_hero_combat_popularConsole",
                                "primaryAssetId": "FortCreativeDiscoverySurface:CreativeDiscoverySurface_Frontend",
                                "GlobalLinkCodeWhitelist": []
                            }
                        }
                    }
                }
            }
            return c.json(discovery_api_assets)
        }
        else {
            return c.json({
                "FortCreativeDiscoverySurface": {
                    "meta": {
                        "promotion": body.FortCreativeDiscoverySurface || 0
                    },
                    "assets": {}
                }
            })
        }
    })
}