"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;

const getPosts = async (args) => {
    return (0, exports.getSearchPosts)({ ...args, searchQuery: "one piece" });
};
exports.getPosts = getPosts;

const getSearchPosts = async (args) => {
    const { searchQuery, providerContext } = args;
    const { axios } = providerContext;
    const query = searchQuery || "one piece";
    
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
        return [];
    } catch (error) {
        return [];
    }
};
exports.getSearchPosts = getSearchPosts;
