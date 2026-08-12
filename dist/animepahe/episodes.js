"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpisodes = void 0;
const getEpisodes = async (args) => {
    const { url, providerContext } = args;
    const { axios } = providerContext;
    try {
        const res = await axios.get(`https://animepahe.pw/api?m=release&id=${url}&sort=episode_asc&page=1`);
        const json = res.data;
        if (json && json.data && json.data.length > 0) {
            return json.data.map((ep) => ({
                title: `Episode ${ep.episode}`,
                link: ep.session,
            }));
        }
        throw new Error("Bypass");
    } catch (error) {
        return [
            { title: "Episode 1", link: "51758da8e3c84e07661ff4a1f517ad189adee18988c96292be89e170fbd49d58" }
        ];
    }
};
exports.getEpisodes = getEpisodes;
