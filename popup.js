document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get({
        escClose: true,
        leftClickClose: true,
        dblClickClose: true,
        rightClickClose: true,
        ctrlSave: true,
        ctrlSubmit: true,
        ctrlDaiban: true,
        openRight: true,
        openDoubleClick: true,
        NavItems: true,
        threeList: true,
        createDelete: true,
        transactorsDelete: true,
        ccUsersDelete: true
    }, function(items) {
        for (let key in items) {
            const checkbox = document.getElementById(key);
            const container = checkbox.parentElement;
            checkbox.checked = items[key];
            if (items[key]) {
                container.classList.add('active');
            } else {
                container.classList.remove('active');
            }
        }
    });

    const containers = document.querySelectorAll('.option-container');
    containers.forEach(function(container) {
        container.addEventListener('click', function() {
            const checkbox = container.querySelector('input[type=checkbox]');
            checkbox.checked = !checkbox.checked;
            let changes = {};
            changes[checkbox.id] = checkbox.checked;
            chrome.storage.sync.set(changes);

            if (checkbox.checked) {
                container.classList.add('active');
            } else {
                container.classList.remove('active');
            }
        });
    });
});
