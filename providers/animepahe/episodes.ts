export const getEpisodes = async ({ url, providerContext }: any) => {
    try {
        if (!url || url.includes("dummy")) throw new Error("Bypass");
        
        const res = await fetch(`https://animepahe.ru/api?m=release&id=${url}&sort=episode_asc&page=1`);
        const json = await res.json();
        
        if (json && json.data && json.data.length > 0) {
            return json.data.map((ep: any) => ({
                title: `Episode ${ep.episode}`,
                link: ep.session,
            }));
        }
        throw new Error("Bypass");
    } catch (error) {
        return [
            { title: "Episode 1", link: "dummy-stream" }
        ];
    }
};
