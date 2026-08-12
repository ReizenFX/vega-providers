"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;

const getPosts = async (args) => {
    // We will search a popular default so the home screen isn't empty
    return (0, exports.getSearchPosts)({ ...args, searchQuery: "dragon" });
};
exports.getPosts = getPosts;

const getSearchPosts = async (args) => {
    const { searchQuery, providerContext } = args;
    const { axios } = providerContext;

    const query = searchQuery || "dragon";
    
    // NO FAKE DATA FALLBACKS. 
    // We pass a normal User-Agent, and if Cloudflare blocks it, 
    // we let the Vega app handle the error natively instead of hiding it.
    const res = await axios.get(`https://animepahe.pw/api?m=search&q=${encodeURIComponent(query)}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    });

    const json = res.data;
    
    if (json && json.data) {
        return json.data.map((item) => ({
            title: item.title,
            link: String(item.session),
            image: item.poster
        }));
    }
    
    return [];
};
exports.getSearchPosts = getSearchPosts;
