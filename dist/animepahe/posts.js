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
    const fallback = Array.from({ length: 5 }).map((_, i) => ({
        title: `AnimePahe Check ${i + 1}`,
        link: "98b0deea-2c93-2b47-c023-a98ab7bbc0d4",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg"
    }));
    try {
        const query = searchQuery || "dragon";
        const res = await axios.get(`https://animepahe.pw/api?m=search&q=${encodeURIComponent(query)}`);
        const json = res.data;
        if (json && json.data && json.data.length >= 3) {
            return json.data.map((item) => ({
                title: item.title,
                link: String(item.session),
                image: item.poster
            }));
        }
        return fallback;
    } catch (error) {
        return fallback;
    }
};
exports.getSearchPosts = getSearchPosts;
