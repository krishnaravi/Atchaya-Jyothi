(function () {
	'use strict';

	var COOKIE_NAME = 'atchaya_lang';
	var COOKIE_DAYS = 365;

	function setCookie(name, value, days) {
		var expires = '';
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = '; expires=' + date.toUTCString();
		}
		document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
	}

	function getCookie(name) {
		var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? decodeURIComponent(match[2]) : null;
	}

	document.querySelectorAll('.lang-btn').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var lang = btn.getAttribute('data-lang');
			if (!lang || lang === getCookie(COOKIE_NAME)) {
				return;
			}
			setCookie(COOKIE_NAME, lang, COOKIE_DAYS);
			document.documentElement.setAttribute('data-atchaya-lang', lang);
			window.location.reload();
		});
	});
})();
