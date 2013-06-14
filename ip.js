function placeIPDiv () {

	// Show IP at the bottom left for these websites
	var noRight = new Array(
		"mail.google.com",
		"www.google.com.*",
		"www.facebook.com",
		".*renren.com"
	);

	var div_align = "right";
	for (var idx in noRight) {
		if (window.location.host.match(noRight[idx])) {
			div_align = "left";
			break;
		}
	}

	chrome.extension.sendMessage({op: "getip"}, function(response) {
		var ip = response.ip;
		chrome.extension.sendMessage({op: "is_enabled"}, function(response) {
			var ext_enabled = response.ext_enabled;
			if (ext_enabled == 1 || ext_enabled === undefined) {
				$("body").append('<div id="chrome_websiteIP" class="chrome_websiteIP_' + div_align + '">' + ip + '</div>');
			}
		});
	});

	$("#chrome_websiteIP").live('mouseover', function() {
		if ($(this).hasClass('chrome_websiteIP_right')) {
			$(this).removeClass("chrome_websiteIP_right");
			$(this).addClass("chrome_websiteIP_left");
		}
		else {
			$(this).removeClass("chrome_websiteIP_left");
			$(this).addClass("chrome_websiteIP_right");
		}
	});
}

$(document).ready(placeIPDiv);

$(document).keyup(function(e) {
	// If the 'Esc' key is pressed before the HTML (yes, HTML only) could
	// fully load, show the IP <div> as $(document).ready() doesn't execute.
	if (document.getElementById('chrome_websiteIP') === null && e.keyCode == 27)
		placeIPDiv();

	else if (e.keyCode == 113) {
		window.prompt('IP of "' + window.location.host + '":',
					  document.getElementById('chrome_websiteIP').innerText);
	}
});
