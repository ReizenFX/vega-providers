"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;

const getMeta = async (args) => {
    const { link } = args;
    return {
        title: "AnimePahe Series",
        synopsis: "Select an episode below to start watching.",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_image.jpg",
        imdbId: "",
        type: "series",
        linkList: [
            {
                title: "Episodes",
                directLinks: [],
                episodesLink: link,
                quality: "HD"
            }
        ],
        webUrl: `https://animepahe.pw/anime/${link}`
    };
};
exports.getMeta = getMeta;
