


    chrome.storage.sync.get({
        createDelete:true,
        transactorsDelete:true,
        ccUsersDelete:true
    }, function(settings) {

        function hideElementsByClass(className) {
            const style = document.createElement('style');
            style.innerHTML = `
                .${className} {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
        

        
        if (settings.createDelete) {
            hideElementsByClass("flow-manage-menu-wrapper.create");
        }

        if (settings.transactorsDelete) {
            hideElementsByClass("flow-manage-menu-wrapper.transactors");
        }

        if (settings.ccUsersDelete) {
            hideElementsByClass("flow-manage-menu-wrapper.ccUsers");
        }
    });

