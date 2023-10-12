


    chrome.storage.sync.get({
        ctrlDaiban: true
    }, function(settings) {

        if (settings.ctrlDaiban) {
            document.addEventListener('keydown', function(event) {
                // 检查是否是 Ctrl + Q
                if (event.ctrlKey && event.code === 'KeyQ') {
                    event.preventDefault();  // 阻止默认
                
                    let todo = document.querySelectorAll("div.flow-manage-menu-wrapper.todo")[0];
                    todo.click();
                }
            });
        }
    });

