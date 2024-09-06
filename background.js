chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
	console.log("info: ", info);

	if(info.status === "complete") {
		console.log("TAB: ", tab, tabId);
		if (tab.url && tab.url.includes("youtube.com/watch")) {
			const queryParameters = tab.url.split("?")[1];
			const urlParameters = new URLSearchParams(queryParameters);

			console.log(urlParameters);

			chrome.tabs.sendMessage(tabId, {
				type: "NEW",
				videoId: urlParameters.get("v"),
			});
		}
	}
});
