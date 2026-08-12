"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;

const myManualHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    "Cookie": "cf_clearance=aJPRb3I4waL3ia6t0qGNZ9NlXswJ8DHlykzadLyJfB0-1786564146-1.2.1.1-IaF5aVVLunbDZM2HlKLBBAr0dKlOu4TtLiTrsYYuKf4TjtgtWjqYI1CnOqyls2RD1sr5SteLm4FiO.ewuTjqZETKnlyUPABxzMqvhfXqDdCyeOlwzDJPoXRn8XfDSq5WnOLdI5eoKWAF6Sq8pP9gjzhSHG5.oUIvqAiq.DHaT0swSycLH.876Hj_r9uYZj2HyWotZeH6WIE.k4WR4TL7j1MrAq5ALCl0veS_XqoanmOJ.Qu.svhIX_Ul4Jxyqg2NUOjZsOj8_uelcs1rXuL3xlOSkd3rjXxWrPmjoGv3PR1.UyZqYqgIxiiR3QX7dYxt.swRqcgCcVY4MavZ8rgcKrUQ6lcG6yt4UkyEZQVflQJNDplwdsDN3pITI6J9m.4zVE.D1n665ShGvNg4cT3U4j4OHT7BAoUmOAB6p7WVxxghgGD4bba9gOkVqV0bFadMSGHJ5A5FU9ThFHgu92v5tw;",
    "Referer": "https://animepahe.pw/",
    "Accept": "application/json, text/javascript, */*; q=0.01"
};

// THE DECRYPTOR: Digs into the Kwik HTML and pulls the direct video file required for downloading
function unpackKwik(html) {
    try {
        const packs = html.matchAll(/eval\(function\(p,a,c,k,e,d\).*?return p\}?\('(.*?)',\s*(\d+),\s*(\d+),\s*'([^']+)'\.split\('\|'\)/gs);
        for (const match of packs) {
            let p = match[1];
            const a = parseInt(match[2], 10);
            let c = parseInt(match[3], 10);
            const k = match[4].split('|');

            const e = function(c) {
                return (c < a ? '' : e(Math.floor(c / a))) + ((c % a) > 35 ? String.fromCharCode((c % a) + 29) : (c % a).toString(36));
            };

            while (c--) {
                if (k[c]) {
                    const regex = new RegExp('\\b' + e(c) + '\\b', 'g');
                    p = p.replace(regex, k[c]);
                }
            }

            const m3u8Match = p.match(/(https?:\/\/[^'"]+\.m3u8[^'"]*)/);
            if (m3u8Match) return m3u8Match[1];
        }
    } catch (err) {}
    return null;
}

const getStream = async (args) => {
    const { link, providerContext } = args;
    const { axios } = providerContext;
    const streams = [];
    
    try {
        const [animeId, episodeSession] = link.split('|');
        if (!episodeSession) return [{ server: "ERROR: Reload Episodes List", link: "error", type: 'embed' }];

        const apiUrl = `https://animepahe.pw/api?m=links&id=${animeId}&session=${episodeSession}&p=kwik`;
        const res = await axios.get(apiUrl, { headers: myManualHeaders });
        const json = res.data;
        
        if (json && json.data) {
            for (const item of json.data) {
                for (const resKey in item) {
                    const streamData = item[resKey];
                    const kwikLink = streamData.kwik || streamData.kwik_pahewin || streamData.url;
                    const subType = streamData.fansub || streamData.audio || "ENG";
                    
                    if (kwikLink) {
                        try {
                            // Fetch Kwik page to decrypt the .m3u8 (MANDATORY FOR DOWNLOADING)
                            const kwikRes = await axios.get(kwikLink, { 
                                headers: { 
                                    "User-Agent": myManualHeaders["User-Agent"],
                                    "Referer": "https://animepahe.pw/" 
                                } 
                            });
                            
                            const m3u8Link = unpackKwik(kwikRes.data);
                            
                            if (m3u8Link) {
                                streams.push({ 
                                    server: `Kwik ${resKey}p (${subType})`, 
                                    link: m3u8Link, 
                                    type: 'm3u8', // Tells Vega this is a raw video file it can download!
                                    headers: { "Referer": new URL(kwikLink).origin }
                                });
                            } else {
                                throw new Error("Unpack failed");
                            }
                        } catch (err) {
                            // Fallback just in case Kwik blocks the internal scrape
                            streams.push({ 
                                server: `Kwik ${resKey}p (Embed Fallback)`, 
                                link: kwikLink, 
                                type: 'embed', 
                                headers: { "Referer": "https://animepahe.pw/" } 
                            });
                        }
                    }
                }
            }
        }
        
        return streams.length > 0 ? streams : [{ server: "No Streams Found", link: "error", type: 'embed' }];
    } catch (error) {
        return [{ server: `CRASH LOG: ${error.message}`, link: "error", type: 'embed' }];
    }
};
exports.getStream = getStream;
