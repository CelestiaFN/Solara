import app from "../..";

export default function () {
    app.get("/api/launcher/storefront", async (c) => {
        return c.json({
            "refreshIntervalHrs": 24,
            "dailyPurchaseHrs": 24,
            "expiration": "2024-05-27T00:00:00.000Z",
            "storefronts": [
              {
                "name": "BRDailyStorefront",
                "catalogEntries": [
                  {
                    "offerId": "c806bebc-9fe7-40bd-92ee-6d0b18058396",
                    "offerType": "StaticPrice",
                    "devName": "[VIRTUAL]1x AthenaCharacter:CID_047_Athena_Commando_F_HolidayReindeer for 1200 MtxCurrency",
                    "itemGrants": [
                      {
                        "templateId": "AthenaCharacter:CID_047_Athena_Commando_F_HolidayReindeer",
                        "quantity": 1
                      }
                    ],
                    "requirements": [
                      {
                        "requirementType": "DenyOnItemOwnership",
                        "requiredId": "AthenaCharacter:CID_047_Athena_Commando_F_HolidayReindeer",
                        "minQuantity": 1
                      }
                    ],
                    "categories": [],
                    "metaInfo": [
                      {
                        "Key": "TileSize",
                        "Value": "Normal"
                      },
                      {
                        "Key": "SectionId",
                        "Value": "Daily"
                      },
                      {
                        "Key": "DisplayAssetPath",
                        "Value": "/Game/Catalog/DisplayAssets/DA_Featured_CID_047_Athena_Commando_F_HolidayReindeer.DA_Featured_CID_047_Athena_Commando_F_HolidayReindeer"
                      },
                      {
                        "Key": "BannerOverride",
                        "Value": ""
                      }
                    ],
                    "prices": [
                      {
                        "currencyType": "MtxCurrency",
                        "currencySubType": "Currency",
                        "regularPrice": 1200,
                        "dynamicRegularPrice": -1,
                        "finalPrice": 1200,
                        "basePrice": 1200,
                        "saleExpiration": "9999-12-31T23:59:59.999Z"
                      }
                    ],
                    "bannerOverride": "",
                    "displayAssetPath": "/Game/Catalog/DisplayAssets/DA_Featured_CID_047_Athena_Commando_F_HolidayReindeer.DA_Featured_CID_047_Athena_Commando_F_HolidayReindeer",
                    "refundable": true,
                    "title": "",
                    "description": "",
                    "shortDescription": "",
                    "appStoreId": [],
                    "fulfillmentIds": [],
                    "dailyLimit": -1,
                    "weeklyLimit": -1,
                    "monthlyLimit": -1,
                    "sortPriority": 0,
                    "catalogGroupPriority": 0,
                    "filterWeight": 0
                  },
                  {
                    "offerId": "214a8600-1004-4e79-b813-0069b421a90f",
                    "offerType": "StaticPrice",
                    "devName": "[VIRTUAL]1x AthenaCharacter:CID_268_Athena_Commando_M_RockerPunk for 1200 MtxCurrency",
                    "itemGrants": [
                      {
                        "templateId": "AthenaCharacter:CID_268_Athena_Commando_M_RockerPunk",
                        "quantity": 1
                      }
                    ],
                    "requirements": [
                      {
                        "requirementType": "DenyOnItemOwnership",
                        "requiredId": "AthenaCharacter:CID_268_Athena_Commando_M_RockerPunk",
                        "minQuantity": 1
                      }
                    ],
                    "categories": [],
                    "metaInfo": [
                      {
                        "Key": "TileSize",
                        "Value": "Normal"
                      },
                      {
                        "Key": "SectionId",
                        "Value": "Daily"
                      },
                      {
                        "Key": "DisplayAssetPath",
                        "Value": "/Game/Catalog/DisplayAssets/DA_Featured_CID_268_Athena_Commando_M_RockerPunk.DA_Featured_CID_268_Athena_Commando_M_RockerPunk"
                      },
                      {
                        "Key": "BannerOverride",
                        "Value": ""
                      }
                    ],
                    "prices": [
                      {
                        "currencyType": "MtxCurrency",
                        "currencySubType": "Currency",
                        "regularPrice": 1200,
                        "dynamicRegularPrice": -1,
                        "finalPrice": 1200,
                        "basePrice": 1200,
                        "saleExpiration": "9999-12-31T23:59:59.999Z"
                      }
                    ],
                    "bannerOverride": "",
                    "displayAssetPath": "/Game/Catalog/DisplayAssets/DA_Featured_CID_268_Athena_Commando_M_RockerPunk.DA_Featured_CID_268_Athena_Commando_M_RockerPunk",
                    "refundable": true,
                    "title": "",
                    "description": "",
                    "shortDescription": "",
                    "appStoreId": [],
                    "fulfillmentIds": [],
                    "dailyLimit": -1,
                    "weeklyLimit": -1,
                    "monthlyLimit": -1,
                    "sortPriority": 0,
                    "catalogGroupPriority": 0,
                    "filterWeight": 0
                  },
                  {
                    "offerId": "0f0d9f26-f6a8-4b49-b17a-37c78bff90aa",
                    "offerType": "StaticPrice",
                    "devName": "[VIRTUAL]1x AthenaDance:EID_SomethingStinks for 500 MtxCurrency",
                    "itemGrants": [
                      {
                        "templateId": "AthenaDance:EID_SomethingStinks",
                        "quantity": 1
                      }
                    ],
                    "requirements": [
                      {
                        "requirementType": "DenyOnItemOwnership",
                        "requiredId": "AthenaDance:EID_SomethingStinks",
                        "minQuantity": 1
                      }
                    ],
                    "categories": [],
                    "metaInfo": [
                      {
                        "Key": "TileSize",
                        "Value": "Normal"
                      },
                      {
                        "Key": "SectionId",
                        "Value": "Daily"
                      },
                      {
                        "Key": "DisplayAssetPath",
                        "Value": "/Game/Catalog/DisplayAssets/DA_Featured_EID_SomethingStinks.DA_Featured_EID_SomethingStinks"
                      },
                      {
                        "Key": "BannerOverride",
                        "Value": ""
                      }
                    ],
                    "prices": [
                      {
                        "currencyType": "MtxCurrency",
                        "currencySubType": "Currency",
                        "regularPrice": 500,
                        "dynamicRegularPrice": -1,
                        "finalPrice": 500,
                        "basePrice": 500,
                        "saleExpiration": "9999-12-31T23:59:59.999Z"
                      }
                    ],
                    "bannerOverride": "",
                    "displayAssetPath": "/Game/Catalog/DisplayAssets/DA_Featured_EID_SomethingStinks.DA_Featured_EID_SomethingStinks",
                    "refundable": true,
                    "title": "",
                    "description": "",
                    "shortDescription": "",
                    "appStoreId": [],
                    "fulfillmentIds": [],
                    "dailyLimit": -1,
                    "weeklyLimit": -1,
                    "monthlyLimit": -1,
                    "sortPriority": 0,
                    "catalogGroupPriority": 0,
                    "filterWeight": 0
                  },
                  {
                    "offerId": "5b521a9c-cb0d-4879-acb2-a6e6b568c953",
                    "offerType": "StaticPrice",
                    "devName": "[VIRTUAL]1x AthenaDance:EID_Mime for 500 MtxCurrency",
                    "itemGrants": [
                      {
                        "templateId": "AthenaDance:EID_Mime",
                        "quantity": 1
                      }
                    ],
                    "requirements": [
                      {
                        "requirementType": "DenyOnItemOwnership",
                        "requiredId": "AthenaDance:EID_Mime",
                        "minQuantity": 1
                      }
                    ],
                    "categories": [],
                    "metaInfo": [
                      {
                        "Key": "TileSize",
                        "Value": "Normal"
                      },
                      {
                        "Key": "SectionId",
                        "Value": "Daily"
                      },
                      {
                        "Key": "DisplayAssetPath",
                        "Value": "/Game/Catalog/DisplayAssets/DA_Featured_EID_Mime.DA_Featured_EID_Mime"
                      },
                      {
                        "Key": "BannerOverride",
                        "Value": ""
                      }
                    ],
                    "prices": [
                      {
                        "currencyType": "MtxCurrency",
                        "currencySubType": "Currency",
                        "regularPrice": 500,
                        "dynamicRegularPrice": -1,
                        "finalPrice": 500,
                        "basePrice": 500,
                        "saleExpiration": "9999-12-31T23:59:59.999Z"
                      }
                    ],
                    "bannerOverride": "",
                    "displayAssetPath": "/Game/Catalog/DisplayAssets/DA_Featured_EID_Mime.DA_Featured_EID_Mime",
                    "refundable": true,
                    "title": "",
                    "description": "",
                    "shortDescription": "",
                    "appStoreId": [],
                    "fulfillmentIds": [],
                    "dailyLimit": -1,
                    "weeklyLimit": -1,
                    "monthlyLimit": -1,
                    "sortPriority": 0,
                    "catalogGroupPriority": 0,
                    "filterWeight": 0
                  },
                  {
                    "offerId": "ea2053d8-0c5c-431b-acde-3c3a98f6cc6b",
                    "offerType": "StaticPrice",
                    "devName": "[VIRTUAL]1x AthenaPickaxe:Pickaxe_ID_120_SamuraiUltraArmor for 800 MtxCurrency",
                    "itemGrants": [
                      {
                        "templateId": "AthenaPickaxe:Pickaxe_ID_120_SamuraiUltraArmor",
                        "quantity": 1
                      }
                    ],
                    "requirements": [
                      {
                        "requirementType": "DenyOnItemOwnership",
                        "requiredId": "AthenaPickaxe:Pickaxe_ID_120_SamuraiUltraArmor",
                        "minQuantity": 1
                      }
                    ],
                    "categories": [],
                    "metaInfo": [
                      {
                        "Key": "TileSize",
                        "Value": "Normal"
                      },
                      {
                        "Key": "SectionId",
                        "Value": "Daily"
                      },
                      {
                        "Key": "DisplayAssetPath",
                        "Value": "/Game/Catalog/DisplayAssets/DA_Featured_Pickaxe_ID_120_SamuraiUltraArmor.DA_Featured_Pickaxe_ID_120_SamuraiUltraArmor"
                      },
                      {
                        "Key": "BannerOverride",
                        "Value": ""
                      }
                    ],
                    "prices": [
                      {
                        "currencyType": "MtxCurrency",
                        "currencySubType": "Currency",
                        "regularPrice": 800,
                        "dynamicRegularPrice": -1,
                        "finalPrice": 800,
                        "basePrice": 800,
                        "saleExpiration": "9999-12-31T23:59:59.999Z"
                      }
                    ],
                    "bannerOverride": "",
                    "displayAssetPath": "/Game/Catalog/DisplayAssets/DA_Featured_Pickaxe_ID_120_SamuraiUltraArmor.DA_Featured_Pickaxe_ID_120_SamuraiUltraArmor",
                    "refundable": true,
                    "title": "",
                    "description": "",
                    "shortDescription": "",
                    "appStoreId": [],
                    "fulfillmentIds": [],
                    "dailyLimit": -1,
                    "weeklyLimit": -1,
                    "monthlyLimit": -1,
                    "sortPriority": 0,
                    "catalogGroupPriority": 0,
                    "filterWeight": 0
                  },
                  {
                    "offerId": "7af700b9-e439-4578-ad4b-85246ed562a9",
                    "offerType": "StaticPrice",
                    "devName": "[VIRTUAL]1x AthenaGlider:Glider_ID_039_Venus for 1200 MtxCurrency",
                    "itemGrants": [
                      {
                        "templateId": "AthenaGlider:Glider_ID_039_Venus",
                        "quantity": 1
                      }
                    ],
                    "requirements": [
                      {
                        "requirementType": "DenyOnItemOwnership",
                        "requiredId": "AthenaGlider:Glider_ID_039_Venus",
                        "minQuantity": 1
                      }
                    ],
                    "categories": [],
                    "metaInfo": [
                      {
                        "Key": "TileSize",
                        "Value": "Normal"
                      },
                      {
                        "Key": "SectionId",
                        "Value": "Daily"
                      },
                      {
                        "Key": "DisplayAssetPath",
                        "Value": "/Game/Catalog/DisplayAssets/DA_Featured_Glider_ID_039_Venus.DA_Featured_Glider_ID_039_Venus"
                      },
                      {
                        "Key": "BannerOverride",
                        "Value": ""
                      }
                    ],
                    "prices": [
                      {
                        "currencyType": "MtxCurrency",
                        "currencySubType": "Currency",
                        "regularPrice": 1200,
                        "dynamicRegularPrice": -1,
                        "finalPrice": 1200,
                        "basePrice": 1200,
                        "saleExpiration": "9999-12-31T23:59:59.999Z"
                      }
                    ],
                    "bannerOverride": "",
                    "displayAssetPath": "/Game/Catalog/DisplayAssets/DA_Featured_Glider_ID_039_Venus.DA_Featured_Glider_ID_039_Venus",
                    "refundable": true,
                    "title": "",
                    "description": "",
                    "shortDescription": "",
                    "appStoreId": [],
                    "fulfillmentIds": [],
                    "dailyLimit": -1,
                    "weeklyLimit": -1,
                    "monthlyLimit": -1,
                    "sortPriority": 0,
                    "catalogGroupPriority": 0,
                    "filterWeight": 0
                  }
                ]
              },
              {
                "name": "BRWeeklyStorefront",
                "catalogEntries": [
                  {
                    "offerId": "79049d37-a4e9-4b6d-8e31-6663d61c81c5",
                    "offerType": "StaticPrice",
                    "devName": "[VIRTUAL]1x AthenaCharacter:CID_066_Athena_Commando_F_SkiGirl_GER for 1500 MtxCurrency",
                    "itemGrants": [
                      {
                        "templateId": "AthenaCharacter:CID_066_Athena_Commando_F_SkiGirl_GER",
                        "quantity": 1
                      },
                      {
                        "templateId": "AthenaBackpack:BID_019_SkiGirl_GER",
                        "quantity": 1
                      }
                    ],
                    "requirements": [
                      {
                        "requirementType": "DenyOnItemOwnership",
                        "requiredId": "AthenaCharacter:CID_066_Athena_Commando_F_SkiGirl_GER",
                        "minQuantity": 1
                      },
                      {
                        "requirementType": "DenyOnItemOwnership",
                        "requiredId": "AthenaBackpack:BID_019_SkiGirl_GER",
                        "minQuantity": 1
                      }
                    ],
                    "categories": [],
                    "metaInfo": [
                      {
                        "Key": "TileSize",
                        "Value": "Normal"
                      },
                      {
                        "Key": "SectionId",
                        "Value": "Featured"
                      },
                      {
                        "Key": "DisplayAssetPath",
                        "Value": "/Game/Catalog/DisplayAssets/DA_Featured_CID_066_Athena_Commando_F_SkiGirl_GER.DA_Featured_CID_066_Athena_Commando_F_SkiGirl_GER"
                      },
                      {
                        "Key": "BannerOverride",
                        "Value": ""
                      }
                    ],
                    "prices": [
                      {
                        "currencyType": "MtxCurrency",
                        "currencySubType": "Currency",
                        "regularPrice": 1500,
                        "dynamicRegularPrice": -1,
                        "finalPrice": 1500,
                        "basePrice": 1500,
                        "saleExpiration": "9999-12-31T23:59:59.999Z"
                      }
                    ],
                    "bannerOverride": "",
                    "displayAssetPath": "/Game/Catalog/DisplayAssets/DA_Featured_CID_066_Athena_Commando_F_SkiGirl_GER.DA_Featured_CID_066_Athena_Commando_F_SkiGirl_GER",
                    "refundable": true,
                    "title": "",
                    "description": "",
                    "shortDescription": "",
                    "appStoreId": [],
                    "fulfillmentIds": [],
                    "dailyLimit": -1,
                    "weeklyLimit": -1,
                    "monthlyLimit": -1,
                    "sortPriority": 0,
                    "catalogGroupPriority": 0,
                    "filterWeight": 0
                  },
                  {
                    "offerId": "8ffc309c-a23c-4bce-8405-7ef472786264",
                    "offerType": "StaticPrice",
                    "devName": "[VIRTUAL]1x AthenaCharacter:CID_177_Athena_Commando_M_StreetRacerCobra for 1500 MtxCurrency",
                    "itemGrants": [
                      {
                        "templateId": "AthenaCharacter:CID_177_Athena_Commando_M_StreetRacerCobra",
                        "quantity": 1
                      }
                    ],
                    "requirements": [
                      {
                        "requirementType": "DenyOnItemOwnership",
                        "requiredId": "AthenaCharacter:CID_177_Athena_Commando_M_StreetRacerCobra",
                        "minQuantity": 1
                      }
                    ],
                    "categories": [],
                    "metaInfo": [
                      {
                        "Key": "TileSize",
                        "Value": "Normal"
                      },
                      {
                        "Key": "SectionId",
                        "Value": "Featured"
                      },
                      {
                        "Key": "DisplayAssetPath",
                        "Value": "/Game/Catalog/DisplayAssets/DA_Featured_CID_177_Athena_Commando_M_StreetRacerCobra.DA_Featured_CID_177_Athena_Commando_M_StreetRacerCobra"
                      },
                      {
                        "Key": "BannerOverride",
                        "Value": ""
                      }
                    ],
                    "prices": [
                      {
                        "currencyType": "MtxCurrency",
                        "currencySubType": "Currency",
                        "regularPrice": 1500,
                        "dynamicRegularPrice": -1,
                        "finalPrice": 1500,
                        "basePrice": 1500,
                        "saleExpiration": "9999-12-31T23:59:59.999Z"
                      }
                    ],
                    "bannerOverride": "",
                    "displayAssetPath": "/Game/Catalog/DisplayAssets/DA_Featured_CID_177_Athena_Commando_M_StreetRacerCobra.DA_Featured_CID_177_Athena_Commando_M_StreetRacerCobra",
                    "refundable": true,
                    "title": "",
                    "description": "",
                    "shortDescription": "",
                    "appStoreId": [],
                    "fulfillmentIds": [],
                    "dailyLimit": -1,
                    "weeklyLimit": -1,
                    "monthlyLimit": -1,
                    "sortPriority": 0,
                    "catalogGroupPriority": 0,
                    "filterWeight": 0
                  }
                ]
              }
            ]
          })
    })
}