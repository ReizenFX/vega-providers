"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpisodes = void 0;

const getEpisodes = async (args) => {
    const { url, providerContext } = args; 
    const { axios, openWebView, commonHeaders } = providerContext;
    const baseUrl = "https://animepahe.pw";
    
    let wafCookies = "";
    try {
        await axios.get(baseUrl, { headers: { ...commonHeaders } });
    } catch (e) {
        const wafResult = await openWebView(baseUrl, { title: "Security Check", waitForCookie: "cf_clearance", force: true });
        wafCookies = wafResult.cookies;
    }

    const headers = { ...commonHeaders, Referer: baseUrl, ...(wafCookies ? { Cookie: wafCookies } : {}) };
    const episodes = [];
    let currentPage = 1;
    let lastPage = 1;
    
    try {
        do {
            const res = await axios.get(`https://animepahe.pw/api?m=release&id=${url}&sort=episode_asc&page=${currentPage}`, { headers });
            const json = res.data;
            if (json && json.data) {
                lastPage = json.last_page || 1;
                for (const ep of json.data) {
                    episodes.push({
                        title: `Episode ${ep.episode}`,
                        link: `${url}|${ep.session}`, // Packs Anime UUID + Episode Session
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
