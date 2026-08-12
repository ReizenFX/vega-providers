"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;

const getPosts = async (args) => {
    return (0, exports.getSearchPosts)({ ...args, searchQuery: "dragon" });
};
exports.getPosts = getPosts;

const getSearchPosts = async (args) => {
    const { searchQuery, providerContext } = args;
    
    // CRITICAL: commonHeaders pulls the clearance cookies directly from the app
    const { axios, commonHeaders = {} } = providerContext;
    const query = searchQuery || "dragon";
    
    try {
        const res = await axios.get(`https://animepahe.pw/api?m=search&q=${encodeURIComponent(query)}`, {
            headers: {
                ...commonHeaders,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
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
    } catch (error) {
        // If Cloudflare is still blocking, we tell the UI exactly what you need to do
        return [{
            title: "CLOUDFLARE BLOCK: Open AnimePahe in the app's Webview (Globe Icon) to verify you are human.",
            link: "error",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg"
        }];
    }
};
exports.getSearchPosts = getSearchPosts;
