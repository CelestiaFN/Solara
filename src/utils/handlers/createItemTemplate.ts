import axios from 'axios';

export async function createItemTemplate(templateId: any) {
    const resp = await axios.get("https://fortnite-api.com/v2/cosmetics");
    const data = resp.data.data;
    let variants: any = [];

    for (let key in data) {
        if (Array.isArray(data[key])) {
            const item = data[key].find((item: any) => item.id === templateId);

            if (item && item.variants) {
                item.variants.forEach((obj: any) => {
                    variants.push({
                        "channel": obj.channel || "",
                        "active": obj.options[0].tag || "",
                        "owned": obj.options.map((variant: any) => variant.tag || "")
                    });
                });
            }
        }
    }

    return {
        templateId: templateId,
        attributes: {
            max_level_bonus: 0,
            level: 1,
            item_seen: false,
            xp: 0,
            variants: variants,
            favorite: false,
        },
        quantity: 1,
    };
}
