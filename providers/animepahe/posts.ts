export async function getPosts({ filter, searchQuery }: { filter?: string, searchQuery?: string }) {
    // If there is no search query (like when the app first opens the home screen), 
    // we use a default search word so the screen isn't empty!
    const query = searchQuery || "dragon"; 

    try {
        const res = await fetch(`https://animepahe.ru/api?m=search&q=${encodeURIComponent(query)}`);
        const json = await res.json();

        if (!json || !json.data) return [];

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
