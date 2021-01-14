import { run as runJxa } from "@jxa/run";
import type { } from "@jxa/global-type";

// TODO probombitsa
const makeArr = <T extends string>(arr: T[]) => arr;

export const supportedBrowsers = makeArr(["safari", "google chrome"]);

type Options = {
    /**
     * Order of checking
     * @default undefined - safari, google chrome
     */
    browsers: typeof supportedBrowsers;
};

interface JXAReturnData {
    url: string;
    title: string;
    browserTitle: typeof supportedBrowsers[number];
}
type ActiveTabReturnType = JXAReturnData | null;

// do not use global vars in this function. read more in @jxa/run README
const browserTabs = (browserTitles: typeof supportedBrowsers): ActiveTabReturnType => {
    // // this code runs in a different environment
    for (const browserTitle of browserTitles) {
        const browser = Application(browserTitle.toLowerCase());
        if (!browser.running()) continue;
        const foremostWindow = browser.windows[0];
        return {
            url: foremostWindow[browserTitle === "safari" ? "currentTab" : "activeTab"]().url(),
            title: browserTitle === "safari" ? foremostWindow.name() : foremostWindow.activeTab().title(),
            browserTitle
        };
    }
    return null;
};

const getActiveTabInfo = async ({ browsers = supportedBrowsers }: Partial<Options> = {}): Promise<ActiveTabReturnType> => {
    if (process.platform !== "darwin") throw new Error("Only macOS is supported");
    console.clear();
    console.time("GET-TAB");
    const result: ActiveTabReturnType = await runJxa(browserTabs, browsers);
    console.log(result);
    console.timeEnd("GET-TAB");
    return result;
};

export default getActiveTabInfo;
