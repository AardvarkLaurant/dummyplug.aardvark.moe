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
            $(`#${e.target.getAttribute('aria-controls')}`).classList.toggle('show');
            e.target.classList.toggle('active');

            $$('#pane-right .pane-item.show') ? reader.classList.add('two-pane') : reader.classList.remove('two-pane');
        });
    });

    window.DummyPlug = {
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
})();