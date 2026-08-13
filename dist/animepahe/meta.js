"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;

const myManualHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    "Cookie": "cf_clearance=aJPRb3I4waL3ia6t0qGNZ9NlXswJ8DHlykzadLyJfB0-1786564146-1.2.1.1-IaF5aVVLunbDZM2HlKLBBAr0dKlOu4TtLiTrsYYuKf4TjtgtWjqYI1CnOqyls2RD1sr5SteLm4FiO.ewuTjqZETKnlyUPABxzMqvhfXqDdCyeOlwzDJPoXRn8XfDSq5WnOLdI5eoKWAF6Sq8pP9gjzhSHG5.oUIvqAiq.DHaT0swSycLH.876Hj_r9uYZj2HyWotZeH6WIE.k4WR4TL7j1MrAq5ALCl0veS_XqoanmOJ.Qu.svhIX_Ul4Jxyqg2NUOjZsOj8_uelcs1rXuL3xlOSkd3rjXxWrPmjoGv3PR1.UyZqYqgIxiiR3QX7dYxt.swRqcgCcVY4MavZ8rgcKrUQ6lcG6yt4UkyEZQVflQJNDplwdsDN3pITI6J9m.4zVE.D1n665ShGvNg4cT3U4j4OHT7BAoUmOAB6p7WVxxghgGD4bba9gOkVqV0bFadMSGHJ5A5FU9ThFHgu92v5tw;"
};

const getMeta = async (args) => {
    const { link, providerContext } = args;
    const { axios, cheerio } = providerContext;
    
    try {
        const res = await axios.get(`https://animepahe.pw/anime/${link}`, { headers: myManualHeaders });
        const $ = cheerio.load(res.data);
        
        const title = $('h1').first().text().trim() || "Unknown Title";
        const synopsis = $('.anime-synopsis').text().trim() || "No synopsis available.";
        
        let image = $('.anime-poster img').attr('src') || 
                    $('.anime-poster img').attr('data-src') || 
                    $('a[href*="uploads/posters"]').attr('href') || 
                    $('img[src*="uploads/posters"]').attr('src') || 
                    "";
                    
        if (image && typeof image === 'string') {
            if (image.startsWith('//')) {
                image = 'https:' + image;
            } else if (image.startsWith('/')) {
                image = 'https://animepahe.pw' + image;
            }
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
            title: "Metadata Failed", synopsis: "Failed to load page.",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg",
            type: "series", linkList: [{ title: "Episodes", directLinks: [], episodesLink: link, quality: "HD" }],
            webUrl: `https://animepahe.pw/anime/${link}`
        };
    }
};
exports.getMeta = getMeta;
