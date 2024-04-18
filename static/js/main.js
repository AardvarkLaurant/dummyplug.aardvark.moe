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

    window.DummyPlug = {
        content: null,
        footnotes: null,
        references: null,
        init: () => {
            window.DummyPlug.content = $('#article-body');
            window.DummyPlug.footnotes = $('#footnotes');
            window.DummyPlug.references = $('#references');
            window.DummyPlug.restoreButtonState();
        },
        buttonToggle: e => {
            e.target.classList.toggle('active');

            const controlledElement = $(`#${e.target.getAttribute('aria-controls')}`);
            controlledElement.classList.toggle('show');
            controlledElement.focus();

            $('#pane-right .pane-item.show') ? reader.classList.add('two-pane') : reader.classList.remove('two-pane');

            window.DummyPlug.recordButtonState(e.target);
        },
        handleLinkNavigation: e => {
            e.preventDefault();

            // This is a naive implementation to show how it could work.
            // Right now the link in the table of contents just links directly to a JSON,
            // but you would ideally communicate to the server that this is an AJAX request,
            // and so the server would send back a JSON representation of the page instead
            // of a full HTML document.
            // 
            const route = `${e.target.href}`;

            window.DummyPlug.navigate(route);
        },
        navigate: route => {
            fetch(route)
            .then(response => response.json())
            .then(data => {
                window.history.pushState({route}, '', e.target.href);

                document.title = data.title;
                window.DummyPlug.content.innerHTML = data.content;
                window.DummyPlug.footnotes.innerHTML = data.footnotes;
                window.DummyPlug.references.innerHTML = data.references;
            })
            .catch(error => {
                console.log(error);
            });
        },
        handlePopState: e => {
            const { route } = e.state.route;
            if (route) {
                window.DummyPlug.navigate(route);
            }
        },
        recordButtonState: el => {
            let buttonStates = window.DummyPlug.Storage.Get('buttonStates') || {};

            buttonStates[el.id] = el.classList.contains('active') ? 1 : 0;

            const buttonStatesString = JSON.stringify(buttonStates);

            window.DummyPlug.Storage.Set('buttonStates', buttonStatesString);
        },
        restoreButtonState: () => {
            let buttonStates = window.DummyPlug.Storage.Get('buttonStates') || {};

            if (!buttonStates) {
                $$('.btn-toggle').forEach(button => {
                    window.DummyPlug.recordButtonState(button);
                });
            }

            for (let id in buttonStates) {
                const el = $(`#${id}`);
                if (buttonStates[id]) {
                    el.classList.add('active');
                    const controlledElement = $(`#${el.getAttribute('aria-controls')}`);
                    controlledElement.classList.add('show');
                } else {
                    el.classList.remove('active');
                    const controlledElement = $(`#${el.getAttribute('aria-controls')}`);
                    controlledElement.classList.remove('show');
                }

                $('#pane-right .pane-item.show') ? reader.classList.add('two-pane') : reader.classList.remove('two-pane');
            }
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
        el.addEventListener('click', window.DummyPlug.handleLinkNavigation);
    });
    window.addEventListener('popstate', window.DummyPlug.handlePopState);

    $$('.btn-toggle').forEach(el => {
        el.addEventListener('click', window.DummyPlug.buttonToggle);
    });

    // Service Worker
    'serviceWorker' in navigator && navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
    }).catch(e => {
        console.error(e);
    });
})();