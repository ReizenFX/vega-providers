export async function getMeta({ link }: { link: string }) {
    return {
        id: link,
        title: "AnimePahe Stream",
        synopsis: "Sourced from AnimePahe. Select an episode below.",
        image: "", 
        type: "series",
        link: link
    };
}
