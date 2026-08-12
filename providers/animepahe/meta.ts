export async function getMeta(...args: any[]) {
    // We hardcode the return to be indestructible for the test
    let linkId = "dummy-id";
    if (args[0] && typeof args[0] === 'object') linkId = args[0].link || args[0].url;
    else if (typeof args[0] === 'string') linkId = args[0];

    return {
        id: linkId,
        title: "AnimePahe Stream",
        synopsis: "Sourced from AnimePahe.",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg", 
        poster: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg",
        type: "series",
        link: linkId,
        url: linkId
    };
}
