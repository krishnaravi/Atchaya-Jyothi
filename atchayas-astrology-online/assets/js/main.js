(function () {
	'use strict';

	var header = document.getElementById('site-header');
	var toggle = document.getElementById('menu-toggle');
	var nav = document.getElementById('primary-navigation');

	if (toggle && nav) {
		toggle.addEventListener('click', function () {
			var expanded = toggle.getAttribute('aria-expanded') === 'true';
			toggle.setAttribute('aria-expanded', String(!expanded));
			nav.classList.toggle('is-open');
		});

		document.addEventListener('click', function (e) {
			if (!nav.contains(e.target) && !toggle.contains(e.target)) {
				toggle.setAttribute('aria-expanded', 'false');
				nav.classList.remove('is-open');
			}
		});
	}

	if (header) {
		window.addEventListener('scroll', function () {
			header.classList.toggle('is-scrolled', window.scrollY > 20);
		}, { passive: true });
	}
})();
