"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;

const getStream = async (args) => {
    const { link, providerContext } = args;
    const { axios } = providerContext;
    
    try {
        const res = await axios.get(`https://animepahe.pw/api?m=links&id=${link}&p=kwik`);
        const json = res.data;
        const streams = [];
        
        if (json && json.data) {
            for (const hostObj of json.data) {
                for (const resolution in hostObj) {
                    const kwikUrl = hostObj[resolution]?.kwik;
                    if (kwikUrl) {
                        streams.push({ server: `Kwik (${resolution}p)`, link: kwikUrl, type: 'embed' });
                    }
                }
            }
        }
        return streams;
    } catch (error) {
        return [];
    }
};
exports.getStream = getStream;
