export async function getPosts({ searchQuery }: { searchQuery?: string }) {
    if (!searchQuery) return [];

    try {
        const res = await fetch(`https://animepahe.ru/api?m=search&q=${encodeURIComponent(searchQuery)}`);
        const json = await res.json();

        if (!json || !json.data) return [];

        // Adding strict types here prevents GitHub from failing the build
        return json.data.map((item: { title: string, session: string, poster: string }) => ({
            title: item.title,
            link: item.session, 
            image: item.poster
        }));
    } catch (error) {
        console.error('AnimePahe Search Error:', error);
        return [];
    }
}
