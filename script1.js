


chrome.storage.sync.get({
    escClose: true,
    leftClickClose: true,
    dblClickClose: true,
    rightClickClose: true,
    ctrlSave: true
}, function(settings) {

// 关闭弹窗
function closePopup(currentPopup) {
let closeButtons = currentPopup.querySelectorAll('.close-btn,.icon-close');
if (closeButtons.length > 0) {
    closeButtons[closeButtons.length - 1].click();
}
}



    // 按下ESC键时关闭弹窗
    if (settings.escClose) {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closePopup(currentPopup);
            }
        });
    }


    // 双击页面外部时关闭弹窗
    if (settings.dblClickClose) {
        document.addEventListener('dblclick', function(event) {
            let popups = document.querySelectorAll('.content-wrapper, .fx-flow-data-wrapper, .fx-form-data-container,.fx-dash-widget-edit-page,.fx-form-data-dialog');
            if (popups.length > 0) {
                let currentPopup = popups[popups.length - 1];
                if (!currentPopup.contains(event.target)) {
                    closePopup(currentPopup);
                }
            }
        });
    }

    // 右键单击页面外部时关闭弹窗
    if (settings.rightClickClose) {
        document.addEventListener('contextmenu', function(event) {
            let popups = document.querySelectorAll('.content-wrapper, .fx-flow-data-wrapper, .fx-form-data-container,.fx-dash-widget-edit-page,.fx-form-data-dialog');
            if (popups.length > 0) {
                let currentPopup = popups[popups.length - 1];
                if (!currentPopup.contains(event.target)) {
                    closePopup(currentPopup);
                    event.preventDefault();  // 阻止默认的右键菜单显示
                }
            }
        });
    }

    // 左键单击页面外部时关闭弹窗
    if (settings.leftClickClose) {
        document.addEventListener('click', function(event) {
            let popups = document.querySelectorAll('.content-wrapper, .fx-flow-data-wrapper, .fx-form-data-container,.fx-dash-widget-edit-page,.fx-form-data-dialog,.x-popup');
            // 目前见到class是x-popup的好像都是下拉框，干脆直接这样当白名单用
            if (popups.length > 0) {
                let currentPopup = popups[popups.length - 1];
                if (!currentPopup.contains(event.target)) {
                    closePopup(currentPopup);
                }
            }
        });
    }



    



    if (settings.ctrlSave) {
        document.addEventListener('keydown', function(event) {
            // 检查是否是 Ctrl + S
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();  // 阻止默认的保存

                // 获取所有button
                let buttons = document.querySelectorAll('button');
                for (let i = buttons.length - 1; i >= 0; i--) {
                    let button = buttons[i];
                    let span = button.querySelector('span');
                    if (span && (span.textContent === '确定' || span.textContent === '保存' || span.textContent === '完成')) {
                        button.click();
                        break;
                    }
                }
            }
        });
    }
});















