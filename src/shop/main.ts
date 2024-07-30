import cron from 'node-cron';
import fs from 'fs';
import logger from '../utils/logger/logger';
import { prices } from './types/prices';
import { v4 } from 'uuid';
import { config } from '..';

interface Item {
    set: any;
    id: string;
    shopHistory?: any[];
    type: string;
    rarity?: string;
    backpack?: { type: { backendValue: string }; id: string };
}

const itemsJson: Item[] = require('../../static/storefront/items.json');

async function createShopConfig() {
    logger.startup('Creating shop...');
    const eligibleItems = (itemsJson as Item[]).filter(
        (item: Item) => item.shopHistory && item.shopHistory.length > 0 && item.type !== 'AthenaLoadingScreen' && item.type !== 'AthenaSkyDiveContrail'
    );

    if (eligibleItems.length < 8) {
        logger.startup('Not enough items for shop');
        return;
    }

    const eligibleSkins = eligibleItems.filter((item: Item) => item.type === 'AthenaCharacter');
    const danceItems = eligibleItems.filter((item: Item) => item.type === 'AthenaDance');
    const pickaxeItems = eligibleItems.filter((item: Item) => item.type === 'AthenaPickaxe');
    const gliderItems = eligibleItems.filter((item: Item) => item.type === 'AthenaGlider');

    if (eligibleSkins.length < 2 || danceItems.length < 2 || pickaxeItems.length < 1 || gliderItems.length < 1) {
        logger.startup('not enough daily items');
        return;
    }

    const featuredItems: Item[] = [];
    const usedIndices = new Set<number>();

    const epicAndLegendarySkins = eligibleSkins.filter((item: Item) =>
        item.rarity === 'epic' || item.rarity === 'legendary'
    );

    while (featuredItems.length < 1) {
        const randomIndex = Math.floor(Math.random() * epicAndLegendarySkins.length);
        if (!usedIndices.has(randomIndex)) {
            featuredItems.push(epicAndLegendarySkins[randomIndex]);
            usedIndices.add(randomIndex);
        }
    }

    const includeGlider = Math.random() < 0;
    if (includeGlider) {
        const randomGliderIndex = Math.floor(Math.random() * gliderItems.length);
        featuredItems.push(gliderItems[randomGliderIndex]);
    }

    const dailyItems: Item[] = [];
    const usedDailyIndices = new Set<number>();

    while (dailyItems.filter(item => item.type === 'AthenaCharacter' && item.rarity && ['rare', 'epic', 'uncommon'].includes(item.rarity)).length < 2) {
        const randomAthenaCharacterIndex = Math.floor(Math.random() * eligibleSkins.length);
        const dailyAthenaCharacterItem = eligibleSkins[randomAthenaCharacterIndex];
        if (dailyAthenaCharacterItem.rarity && ['rare', 'epic', 'uncommon'].includes(dailyAthenaCharacterItem.rarity)) {
            dailyItems.push(dailyAthenaCharacterItem);
            const index = eligibleSkins.indexOf(dailyAthenaCharacterItem);
            eligibleSkins.splice(index, 1);
        }
    }

    while (dailyItems.filter(item => item.type === 'AthenaDance' && item.rarity && ['rare', 'epic', 'uncommon'].includes(item.rarity!)).length < 2) {
        const randomIndex = Math.floor(Math.random() * danceItems.length);
        if (!usedDailyIndices.has(randomIndex) && danceItems[randomIndex].rarity && ['rare', 'epic', 'uncommon'].includes(danceItems[randomIndex].rarity)) {
            dailyItems.push(danceItems[randomIndex]);
            usedDailyIndices.add(randomIndex);
        }
    }

    let randomPickaxeIndexDaily = Math.floor(Math.random() * pickaxeItems.length);
    const pickaxeRarity = pickaxeItems[randomPickaxeIndexDaily].rarity;
    if (pickaxeRarity && ['rare', 'epic', 'uncommon'].includes(pickaxeRarity)) {
        dailyItems.push(pickaxeItems[randomPickaxeIndexDaily]);
    }

    let randomGliderIndexDaily = Math.floor(Math.random() * gliderItems.length);
    if (gliderItems[randomGliderIndexDaily].rarity && ['rare', 'epic', 'uncommon'].includes(gliderItems[randomGliderIndexDaily].rarity)) {
        dailyItems.push(gliderItems[randomGliderIndexDaily]);
    }

    const specialItems: Item[] = [];

    const specialJson = JSON.parse(fs.readFileSync("static/cosmetics/special.json", "utf8"));

    for (const [type, items] of Object.entries(specialJson)) {
        (items as any[]).forEach((item: any) => {
            const [key, value]: [string, { active: boolean, price: number }] = Object.entries(item)[0] as [string, { active: boolean, price: number }];
            if (value.active) {
                specialItems.push({
                    id: key,
                    type,
                    set: null,
                    rarity: undefined,
                    shopHistory: undefined,
                    backpack: undefined
                });
            }
        });
    }

    const todayAtMidnight = new Date();
    todayAtMidnight.setHours(0, 0, 0, 0);
    const isoDate = todayAtMidnight.toISOString();

    const shopConfig = {
        refreshIntervalHrs: 24,
        dailyPurchaseHrs: 24,
        expiration: isoDate,
        storefronts: []
    };

    type ItemType = keyof typeof prices;
    type ItemRarity = keyof typeof prices[ItemType];

    const dailyStorefront = {
        name: "BRDailyStorefront",
        catalogEntries: [] as any[]
    };

    const specialStorefront = {
        name: "BRSpecialFeatured",
        catalogEntries: [] as any[]
    };

    const weeklyStorefront = {
        name: "BRWeeklyStorefront",
        catalogEntries: [] as any[]
    };

    if (config.SPECIALSHOP == 'true') {
        specialItems.forEach((item) => {
            const specialItemData = specialJson[item.type].find((i: any) => i[item.id]);
            const price = specialItemData[item.id].price; 
            const displayAssets = require("../../static/storefront/displayassets.json")
            const displayAssetPath = displayAssets[item.id];

            const entry = {
                offerId: "v2:/" + v4(),
                offerType: "StaticPrice",
                devName: `[VIRTUAL]1x ${item.type}:${item.id} for ${price} MtxCurrency`,
                itemGrants: [
                    {
                        templateId: `${item.type}:${item.id}`,
                        quantity: 1
                    },
                ],
                requirements: [
                    {
                        requirementType: "DenyOnItemOwnership",
                        requiredId: `${item.type}:${item.id}`,
                        minQuantity: 1
                    },
                ],
                categories: [],
                metaInfo: [
                    { Key: "TileSize", Value: "Normal" },
                    { Key: "SectionId", Value: "Daily" },
                    { Key: "DisplayAssetPath", Value: displayAssetPath ? displayAssetPath : `/Game/Catalog/DisplayAssets/DA_Featured_${item.id}.DA_Featured_${item.id}` },
                    { Key: "BannerOverride", Value: "" }
                ],
                prices: [
                    {
                        currencyType: "MtxCurrency",
                        currencySubType: "Currency",
                        regularPrice: price,
                        dynamicRegularPrice: -1,
                        finalPrice: price,
                        basePrice: price,
                        saleExpiration: "9999-12-31T23:59:59.999Z"
                    }
                ],
                giftInfo: {
                    bIsEnabled: true,
                    forcedGiftBoxTemplateId: "",
                    giftRecordIds: [],
                    purchaseRequirements: [
                        {
                            requirementType: "DenyOnItemOwnership",
                            requiredId: `${item.type}:${item.id}`,
                            minQuantity: 1
                        }
                    ]
                },
                bannerOverride: "",
                displayAssetPath: displayAssetPath ? displayAssetPath : `/Game/Catalog/DisplayAssets/DA_Featured_${item.id}.DA_Featured_${item.id}`,
                refundable: true,
                title: "",
                description: "",
                shortDescription: "",
                appStoreId: [],
                fulfillmentIds: [],
                dailyLimit: -1,
                weeklyLimit: -1,
                monthlyLimit: -1,
                sortPriority: 0,
                catalogGroupPriority: 0,
                filterWeight: 0
            };

            specialStorefront.catalogEntries.push(entry);
        });
    }

    dailyItems.forEach((item) => {
        const itemType: ItemType = item.type as ItemType;
        const itemRarity: ItemRarity = item.rarity as ItemRarity;
        const price = prices[itemType][itemRarity];
        const displayAssets = require("../../static/storefront/displayassets.json")
        const displayAssetPath = displayAssets[item.id];

        const entry = {
            offerId: "v2:/" + v4(),
            offerType: "StaticPrice",
            devName: `[VIRTUAL]1x ${item.type}:${item.id} for ${price} MtxCurrency`,
            itemGrants: [
                {
                    templateId: `${item.type}:${item.id}`,
                    quantity: 1
                },
                ...(item.backpack ? [
                    {
                        templateId: `${item.backpack.type.backendValue}:${item.backpack.id}`,
                        quantity: 1
                    }
                ] : []),
            ],
            requirements: [
                {
                    requirementType: "DenyOnItemOwnership",
                    requiredId: `${item.type}:${item.id}`,
                    minQuantity: 1
                },
                ...(item.backpack ? [
                    {
                        requirementType: "DenyOnItemOwnership",
                        requiredId: `${item.backpack.type.backendValue}:${item.backpack.id}`,
                        minQuantity: 1
                    }
                ] : [])
            ],
            categories: [],
            metaInfo: [
                { Key: "TileSize", Value: "Normal" },
                { Key: "SectionId", Value: "Daily" },
                { Key: "DisplayAssetPath", Value: displayAssetPath ? displayAssetPath : `/Game/Catalog/DisplayAssets/DA_Featured_${item.id}.DA_Featured_${item.id}` },
                { Key: "BannerOverride", Value: "" }
            ],
            prices: [
                {
                    currencyType: "MtxCurrency",
                    currencySubType: "Currency",
                    regularPrice: price,
                    dynamicRegularPrice: -1,
                    finalPrice: price,
                    basePrice: price,
                    saleExpiration: "9999-12-31T23:59:59.999Z"
                }
            ],
            giftInfo: {
                bIsEnabled: true,
                forcedGiftBoxTemplateId: "",
                giftRecordIds: [],
                purchaseRequirements: [
                    {
                        requirementType: "DenyOnItemOwnership",
                        requiredId: `${item.type}:${item.id}`,
                        minQuantity: 1
                    },
                    ...(item.backpack ? [
                        {
                            requirementType: "DenyOnItemOwnership",
                            requiredId: `${item.backpack.type.backendValue}:${item.backpack.id}`,
                            minQuantity: 1
                        }
                    ] : [])
                ]
            },
            bannerOverride: "",
            displayAssetPath: displayAssetPath ? displayAssetPath : `/Game/Catalog/DisplayAssets/DA_Featured_${item.id}.DA_Featured_${item.id}`,
            refundable: true,
            title: "",
            description: "",
            shortDescription: "",
            appStoreId: [],
            fulfillmentIds: [],
            dailyLimit: -1,
            weeklyLimit: -1,
            monthlyLimit: -1,
            sortPriority: 0,
            catalogGroupPriority: 0,
            filterWeight: 0
        };

        dailyStorefront.catalogEntries.push(entry);
    });

    const setGroups: { [key: string]: Item[] } = {};
    eligibleItems.forEach(item => {
        if (item.set && item.set.value) {
            if (!setGroups[item.set.value]) {
                setGroups[item.set.value] = [];
            }
            setGroups[item.set.value].push(item);
        }
    });

    const setKeys = Object.keys(setGroups);
    const shuffledKeys = shuffleSets(setKeys);
    const selectedKeys = shuffledKeys.slice(0, 5);

    function shuffleSets(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    selectedKeys.forEach(setValue => {
        const groupItems = setGroups[setValue];
        if (groupItems.length < 1) {
            return;
        }
        groupItems.forEach(item => {
            const itemType: ItemType = item.type as ItemType;
            const itemRarity: ItemRarity = item.rarity as ItemRarity;
            const displayAssets = require("../../static/storefront/displayassets.json")
            const displayAssetPath = "/Game/Catalog/DisplayAssets/" + displayAssets[item.id] + "." + displayAssets[item.id];
            const price = prices[itemType]?.[itemRarity];

            if (price === undefined) {
                return;
            }

            if (itemType == "AthenaBackpack") {
                return;
            }

            const entry = {
                offerId: "v2:/" + v4(),
                offerType: "StaticPrice",
                devName: `[VIRTUAL]1x ${item.type}:${item.id} for ${price} MtxCurrency`,
                itemGrants: [
                    {
                        templateId: `${item.type}:${item.id}`,
                        quantity: 1
                    },
                    ...(item.backpack ? [
                        {
                            templateId: `${item.backpack.type.backendValue}:${item.backpack.id}`,
                            quantity: 1
                        }
                    ] : []),
                ],
                requirements: [
                    {
                        requirementType: "DenyOnItemOwnership",
                        requiredId: `${item.type}:${item.id}`,
                        minQuantity: 1
                    },
                    ...(item.backpack ? [
                        {
                            requirementType: "DenyOnItemOwnership",
                            requiredId: `${item.backpack.type.backendValue}:${item.backpack.id}`,
                            minQuantity: 1
                        }
                    ] : [])
                ],
                categories: item.set ? [`${item.set.value}`] : [],
                metaInfo: [
                    { Key: "TileSize", Value: "Normal" },
                    { Key: "SectionId", Value: "Featured" },
                    { Key: "DisplayAssetPath", Value: displayAssetPath ? displayAssetPath : `` },
                    { Key: "BannerOverride", Value: "" }
                ],
                prices: [
                    {
                        currencyType: "MtxCurrency",
                        currencySubType: "Currency",
                        regularPrice: price,
                        dynamicRegularPrice: -1,
                        finalPrice: price,
                    }
                ],
                giftInfo: {
                    bIsEnabled: true,
                    forcedGiftBoxTemplateId: "",
                    giftRecordIds: [],
                    purchaseRequirements: [
                        {
                            requirementType: "DenyOnItemOwnership",
                            requiredId: `${item.type}:${item.id}`,
                            minQuantity: 1
                        },
                        ...(item.backpack ? [
                            {
                                requirementType: "DenyOnItemOwnership",
                                requiredId: `${item.backpack.type.backendValue}:${item.backpack.id}`,
                                minQuantity: 1
                            }
                        ] : [])
                    ]
                },
                bannerOverride: "",
                displayAssetPath: displayAssetPath ? displayAssetPath : ``,
                refundable: true,
                title: "",
                description: "",
                shortDescription: "",
                appStoreId: [],
                fulfillmentIds: [],
                dailyLimit: -1,
                weeklyLimit: -1,
                monthlyLimit: -1,
                sortPriority: 0,
                catalogGroupPriority: 0,
                filterWeight: 0
            };

            weeklyStorefront.catalogEntries.push(entry);
        });
    });

    shopConfig.storefronts.push(dailyStorefront as never);
    shopConfig.storefronts.push(weeklyStorefront as never);
    if (config.SPECIALSHOP == 'true') {
        shopConfig.storefronts.push(specialStorefront as never);
    }

    fs.writeFile('static/data/storefront.json', JSON.stringify(shopConfig, null, 2), 'utf-8', async (err: any) => {
        if (err) {
            console.error(err);
            return;
        }
        logger.startup('New Solara shop has been created');
    });
}

if (process.argv[2] === 'now') {
    createShopConfig();
} else {
    logger.startup('Shop System Started');
    const scheduleTime = `0 0 * * *`;
    cron.schedule(scheduleTime, createShopConfig);
}

export { createShopConfig };