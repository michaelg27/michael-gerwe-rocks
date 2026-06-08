/* Gentle cross-fade between pages. Fade-in is handled by CSS on load;
   this intercepts internal navigations to fade out first. */
(function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a');
        if (!a) return;

        var href = a.getAttribute('href');
        if (!href) return;
        if (href.charAt(0) === '#') return;                 // in-page anchor
        if (a.target === '_blank') return;                  // new tab
        if (a.hasAttribute('download')) return;             // file download
        if (/^(mailto:|tel:)/i.test(href)) return;          // protocol links

        var url;
        try { url = new URL(a.href, location.href); } catch (err) { return; }
        if (url.origin !== location.origin) return;         // external site
        if (url.pathname === location.pathname && url.hash) return; // same-page jump

        e.preventDefault();
        document.body.classList.add('is-leaving');
        setTimeout(function () { window.location.href = a.href; }, 280);
    });

    // If the user comes back via the bfcache, clear the faded-out state.
    window.addEventListener('pageshow', function (ev) {
        if (ev.persisted) document.body.classList.remove('is-leaving');
    });

    /* ── Cards "drawn" into being as you scroll: bouncy pop-in ── */
    var revealables = document.querySelectorAll('.panel, .category-link, details.panel');
    if (revealables.length && 'IntersectionObserver' in window) {
        revealables.forEach(function (el) { el.classList.add('pop-in'); });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                entry.target.classList.toggle('pop-in-visible', entry.isIntersecting);
            });
        }, { threshold: 0.5, rootMargin: '0px 0px -60px 0px' });
        revealables.forEach(function (el) { io.observe(el); });
    } else {
        revealables.forEach(function (el) { el.classList.add('pop-in', 'pop-in-visible'); });
    }
})();
