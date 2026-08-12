export async function getStream({ link }: { link: string }) {
    try {
        const apiRes = await fetch(`https://animepahe.ru/api?m=links&id=${link}&p=kwik`);
        const apiJson = await apiRes.json();

        const streams = [];

        if (apiJson && apiJson.data) {
            for (const hostObj of apiJson.data) {
                // hostObj looks like: { "720p": { "kwik": "https://..." } }
                for (const resolution in hostObj) {
                    // We assert the type so TypeScript doesn't throw an error
                    const resData = hostObj[resolution as keyof typeof hostObj] as { kwik: string };
                    
                    streams.push({
                        server: `Kwik (${resolution})`,
                        link: resData.kwik,
                        type: 'embed' 
                    });
                }
            }
        }
        return streams;
    } catch (error) {
        console.error('AnimePahe Stream Error:', error);
        return [];
    }
}
