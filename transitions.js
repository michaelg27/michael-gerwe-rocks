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
})();
