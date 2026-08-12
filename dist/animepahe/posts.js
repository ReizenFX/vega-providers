"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;

const getPosts = async (args) => {
    return (0, exports.getSearchPosts)({ ...args, searchQuery: "dragon" });
};
exports.getPosts = getPosts;

const getSearchPosts = async (args) => {
    const { searchQuery, providerContext } = args;
    const { axios, openWebView, commonHeaders } = providerContext;
    const baseUrl = "https://animepahe.pw";
    
    // THE AUTO-BYPASS: Checks if CF blocked us, and pops up the solver if needed
    let wafCookies = "";
    try {
        await axios.get(baseUrl, { headers: { ...commonHeaders } });
    } catch (e) {
        const wafResult = await openWebView(baseUrl, {
            title: "Security Check",
            waitForCookie: "cf_clearance",
            force: true
        });
        wafCookies = wafResult.cookies;
    }

    const headers = { ...commonHeaders, Referer: baseUrl, ...(wafCookies ? { Cookie: wafCookies } : {}) };
    const query = searchQuery || "dragon";
    
    try {
        const res = await axios.get(`https://animepahe.pw/api?m=search&q=${encodeURIComponent(query)}`, { headers });
        const json = res.data;
        if (json && json.data) {
            return json.data.map((item) => ({
                title: item.title, link: String(item.session), image: item.poster
            }));
        }
        return [];
    } catch (error) {
        return [{ title: "ERROR: Search Failed", link: "error", image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg" }];
    }
};
exports.getSearchPosts = getSearchPosts;
