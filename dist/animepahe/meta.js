"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;

const getMeta = async (args) => {
    const { link, providerContext } = args;
    const { axios, cheerio, openWebView, commonHeaders } = providerContext;
    const baseUrl = "https://animepahe.pw";

    // 1. AUTO-BYPASS: If Cloudflare blocks the details page, it pops the solver natively.
    let wafCookies = "";
    try {
        await axios.get(baseUrl, { headers: { ...commonHeaders } });
    } catch (error) {
        const wafResult = await openWebView(baseUrl, {
            title: "Security Check",
            description: "Loading Anime Details...",
            headers: { ...commonHeaders, Referer: baseUrl },
            force: true,
            waitForCookie: "cf_clearance"
        });
        wafCookies = wafResult.cookies;
    }

    const activeHeaders = { ...commonHeaders, Referer: baseUrl, ...(wafCookies ? { Cookie: wafCookies } : {}) };

    try {
        const res = await axios.get(`https://animepahe.pw/anime/${link}`, { headers: activeHeaders });
        const html = res.data;
        const $ = cheerio.load(html);
        
        const title = $('h1').first().text().trim() || "Unknown Title";
        const synopsis = $('.anime-synopsis').text().trim() || "No synopsis available.";
        
        let image = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg";
        
        // 2. THE FIX: Safety-wrapped Regex. It only runs if the HTML is valid, preventing hard crashes.
        if (typeof html === 'string') {
            const regexMatch = html.match(/(https?:\/\/[^\s"'<>]+\/uploads\/posters\/[^\s"'<>]+)/i);
            
            if (regexMatch && regexMatch[1]) {
                image = regexMatch[1];
            } else {
                // Fallback to Cheerio if Regex misses
                const fallback = $('.anime-poster img').attr('src') || $('a[href*="uploads/posters"]').attr('href');
                if (fallback && typeof fallback === 'string') {
                    if (fallback.startsWith('//')) image = 'https:' + fallback;
                    else if (fallback.startsWith('/')) image = 'https://animepahe.pw' + fallback;
                    else image = fallback;
                }
            }
        }

        return {
            title, synopsis, image, type: "series",
            linkList: [{ title: "Episodes", directLinks: [], episodesLink: link, quality: "HD" }],
            webUrl: `https://animepahe.pw/anime/${link}`
        };
        
    } catch (error) {
        // 3. THE ERROR TRAP: If it completely fails, it prints the exact crash log on the screen instead of turning blank.
        return {
            title: `CRASH: ${error.message || "Cloudflare Block"}`, 
            synopsis: "The auto-bypass failed or the page layout changed.",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg",
            type: "series", 
            linkList: [{ title: "Episodes", directLinks: [], episodesLink: link, quality: "HD" }],
            webUrl: baseUrl
        };
    }
};
exports.getMeta = getMeta;
