# In manifest.json
{
    "name": "Personal YT Bookmarks", // Name of the extension that'll be displayed in the browser
    "version": "0.1.0", // Version of the extension
    "description": "Saving timestamps in YT videos", // Description of the extension
    "permissions": ["storage", "tabs"], // Permissions that the extension requires
    "host_permissions": ["https://*.youtube.com/*"], // Gives you the ability to send cors requests to the youtube api
    "background": {
      "service_worker": "background.js", // JS that runs separately from the main browser thread
    },
    "content_scripts": [
      {
        "matches": ["https://*.youtube.com/*"], // The URL that the content script will be injected into
        "js": ["contentScript.js"] // The JS that will be injected into the page
      }
    ],
    "web_accessible_resources": [
      {
        "resources": [
          "assets/bookmark.png",
          "assets/play.png",
          "assets/delete.png",
          "assets/save.png"
        ],
        "matches": ["https://*.youtube.com/*"]
      }
    ],
    "action": {
      "default_icon": {
        "16": "assets/ext-icon.png",
        "24": "assets/ext-icon.png",
        "32": "assets/ext-icon.png"
      },
      "default_title": "Personal YT Bookmarks (Default)",
      "default_popup": "popup.html" // The HTML that'll be displayed in the browser when the extension is clicked
    },
    "manifest_version": 3 // The version of the manifest file format that's being used
}
