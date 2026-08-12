import { Stream, ProviderContext } from "../types";

const myManualHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    "Cookie": "cf_clearance=aJPRb3I4waL3ia6t0qGNZ9NlXswJ8DHlykzadLyJfB0-1786564146-1.2.1.1-IaF5aVVLunbDZM2HlKLBBAr0dKlOu4TtLiTrsYYuKf4TjtgtWjqYI1CnOqyls2RD1sr5SteLm4FiO.ewuTjqZETKnlyUPABxzMqvhfXqDdCyeOlwzDJPoXRn8XfDSq5WnOLdI5eoKWAF6Sq8pP9gjzhSHG5.oUIvqAiq.DHaT0swSycLH.876Hj_r9uYZj2HyWotZeH6WIE.k4WR4TL7j1MrAq5ALCl0veS_XqoanmOJ.Qu.svhIX_Ul4Jxyqg2NUOjZsOj8_uelcs1rXuL3xlOSkd3rjXxWrPmjoGv3PR1.UyZqYqgIxiiR3QX7dYxt.swRqcgCcVY4MavZ8rgcKrUQ6lcG6yt4UkyEZQVflQJNDplwdsDN3pITI6J9m.4zVE.D1n665ShGvNg4cT3U4j4OHT7BAoUmOAB6p7WVxxghgGD4bba9gOkVqV0bFadMSGHJ5A5FU9ThFHgu92v5tw;",
    "Referer": "https://animepahe.pw/",
    "Accept": "application/json, text/javascript, */*; q=0.01"
};

export const getStream = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Stream[]> {
    const { axios } = providerContext;
    const streams: Stream[] = [];
    
    try {
        // UNPACK THE IDs
        const [animeId, episodeSession] = link.split('|');
        
        // Safety net if you click an old cached episode by accident
        if (!episodeSession) {
            return [{ server: `ERROR: Go back to Anime page to reload episodes!`, link: "error", type: 'embed' }];
        }

        // We now pass BOTH the Anime ID and Episode Session to the server!
        const apiUrl = `https://animepahe.pw/api?m=links&id=${animeId}&session=${episodeSession}&p=kwik`;
        const res = await axios.get(apiUrl, { headers: myManualHeaders });
        const json = res.data;
        
        // If Cloudflare blocks this specific API endpoint, it returns HTML instead of JSON
        if (typeof json === 'string' && json.includes('<html')) {
            return [{ server: `ERROR: Cloudflare Blocked Video API`, link: "error", type: 'embed' }];
        }
        
        if (json && json.data) {
            for (const item of json.data) {
                for (const resKey in item) {
                    const streamData = item[resKey];
                    const kwikLink = streamData.kwik || streamData.kwik_pahewin || streamData.url;
                    const subType = streamData.fansub || streamData.audio || "ENG";
                    
                    if (kwikLink) {
                        streams.push({ 
                            server: `Kwik ${resKey}p (${subType})`, 
                            link: kwikLink, 
                            type: 'embed' 
                        });
                    }
                }
            }
        }
        
        if (streams.length === 0) {
            return [{ server: `EMPTY JSON: No streams found`, link: "error", type: 'embed' }];
        }
        
        return streams;
        
    } catch (error: any) {
        return [{ server: `CRASH LOG: ${error.message}`, link: "error", type: 'embed' }];
    }
};
