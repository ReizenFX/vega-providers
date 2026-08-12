"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;

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
    const { axios, openWebView, commonHeaders } = providerContext;
    const baseUrl = "https://animepahe.pw";

    let wafCookies = "";
    try {
        await axios.get(baseUrl, { headers: { ...commonHeaders } });
    } catch (e) {
        const wafResult = await openWebView(baseUrl, { title: "Security Check", waitForCookie: "cf_clearance", force: true });
        wafCookies = wafResult.cookies;
    }

    const headers = { ...commonHeaders, Referer: baseUrl, ...(wafCookies ? { Cookie: wafCookies } : {}) };
    const streams = [];
    
    try {
        const [animeId, episodeSession] = link.split('|');
        if (!episodeSession) return [{ server: "ERROR: Reload Episodes", link: "error", type: 'embed' }];

        const apiUrl = `https://animepahe.pw/api?m=links&id=${animeId}&session=${episodeSession}&p=kwik`;
        const res = await axios.get(apiUrl, { headers });
        const json = res.data;
        
        if (json && json.data) {
            for (const item of json.data) {
                for (const resKey in item) {
                    const streamData = item[resKey];
                    const kwikLink = streamData.kwik || streamData.kwik_pahewin || streamData.url;
                    const subType = streamData.fansub || streamData.audio || "ENG";
                    
                    if (kwikLink) {
                        try {
                            const kwikRes = await axios.get(kwikLink, { headers: { ...headers, Referer: baseUrl } });
                            const m3u8Link = unpackKwik(kwikRes.data);
                            if (m3u8Link) {
                                streams.push({ 
                                    server: `Kwik ${resKey}p (${subType})`, 
                                    link: m3u8Link, 
                                    type: 'm3u8', // Required format to enable Vega Downloads!
                                    headers: { Referer: new URL(kwikLink).origin }
                                });
                            }
                        } catch (err) {
                            streams.push({ server: `Kwik ${resKey}p (Embed)`, link: kwikLink, type: 'embed' });
                        }
                    }
                }
            }
        }
        return streams.length > 0 ? streams : [{ server: "No Streams Found", link: "error", type: 'embed' }];
    } catch (error) {
        return [{ server: `API Failed`, link: "error", type: 'embed' }];
    }
};
exports.getStream = getStream;
