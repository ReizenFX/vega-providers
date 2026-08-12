export const getMeta = async (args: any) => {
    const { link } = args;
    return {
        title: "AnimePahe Series",
        synopsis: "Streamed via AnimePahe. Select an episode below.",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg",
        imdbId: "",
        type: "series",
        linkList: [
            {
                title: "Episodes",
                directLinks: [],
                episodesLink: link, // Passes the UUID to episodes.ts
                quality: "HD"
            }
        ],
        webUrl: `https://animepahe.pw/anime/${link}`
    };
};
