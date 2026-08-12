"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;

// The exact "Fake ID" headers AnimePahe demands to bypass Cloudflare
const headers = {
  "Accept": "application/json, text/javascript, */*; q=0.01",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
  "Cookie": "xla=s4t; _ga=GA1.1.1081149560.1756378968; _ga_BLZGKYN5PF=GS2.1.s1756378968$o1$g1$t1756378984$j44$l0$h0"
};

const getPosts = async (args) => {
    return (0, exports.getSearchPosts)({ ...args, searchQuery: "dragon" });
};
exports.getPosts = getPosts;

const getSearchPosts = async (args) => {
    const { searchQuery, providerContext } = args;
    const { axios } = providerContext;
    const query = searchQuery || "dragon";
    
    try {
        // We attach the headers to the request so Cloudflare lets us in
        const res = await axios.get(`https://animepahe.pw/api?m=search&q=${encodeURIComponent(query)}`, { headers });
        const json = res.data;
        
        if (json && json.data) {
            return json.data.map((item) => ({
                title: item.title,
                link: String(item.session),
                image: item.poster
            }));
        }
        
        // If Cloudflare STILL blocks it, we print the first 100 characters of the block page to see what it wants
        const preview = typeof json === "string" ? json.substring(0, 100) : "Unknown Block";
        return [{
            title: `BLOCKED: ${preview}`,
            link: "error",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg"
        }];
    } catch (error) {
        return [{
            title: `CRASH LOG: ${error.message}`,
            link: "error",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg"
        }];
    }
};
exports.getSearchPosts = getSearchPosts;
