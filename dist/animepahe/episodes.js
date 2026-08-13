"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpisodes = void 0;

// 🛑 PUT YOUR MANUAL KEYS BACK IN HERE 🛑
const myManualHeaders = {
    "User-Agent": "PASTE_USER_AGENT_HERE",
    "Cookie": "cf_clearance=PASTE_COOKIE_HERE;"
};

const getEpisodes = async (args) => {
    const { url, providerContext } = args; // url is the UUID
    const { axios } = providerContext;
    
    // 1. Force fetch internal ID from HTML to prevent the wreq::Error crash
    let internalId = url;
    try {
        const htmlRes = await axios.get(`https://animepahe.pw/anime/${url}`, { headers: myManualHeaders });
        const metaMatch = htmlRes.data.match(/<meta[^>]+name=["']id["'][^>]+content=["'](\d+)["']/i);
        const scriptMatch = htmlRes.data.match(/(?:let|var|const)\s+id\s*=\s*["'](\d+)["']/i);
        if (metaMatch) internalId = metaMatch[1];
        else if (scriptMatch) internalId = scriptMatch[1];
    } catch (e) {}

    const episodes = [];
    let currentPage = 1;
    let lastPage = 1;
    
    try {
        do {
            const res = await axios.get(`https://animepahe.pw/api?m=release&id=${url}&sort=episode_asc&page=${currentPage}`, { headers: myManualHeaders });
            const json = res.data;
            
            if (json && json.data) {
                lastPage = json.last_page || 1;
                for (const ep of json.data) {
                    const finalId = ep.anime_id || internalId; 
                    episodes.push({
                        title: `Episode ${ep.episode}`,
                        link: `${finalId}|${ep.session}`, 
                        image: ep.snapshot || ""
                    });
                }
            } else {
                break;
            }
            currentPage++;
        } while (currentPage <= lastPage);
        
        return episodes;
    } catch (error) {
        return [];
    }
};
exports.getEpisodes = getEpisodes;
