window.postMessage({
    type: 'FROM_PAGE',
    csrfToken: window.jdy_csrf_token,
    jdyVer: window.jdy_static.jdy_ver
}, '*');
