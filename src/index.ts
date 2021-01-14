import { run as runJxa } from "@jxa/run";
import type { } from "@jxa/global-type";

// TODO probombitsa
const makeArr = <T extends string>(arr: T[]) => arr;

export const supportedBrowsers = makeArr(["safari", "google chrome"]);
type SupportedBrowser = typeof supportedBrowsers[number];

type Options = {
    /**
     * Order of checking
     * @default undefined - safari, google chrome
     */
    browsers: SupportedBrowser[];
};

interface JXAReturnData {
    tabInfo: {
        url: string;
        title: string;
        browserTitle: SupportedBrowser;
    } | null;
    // browsersNoAccess: typeof supportedBrowsers;
    erroredBrowsers: typeof supportedBrowsers;
}
type ActiveTabReturnType = JXAReturnData;

// do not use global vars in this function. read more in @jxa/run README
const browserTabs = (browserTitles: typeof supportedBrowsers): ActiveTabReturnType => {
    // this code runs in a different environment
    const erroredBrowsers: any[] = [];
    let tabInfo: JXAReturnData["tabInfo"] = null;
    for (const browserTitle of browserTitles) {
        const browser = Application(browserTitle);
        if (!browser.running()) continue;
        const foremostWindow = browser.windows[0];
        try {
            tabInfo = {
                url: foremostWindow[browserTitle === "safari" ? "currentTab" : "activeTab"]().url(),
                title: browserTitle === "safari" ? foremostWindow.name() : foremostWindow.activeTab().title(),
                browserTitle
            };
            break;
        } catch (err) {
            // It could be "Message not understood."
            // const { message } = err;
            // if "An error occurred." there is no access to the browser
            erroredBrowsers.push(browserTitle);
            continue;
        }
    }
    if (erroredBrowsers.length === browserTitles.length) {
        throw new Error("all-browsers-failed");
    }
    return {
        erroredBrowsers,
        tabInfo
    };
};

const getActiveTabInfo = async ({ browsers = supportedBrowsers }: Partial<Options> = {}): Promise<ActiveTabReturnType> => {
    if (process.platform !== "darwin") throw new Error("Only macOS is supported");
    // no access code: -1743
    return await runJxa(browserTabs, browsers);
};

export default getActiveTabInfo;
