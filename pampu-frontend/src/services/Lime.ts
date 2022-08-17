import config from "../config";
import ILime from "../interfaces/Lime";

class LimeService {
    static async addFile(file: FormData) {
        const url = `${config.base}/${config.addFile}`
        try {
            const response = await fetch(url, { method: "POST", credentials: "include", body: file });
            if (response.status === 201) {
                const data = await response.json();
                return data
            } else {
                throw Error(`Failed to add file lime: ${response.status}`)
            }
        } catch (error: any) {
            throw (error);
        }
    }

    static async add(lime: string, expires?: boolean): Promise<ILime> {
        const url = `${config.base}/${config.add}`
        const body = { content: lime, expires: expires }
        try {
            const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, credentials: "include", body: JSON.stringify(body) });
            if (response.status === 201) {
                const data = await response.json();
                return data
            } else {
                throw Error(`Failed to add lime: ${response.status}`)
            }
        } catch (error: any) {

            throw (error);
        }
    }

    static async fetch(last?: string): Promise<ILime[]> {
        const url = `${config.base}/${config.fetch}`
        try {
            const response = await fetch(url, { credentials: "include" });
            if (response.status === 200) {
                const data = await response.json();
                return data
            } else {
                throw Error(`Failed to add lime: ${response.status}`)
            }
        } catch (error: any) {
            console.log(error)
            throw (error);
        }
    }
}

export default LimeService;