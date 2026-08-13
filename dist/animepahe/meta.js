"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;

// 🛑 PASTE YOUR MANUAL KEYS BACK IN HERE 🛑
const myManualHeaders = {
    "User-Agent": "PASTE_USER_AGENT_HERE",
    "Cookie": "cf_clearance=PASTE_COOKIE_HERE;"
};

const getMeta = async (args) => {
    const { link, providerContext } = args;
    const { axios, cheerio } = providerContext;
    
    try {
        const res = await axios.get(`https://animepahe.pw/anime/${link}`, { headers: myManualHeaders });
        const $ = cheerio.load(res.data);
        
        const title = $('h1').first().text().trim() || "Unknown Title";
        const synopsis = $('.anime-synopsis').text().trim() || "No synopsis available.";
        
        let image = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg";
        
        // THE FIX: Aggressive Regex Search using the exact pattern you found. 
        // This ignores broken HTML classes and scans the raw document for the image.
        const posterRegex = /(https?:\/\/[^\s"'<>]+\/uploads\/posters\/[^\s"'<>]+)/i;
        const match = res.data.match(posterRegex);
        
        if (match && match[1]) {
            image = match[1];
        } else {
            // Fallback just in case
            const fallback = $('.anime-poster img').attr('src') || $('a[href*="uploads/posters"]').attr('href');
            if (fallback) {
                if (fallback.startsWith('//')) image = 'https:' + fallback;
                else if (fallback.startsWith('/')) image = 'https://animepahe.pw' + fallback;
                else image = fallback;
            }
        }

        return {
            title, synopsis, image, type: "series",
            linkList: [{ title: "Episodes", directLinks: [], episodesLink: link, quality: "HD" }],
            webUrl: `https://animepahe.pw/anime/${link}`
        };
    } catch (error) {
        return {
            title: "Metadata Failed", synopsis: "Failed to load page.",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg",
            type: "series", linkList: [{ title: "Episodes", directLinks: [], episodesLink: link, quality: "HD" }],
            webUrl: `https://animepahe.pw/anime/${link}`
        };
    }
};
exports.getMeta = getMeta;
