// Extract domain name (DN) from URL
function url2dn (url) {
	var tmpa = document.createElement('a');
	tmpa.href = url;
	return tmpa.host;
}

// maintain a dict of IPs, indexed by DN
var ips = {};
chrome.webRequest.onCompleted.addListener(
	function (d) {
		ips[url2dn(d.url)] = d.ip;
		return ;
	},
	{
		urls: [],
		types: []
	},
	[]
);

if (localStorage["ext_enabled"] === undefined)
	localStorage.setItem("ext_enabled", 1);

// Listeners
chrome.extension.onMessage.addListener(
	function (request, sender, callback) {
		switch (request.op) {

		case "enable":
			localStorage.setItem("ext_enabled", 1);
			break;

		case "disable":
			localStorage.setItem("ext_enabled", 0);
			break;

		case "is_enabled":
			callback({ext_enabled: localStorage["ext_enabled"]});
			break;

		case "getip":
			var dn = url2dn(sender.tab.url);
			callback({ip: ips[dn]});
			break;

		default:
			break;
		}
	}
);

chrome.browserAction.onClicked.addListener(function (t) {
	e = localStorage["ext_enabled"];
	if (e == 1) {
		iconDetails = {path: "/images/icon19_grey_stop.png"};

	} else {
		iconDetails = {path: "/images/icon19.png"};
	}
	chrome.browserAction.setIcon(iconDetails, null);
	localStorage["ext_enabled"] = 1 - e;
});
