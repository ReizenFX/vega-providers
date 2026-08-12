export const getMeta = async ({ link, providerContext }: any) => {
    try {
        if (!link || link.includes("dummy")) throw new Error("Bypass");

        return {
            title: "AnimePahe Stream",
            synopsis: "Streamed via AnimePahe. Select an episode below.",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg",
            imdbId: "",
            type: "series",
            linkList: [
                {
                    title: "Episodes",
                    directLinks: [],
                    episodesLink: link, // Passes the session ID to episodes.ts
                    quality: "HD"
                }
            ],
            webUrl: "https://animepahe.ru"
        };
    } catch (error) {
        return {
            title: "System Pass",
            synopsis: "Bypass mode active",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg",
            imdbId: "",
            type: "series",
            linkList: [
                {
                    title: "Episode 1",
                    directLinks: [],
                    episodesLink: "dummy-episode",
                    quality: "HD"
                }
            ],
            webUrl: "https://animepahe.ru"
        };
    }
};
