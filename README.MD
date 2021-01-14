# Get Browser Tabs &middot; [![npm version](https://img.shields.io/npm/v/read-browser-tabs?color=limegreen)](https://npmjs.com/package/read-browser-tabs) [![GitHub top language](https://img.shields.io/github/languages/top/zardoy/read-browser-tabs)](https://github.com/zardoy/read-browser-tabs/tree/master/src) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> Supported platforms: macOS only. Supported browsers: safari, google chrome.

Easily retrieve information about active tab from Node.js.

## Usage

```ts
import { getActiveTabInfo } from "read-browser-tabs";

// if google and chrome are running safari always takes precedence by default
await getActiveTabInfo();
//=>
// {
//   erroredBrowsers: [],
//   tabInfo: {
//     url: 'https://github.com/zbrateam/Zebra',
//     title: 'GitHub - zbrateam/Zebra: A Useful Package Manager for iOS',
//     browserTitle: 'safari'
//   }
// }

await getActiveTabInfo({
    // try to get data from google chrome and if it's not running then try from safari
    browsers: ["google chrome", "safari"]
});
//=>
// {
//   erroredBrowsers: [],
//   tabInfo: {
//     url: 'https://github.com/jsdoc/jsdoc',
//     title: 'jsdoc/jsdoc: An API documentation generator for JavaScript.',
//     browserTitle: 'google chrome'
//   }
// }

// for example only safari is running
await getActiveTabInfo({
    // but here we are trying to get info from google chrome ONLY
    browsers: ["google chrome"]
});
// {
//   erroredBrowsers: [],
//   tabInfo: null
// }

```

## Things to Note

- It usually takes 50 - 300ms to get info. It's a good practice to add timeout for 500ms.
- When you first run this script from app user will see the message: ![jxa prompt](docs-assets/jxa-prompt.png) <!-- If user click *Don't Allow*, you will get an Error: `Error: Error: An error occurred. (-1743)`. For further runs it won't ask for user again and to avoid this error user must go to preferences and explicitly enable all browsers: ![settings-allow-jxa](docs-assets/settings-allow-jxa.png) Keep in mind that if you are using Electron, you can easily show this window to user. -->

## Why?

I used [get-chrome-tabs](https://www.npmjs.com/package/get-chrome-tabs) in past, but it has a **huge** performance issue, with handling multiple opened windows. That's because it travels over all windows and tabs and of course it takes A LOT of time. This module solves the problem by accessing only the active (focused) tab. And it supports Safari!

### It Could be Better

This module VERY unreliable, like it can break in any day. Apple created JXA and it's very bad. Sometimes I get `execution error: Error: Error: AppleEvent handler failed.` because of `.properties()`. And it seems there is no official documentation for JXA, so I don't want waste my time any more. That's why this module doesn't have wide browsers support (but it could), I just don't know how to introspect properties on Application instance. Also see [this answer](https://stackoverflow.com/a/41923909/14982288).

Please, let me know if you have an idea how to make this module work on all platforms.
