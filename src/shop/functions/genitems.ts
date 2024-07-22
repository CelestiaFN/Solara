import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { TypedItems, CosmeticItems, Apart } from "../utils/TypedItems.js";

function Vintro(intro: any) {
    if (!intro) {
        return false;
    }
    if (intro.chapter && intro.season) {
        if ((intro.chapter === '1' && parseInt(intro.season) >= 1 && parseInt(intro.season) <= 10) ||
            (intro.chapter === '2' && intro.season === '3')) {
            return true;
        }
    }
    return false;
}

const CosmeticTypes = {
    AthenaCharacter: "AthenaCharacter",
    AthenaBackpack: "AthenaBackpack",
    AthenaGlider: "AthenaGlider",
    AthenaPickaxe: "AthenaPickaxe",
    AthenaLoadingScreen: "AthenaLoadingScreen",
    AthenaDance: "AthenaDance"
} as any

const url = "https://fortnite-api.com/v2/cosmetics/br";

function getRandomSet(item: any) {
    const sets: any[] = [];
    const randomSet: { [key: string]: any } = {};

    if (!randomSet[item.backendValue]) {
        randomSet[item.backendValue] = {
            value: item.set?.value || '',
            text: item.set?.text || '',
            backendValue: item.backendValue,
        }
    }

    for (const key in randomSet) {
        const set = randomSet[key];

        if (set.value === "") continue;

        sets.push(set);
    }

    sets.sort((a, b) => {
        return a.value.localeCompare(b.value);
    })

    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    return sets[randomInt(0, sets.length - 1)];
}

axios.get(url)
    .then(response => {
        const data = response.data;

        const Vitems: any[] = [];

        data.data.forEach((item: any) => {
            const intro = item.introduction || null;
            if (Vintro(intro)) {
                const displayAssetPath = item.displayAssetPath ? item.displayAssetPath.replace("FortniteGame/Content", "/Game") : null;
                const lastPath = displayAssetPath ? displayAssetPath.split("/").pop() : null;
                const fullDisplayAssetPath = displayAssetPath ? `${displayAssetPath}.${lastPath}` : null;

                const set = getRandomSet(item);

                const itemType = item.type && typeof item.type === "object" ? item.type.backendValue : null;

                if (itemType && CosmeticTypes[itemType] !== undefined) {
                    item.type.backendValue = CosmeticTypes[itemType];
                }

                if (!itemType) return;

                if (!TypedItems[itemType]) {
                    TypedItems[itemType] = [];
                }

                TypedItems[itemType].push(item);
                CosmeticItems[item.id] = item;

                if (TypedItems.AthenaBackpack) {
                    for (const fortniteBackbling of TypedItems.AthenaBackpack) {
                        if (!fortniteBackbling.itemPreviewHeroPath) continue;

                        const parts = fortniteBackbling.itemPreviewHeroPath.split("/");

                        const cosmetic = CosmeticItems[parts[parts.length - 1]];

                        if (!cosmetic) continue;

                        cosmetic.backpack = fortniteBackbling;

                        Apart[item.id] = fortniteBackbling;
                    }
                }

                const validItem = {
                    id: item.id,
                    type: item.type?.backendValue,
                    rarity: item.rarity?.value,
                    introduction: {
                        chapter: intro.chapter,
                        season: intro.season
                    },
                    added: item.added,
                    displayAssetPath: fullDisplayAssetPath,
                    backpack: CosmeticItems[item.id]?.backpack, 
                    shopHistory: item.shopHistory,
                    set: set
                };
                Vitems.push(validItem);
            }
        });

        const output = path.join(__dirname, '..', '..', '..', 'static', 'storefront', 'items.json');
        fs.writeFileSync(output, JSON.stringify(Vitems, null, 4));
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
