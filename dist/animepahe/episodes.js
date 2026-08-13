"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpisodes = void 0;

const myManualHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    "Cookie": "cf_clearance=aJPRb3I4waL3ia6t0qGNZ9NlXswJ8DHlykzadLyJfB0-1786564146-1.2.1.1-IaF5aVVLunbDZM2HlKLBBAr0dKlOu4TtLiTrsYYuKf4TjtgtWjqYI1CnOqyls2RD1sr5SteLm4FiO.ewuTjqZETKnlyUPABxzMqvhfXqDdCyeOlwzDJPoXRn8XfDSq5WnOLdI5eoKWAF6Sq8pP9gjzhSHG5.oUIvqAiq.DHaT0swSycLH.876Hj_r9uYZj2HyWotZeH6WIE.k4WR4TL7j1MrAq5ALCl0veS_XqoanmOJ.Qu.svhIX_Ul4Jxyqg2NUOjZsOj8_uelcs1rXuL3xlOSkd3rjXxWrPmjoGv3PR1.UyZqYqgIxiiR3QX7dYxt.swRqcgCcVY4MavZ8rgcKrUQ6lcG6yt4UkyEZQVflQJNDplwdsDN3pITI6J9m.4zVE.D1n665ShGvNg4cT3U4j4OHT7BAoUmOAB6p7WVxxghgGD4bba9gOkVqV0bFadMSGHJ5A5FU9ThFHgu92v5tw;"
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
