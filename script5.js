


    chrome.storage.sync.get({
        ctrlSubmit: true
    }, function(settings) {

        if (settings.ctrlSubmit) {
            document.addEventListener('keydown', function(event) {
                // 检查是否是 Ctrl + S
                if (event.ctrlKey && event.key === 's') {
                    event.preventDefault();  // 阻止默认的保存

                    // 获取所有button
                    let buttons = document.querySelectorAll('button');
                    for (let i = buttons.length - 1; i >= 0; i--) {
                        let button = buttons[i];
                        let span = button.querySelector('span');
                        if (span && span.textContent === '提交') {
                            button.click();
                            break;
                        }
                    }
                }
            });
        }
    });

