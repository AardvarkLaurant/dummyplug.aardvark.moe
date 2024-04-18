(function() {
    "use strict";
    const on = addEventListener,
    $ = q => {
        return document.querySelector(q)
    },
    $$ = q => {
        return document.querySelectorAll(q)
    },
    docBody = document.body,
    siteMenuWrap = $('#site-menu-wrap'),
    siteMenu = $('#site-menu'),
    siteMenuButton = $('#site-menu-button'),
    settingsMenuWrap = $('#settings-menu-wrap'),
    settingsMenu = $('#settings-menu'),
    settingsMenuButton = $('#settings-menu-button'),
    reader = $('.reader');
    siteMenuButton.addEventListener('click', e => {
        siteMenuWrap.classList.toggle('show');
        siteMenuWrap.classList.contains('show') ? siteMenu.focus() : siteMenuButton.focus();
    });
    siteMenuWrap.addEventListener('click', e => {
        !e.target.closest('#site-menu-button') && !e.target.closest('#site-menu') && siteMenuWrap.classList.remove('show');
    });
    settingsMenuButton && settingsMenuButton.addEventListener('click', e => {
        settingsMenuWrap.classList.toggle('show');
        settingsMenuWrap.classList.contains('show') ? settingsMenu.focus() : settingsMenuButton.focus();
    });
    settingsMenuButton && settingsMenuWrap.addEventListener('click', e => {
        !e.target.closest('#settings-menu-button') && !e.target.closest('#settings-menu') && settingsMenuWrap.classList.remove('show');
    });
    $$('.btn-toggle').forEach(el => {
        el.addEventListener('click', e => {
            e.target.classList.toggle('active');

            const controlledElement = $(`#${e.target.getAttribute('aria-controls')}`);
            controlledElement.classList.toggle('show');
            controlledElement.focus();

            $('#pane-right .pane-item.show') ? reader.classList.add('two-pane') : reader.classList.remove('two-pane');
        });
    });

    window.DummyPlug = {
        content: null,
        footnotes: null,
        references: null,
        init: () => {
            window.DummyPlug.content = $('#article-body');
            window.DummyPlug.footnotes = $('#footnotes');
            window.DummyPlug.references = $('#references');
        },
        handleNavigation: e => {
            e.preventDefault();

            route = `${e.target.href}`;

            fetch(route)
            .then(response => response.json())
            .then(data => {
                window.history.pushState({}, '', e.target.href);

                document.title = data.title;
                window.DummyPlug.content.innerHTML = data.content;
                window.DummyPlug.footnotes.innerHTML = data.footnotes;
                window.DummyPlug.references.innerHTML = data.references;
            })
            .catch(error => {

            });
        },
        recordButtonState: e => {

        },
        Storage: {
            Get: function(e) {
                try {
                    return window.localStorage.getItem(e)
                } catch {
                    return null
                }
            },
            Set: function(e, t) {
                try {
                    window.localStorage.setItem(e, t)
                } catch {}
            },
            Remove: function(e) {
                try {
                    window.localStorage.removeItem(e)
                } catch {}
            }
        }
    }
    window.DummyPlug.init();
    $$('#table-of-contents a').forEach(el => {
        el.addEventListener('click', window.DummyPlug.handleNavigation);
    });

    // Service Worker
    'serviceWorker' in navigator && navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
    }).catch(e => {
        console.error(e);
    });
})();