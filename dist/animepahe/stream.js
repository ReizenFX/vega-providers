"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;

const myManualHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    "Cookie": "cf_clearance=aJPRb3I4waL3ia6t0qGNZ9NlXswJ8DHlykzadLyJfB0-1786564146-1.2.1.1-IaF5aVVLunbDZM2HlKLBBAr0dKlOu4TtLiTrsYYuKf4TjtgtWjqYI1CnOqyls2RD1sr5SteLm4FiO.ewuTjqZETKnlyUPABxzMqvhfXqDdCyeOlwzDJPoXRn8XfDSq5WnOLdI5eoKWAF6Sq8pP9gjzhSHG5.oUIvqAiq.DHaT0swSycLH.876Hj_r9uYZj2HyWotZeH6WIE.k4WR4TL7j1MrAq5ALCl0veS_XqoanmOJ.Qu.svhIX_Ul4Jxyqg2NUOjZsOj8_uelcs1rXuL3xlOSkd3rjXxWrPmjoGv3PR1.UyZqYqgIxiiR3QX7dYxt.swRqcgCcVY4MavZ8rgcKrUQ6lcG6yt4UkyEZQVflQJNDplwdsDN3pITI6J9m.4zVE.D1n665ShGvNg4cT3U4j4OHT7BAoUmOAB6p7WVxxghgGD4bba9gOkVqV0bFadMSGHJ5A5FU9ThFHgu92v5tw;"
};

const getStream = async (args) => {
    const { link, providerContext } = args;
    const { axios } = providerContext;
    
    try {
        const res = await axios.get(`https://animepahe.pw/api?m=links&id=${link}&p=kwik`, {
            headers: myManualHeaders
        });
        const json = res.data;
        const streams = [];
        
        if (json && json.data) {
            for (const hostObj of json.data) {
                for (const resolution in hostObj) {
                    const kwikUrl = hostObj[resolution]?.kwik;
                    if (kwikUrl) {
                        streams.push({ server: `Kwik (${resolution})`, link: kwikUrl, type: 'embed' });
                    }
                }
            }
        }
        return streams;
    } catch (error) {
        return [];
    }
};
exports.getStream = getStream;
