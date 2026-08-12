"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpisodes = void 0;

const getEpisodes = async (args) => {
    const { url, providerContext } = args;
    const { axios } = providerContext;
    
    try {
        const res = await axios.get(`https://animepahe.pw/api?m=release&id=${url}&sort=episode_asc&page=1`);
        const json = res.data;
        
        if (json && json.data) {
            return json.data.map((ep) => ({
                title: `Episode ${ep.episode}`,
                link: ep.session,
            }));
        }
        return [];
    } catch (error) {
        return [];
    }
};
exports.getEpisodes = getEpisodes;
