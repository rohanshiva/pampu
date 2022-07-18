import config from "../config";
import api from "../utils/API";
import ILime from "../interfaces/Lime";

class LimeService {
    static async addFile(file: FormData) {
        try {
            const response = await api.post(config.addFile, file);
            if (response.status === 201) {
                return response.data
            } else {
                throw Error(`Failed to add file lime: ${response.statusText}`)
            }
        } catch (error: any) {
            throw Error(error.response.data.detail)
        }
    }

    static async add(lime: string, expires?: boolean): Promise<ILime> {
        try {
            const body = { "content": lime, "expires": expires }
            const response = await api.post(config.add, body);
            if (response.status === 201) {
                return response.data
            } else {
                throw Error(`Failed to add lime: ${response.statusText}`)
            }
        } catch (error: any) {
            throw Error(error.response.data.detail)
        }
    }

    // static async download(name: string): Promise<void> {
    //     const url = `${config.download}/${name}`;
    //     try {
    //         const response = await api.get(url);
    //         console.log(response.data)
    //         return response.data;
    //     } catch (error: any) {
    //         throw Error(error.response.data.detail)
    //     }
    // }

    static async fetch(last?: string): Promise<ILime[]> {
        const url = last ? `${config.fetch}` : `${config.fetch}`
        try {
            const response = await api.get(url);
            if (response.status === 200) {
                return response.data
            } else {
                throw Error(`Failed to fetch limes ${response.statusText}`)
            }
        } catch (error: any) {
            throw Error(error.response.data.detail)
        }
    }
}

export default LimeService;