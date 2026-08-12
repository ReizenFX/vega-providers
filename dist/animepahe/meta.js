"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;

const getMeta = async (args) => {
    const { link, providerContext } = args;
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

    try {
        const res = await axios.get(`https://animepahe.pw/anime/${link}`, { headers });
        const $ = providerContext.cheerio.load(res.data);
        
        const title = $('h1').first().text().trim() || "Unknown Title";
        const synopsis = $('.anime-synopsis').text().trim() || "No synopsis available.";
        
        let image = $('.anime-poster img').attr('src') || $('.anime-poster img').attr('data-src') || $('a[href*="uploads/posters"]').attr('href') || "";
        if (image && typeof image === 'string') {
            if (image.startsWith('//')) image = 'https:' + image;
            else if (image.startsWith('/')) image = 'https://animepahe.pw' + image;
        } else {
            image = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg";
        }

        return {
            title, synopsis, image, type: "series",
            linkList: [{ title: "Episodes", directLinks: [], episodesLink: link, quality: "HD" }],
            webUrl: `https://animepahe.pw/anime/${link}`
        };
    } catch (error) {
        return {
            title: "Metadata Failed", synopsis: "Failed to load page.", image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg", type: "series",
            linkList: [{ title: "Episodes", directLinks: [], episodesLink: link, quality: "HD" }], webUrl: baseUrl
        };
    }
};
exports.getMeta = getMeta;
