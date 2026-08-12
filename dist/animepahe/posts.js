"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;

// 🛑 YOUR EXACT EXTRACTED KEYS ARE INJECTED HERE 🛑
const myManualHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    "Cookie": "cf_clearance=aJPRb3I4waL3ia6t0qGNZ9NlXswJ8DHlykzadLyJfB0-1786564146-1.2.1.1-IaF5aVVLunbDZM2HlKLBBAr0dKlOu4TtLiTrsYYuKf4TjtgtWjqYI1CnOqyls2RD1sr5SteLm4FiO.ewuTjqZETKnlyUPABxzMqvhfXqDdCyeOlwzDJPoXRn8XfDSq5WnOLdI5eoKWAF6Sq8pP9gjzhSHG5.oUIvqAiq.DHaT0swSycLH.876Hj_r9uYZj2HyWotZeH6WIE.k4WR4TL7j1MrAq5ALCl0veS_XqoanmOJ.Qu.svhIX_Ul4Jxyqg2NUOjZsOj8_uelcs1rXuL3xlOSkd3rjXxWrPmjoGv3PR1.UyZqYqgIxiiR3QX7dYxt.swRqcgCcVY4MavZ8rgcKrUQ6lcG6yt4UkyEZQVflQJNDplwdsDN3pITI6J9m.4zVE.D1n665ShGvNg4cT3U4j4OHT7BAoUmOAB6p7WVxxghgGD4bba9gOkVqV0bFadMSGHJ5A5FU9ThFHgu92v5tw;"
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
        const res = await axios.get(`https://animepahe.pw/api?m=search&q=${encodeURIComponent(query)}`, {
            headers: myManualHeaders
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
        return [{
            title: `ERROR: ${error.message || "Manual Cookie Rejected"}`,
            link: "error",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg"
        }];
    }
};
exports.getSearchPosts = getSearchPosts;
