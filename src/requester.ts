import axios from "axios";

const TEST_URL = "https://poe.game.qq.com/trade";
const GET_CHARACTERS_URL =
    "https://poe.game.qq.com/character-window/get-characters";
const VIEW_PROFILE_URL_PREFIX = "https://poe.game.qq.com/account/view-profile/";
const GET_PASSIVE_SKILLS_URL =
    "https://poe.game.qq.com/character-window/get-passive-skills";
const GET_ITEMS_URL = "https://poe.game.qq.com/character-window/get-items";

/**
 * POE API requester
 */
export class Requester {
    private cookie: string;

    constructor(cookie: string) {
        this.cookie = cookie;
    }

    /**
     * 检查cookie有效性。
     * @param cookie
     */
    public static async isEffectiveCookie(cookie: string): Promise<boolean> {
        try {
            await axios.get(TEST_URL, {
                maxRedirects: 0,
                headers: {
                    Cookie: cookie,
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 检查cookie有效性。
     */
    public async isEffectiveCookie(): Promise<boolean> {
        return Requester.isEffectiveCookie(this.cookie);
    }

    /**
     * 获取角色列表信息。
     *
     * @param accountName 用户名
     * @param realm
     */
    public async getCharacters(
        accountName: string,
        realm: string
    ): Promise<Array<Character>> {
        const form = new URLSearchParams();
        form.append("accountName", accountName);
        form.append("realm", realm);

        const res = await axios.post(GET_CHARACTERS_URL, form, {
            headers: {
                Cookie: this.cookie,
            },
        });

        return res.data;
    }

    public async viewProfile(accountName: string): Promise<string> {
        const url = `${VIEW_PROFILE_URL_PREFIX}${encodeURIComponent(
            accountName
        )}`;

        const res = await axios.get(url, {
            headers: {
                Cookie: this.cookie,
            },
        });

        return res.data;
    }

    public async getPassiveSkills(
        accountName: string,
        character: string,
        realm: string
    ): Promise<PassiveSkills> {
        const form = new URLSearchParams();
        form.append("accountName", accountName);
        form.append("character", character);
        form.append("realm", realm);

        const res = await axios.post(GET_PASSIVE_SKILLS_URL, form, {
            headers: {
                Cookie: this.cookie,
            },
        });
        return res.data;
    }

    public async getItems(
        accountName: string,
        character: string,
        realm: string
    ): Promise<Items> {
        const form = new URLSearchParams();
        form.append("accountName", accountName);
        form.append("character", character);
        form.append("realm", realm);

        const res = await axios.post(GET_ITEMS_URL, form, {
            headers: {
                Cookie: this.cookie,
            },
        });
        return res.data;
    }

    public setCookie(cookie: string) {
        this.cookie = cookie;
    }
}

interface Character {
    class: string;
    name: string;
    league: string;
}

interface PassiveSkills {
    items: Array<unknown>;
}

interface Items {
    items: Array<unknown>;
}