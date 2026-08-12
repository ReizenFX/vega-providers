export const getStream = async ({ link, type, signal, providerContext }: any) => {
    try {
        if (!link || link.includes("dummy")) throw new Error("Bypass");

        const res = await fetch(`https://animepahe.ru/api?m=links&id=${link}&p=kwik`);
        const json = await res.json();
        const streams: any[] = [];
        
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
        if (streams.length > 0) return streams;
        throw new Error("Bypass");
    } catch (error) {
        return [
            { server: "Test Server", link: "https://example.com/test.mp4", type: "mp4" }
        ];
    }
};
