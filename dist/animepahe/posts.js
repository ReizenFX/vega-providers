"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;

const getPosts = async (args) => {
    return (0, exports.getSearchPosts)({ ...args, searchQuery: "dragon" });
};
exports.getPosts = getPosts;

const getSearchPosts = async (args) => {
    const { searchQuery, providerContext } = args;
    const { axios } = providerContext;
    const query = searchQuery || "dragon";
    
    try {
        const res = await axios.get(`https://animepahe.pw/api?m=search&q=${encodeURIComponent(query)}`);
        const json = res.data;
        
        if (json && json.data) {
            return json.data.map((item) => ({
                title: item.title,
                link: String(item.session),
                image: item.poster
            }));
        }
        
        // If the server replies but there is no data
        return [{
            title: "API ERROR: Connected, but JSON data is missing.",
            link: "error-link",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg"
        }];
    } catch (error) {
        // THE MAGIC TRICK: We print the exact server error as the Anime Title!
        const errorMessage = error.message ? error.message : "Unknown Cloudflare Block";
        
        return [{
            title: `CRASH LOG: ${errorMessage}`,
            link: "error-link",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg"
        }];
    }
};
exports.getSearchPosts = getSearchPosts;
