(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const { type, value, videoId } = message;

        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        } else if(type === "PLAY") {
            youtubePlayer.currentTime = value;
        } else if(type === "DELETE") {
            currentVideoBookmarks = currentVideoBookmarks.filter(b => b.time !== value);
            chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });

            sendResponse(currentVideoBookmarks);
        }
    });

    const getBookmarks = () => {
        return new Promise ((resolve, reject) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(JSON.parse(obj[currentVideo] || "[]"));
            });
        }) 
    };

    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmarks = await getBookmarks();

        if(!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button" + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark this timestamp";
            bookmarkBtn.style.marginRight = "10px";
            bookmarkBtn.style.cursor = "pointer";

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];
            
            youtubeLeftControls.appendChild(bookmarkBtn);

            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    };

    const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime;
        currentVideoBookmarks = await getBookmarks();

        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };

        console.log(newBookmark);

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([ ...currentVideoBookmarks, newBookmark ].sort((a, b) => a.time - b.time)),
        })
    };

    newVideoLoaded();
})();

const getTime = (timeInSeconds) => {
    let date = new Date(0);
    date.setSeconds(timeInSeconds);

    return date.toISOString().substring(11, 19);
}
