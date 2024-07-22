import axios from 'axios';

export async function createItemTemplate(templateId: any) {
    const results = [];
    
    if (Array.isArray(templateId)) {
        if (templateId.length === 1 && typeof templateId[0] === 'string') {
            templateId = templateId[0];
        } else {
            return null;
        }
    }

    if (typeof templateId !== 'string') {
        return null;
    }

    if (templateId === 'Currency:MtxGiveaway') {
        return null;
    }

    const cleanedTemplateId = templateId.replace(/(AthenaCharacter|AthenaPickaxe|AthenaGlider|AthenaDance):/, '');

    try {
        let variants: any = [];
        if (templateId.includes("AthenaCharacter") || templateId.includes("AthenaBackpack")) {
            const resp = await axios.get(`https://fortnite-api.com/v2/cosmetics/br/${cleanedTemplateId}`);
            const data = resp.data.data;
        
            if (!data) {
                return null;
            }
        
            if (data.variants) {
                data.variants.forEach((obj: any) => {
                    variants.push({
                        "channel": obj.channel || "",
                        "active": obj.options[0].tag || "",
                        "owned": obj.options.map((variant: any) => variant.tag || "")
                    });
                });
            }
        }
    
        const template = {
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
    
        console.log(template)
        results.push(template);
    
    } catch (error) {
        console.error(`templateId: ${cleanedTemplateId}`);
        console.error(`Error on request: ${error}`);
    }
    
    return results;
}
