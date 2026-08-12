export async function getEpisodes({ link }: { link: string }) {
    try {
        const response = await fetch(`https://animepahe.ru/api?m=release&id=${link}&sort=episode_asc&page=1`);
        const json = await response.json();

        if (!json || !json.data) return [];

        return json.data.map((ep: { episode: number, session: string }) => ({
            title: `Episode ${ep.episode}`,
            link: ep.session,
            episode: ep.episode,
            season: 1
        }));
    } catch (error) {
        console.error('AnimePahe Episode Error:', error);
        return [];
    }
}
