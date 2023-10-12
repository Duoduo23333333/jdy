let currentAppId = 0;

function executeScript() {

    let match = window.location.href.match(/https:\/\/www.jiandaoyun.com\/dashboard(?:#)?\/app\/([^\/]+)/);
    let appId = match ? match[1] : null;

    if (appId=== null) {
        return;
    }
    if (appId === currentAppId) {
        return;
    }

    currentAppId = appId;


chrome.storage.sync.get({
    threeList: true
}, function(settings) {

    function injectScript(file_path) {
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', file_path);
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }
    

    injectScript(chrome.runtime.getURL('pageScript.js'));

    let csrfToken = null;
let jdyVer = null;

    window.addEventListener('message', function(event) {
        if (event.source !== window) return;
        if (event.data.type && event.data.type === 'FROM_PAGE') {
            csrfToken = event.data.csrfToken;
     jdyVer = event.data.jdyVer;
     

        }
    });
    
    
// 执行前先恢复原始的DOM元素
let oldTab1Content = document.querySelector('.tab-content');
if (oldTab1Content) {
    let menuWrapper = document.querySelector('.menu-wrapper');
    while (oldTab1Content.firstChild) {
        menuWrapper.appendChild(oldTab1Content.firstChild);
    }
}
// 然后再清理旧DOM
let oldTabWrapper = document.querySelector('.tab-wrapper');
if (oldTabWrapper) {
    oldTabWrapper.remove();
}
let oldTabContents = document.querySelectorAll('.tab-content');
oldTabContents.forEach(tc => tc.remove());


let appId = window.location.href.match(/https:\/\/www.jiandaoyun.com\/dashboard(?:#)?\/app\/([^\/]+)/)[1];
 


    function fetchIntelligentContent() {

    let url = `https://www.jiandaoyun.com/_/admin/app/${appId}/list_trigger`;
    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRF-Token': csrfToken,
            'X-JDY-VER': jdyVer
        }
    }).then(response => response.json()).then(data => {
        updateIntelligentContent(data, appId, csrfToken, jdyVer);
    });
}

function updateIntelligentContent(data, appId, csrfToken, jdyVer) {
    let tabContent = document.querySelectorAll('.tab-content')[1];
    tabContent.innerHTML = '';  // 清空原内容

    let settingsDiv = document.createElement('div');
settingsDiv.className = 'trigger-item';
    settingsDiv.id = 'trigger-all';

let settingsLink = document.createElement('a');

settingsLink.href = `https://www.jiandaoyun.com/dashboard/app/${appId}/settings#/app_trigger`;
settingsLink.innerText = '智能助手管理后台';  
settingsDiv.appendChild(settingsLink);

tabContent.insertBefore(settingsDiv, tabContent.firstChild);


    data.triggers.forEach(trigger => {
        let div = document.createElement('div');
        div.className = 'trigger-item';

        let link = document.createElement('a');
        link.href = `https://www.jiandaoyun.com/dashboard/app/${appId}/data_trigger?triggerId=${trigger._id}&referer_uri=/dashboard/app/${appId}/settings#/app_trigger`;
        link.innerText = trigger.name;
            // 阻止a标签的默认行为和事件冒泡
    link.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        window.open(link.href, '_blank');
    });
        div.appendChild(link);
        div.addEventListener('click', function() {
            window.open(link.href, '_blank');
        });


        let switchEl = document.createElement('button');
        switchEl.className = trigger.enable ? 'switch on' : 'switch off';
       switchEl.addEventListener('click', function() {
        event.stopPropagation();
    let enable = !trigger.enable;  
    fetch(`https://www.jiandaoyun.com/_/admin/app/${appId}/trigger/${trigger._id}/enable`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-CSRF-Token': csrfToken,
            'X-JDY-VER': jdyVer
        },
        body: JSON.stringify({ enable: enable })
    }).then(response => {
        if (response.ok) {
            switchEl.className = enable ? 'switch on' : 'switch off';  
            trigger.enable = enable;  
        }
    });
});
        div.appendChild(switchEl);

        tabContent.appendChild(div);
    });
}


function fetchAggregateContent() {
    let url = `https://www.jiandaoyun.com/_/admin/app/${appId}/aggregate_table/list`;
    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRF-Token': csrfToken,
            'X-JDY-VER': jdyVer
        }
    }).then(response => response.json()).then(data => {
        updateAggregateContent(data);
    });
}

function updateAggregateContent(data) {
    let tabContent = document.querySelectorAll('.tab-content')[2];
    tabContent.innerHTML = ''; 

    let settingsDiv = document.createElement('div');
    settingsDiv.className = 'aggregate-item';
    settingsDiv.id = 'aggregate-all';

    let settingsLink = document.createElement('a');
    settingsLink.href = `https://www.jiandaoyun.com/dashboard/app/${appId}/settings#/app_aggregate`;
    settingsLink.innerText = '聚合表管理后台';
    settingsDiv.appendChild(settingsLink);
    tabContent.insertBefore(settingsDiv, tabContent.firstChild);

    data.entryList.forEach(entry => {
        let div = document.createElement('div');
        div.className = 'aggregate-item';
    
        let link = document.createElement('a');
        link.href = `https://www.jiandaoyun.com/dashboard/app/${appId}/aggregate_table/${entry.entryId}/edit`;
        link.innerText = entry.name;
        
        // 阻止a标签的默认行为和事件冒泡
        link.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            window.open(link.href, '_blank');
        });
    
        div.appendChild(link);
    
        div.addEventListener('click', function() {
            window.open(link.href, '_blank');
        });
    
        tabContent.appendChild(div);
    });
    
}

    function fetchETLContent() {
    let url = `https://www.jiandaoyun.com/_/admin/app/${appId}/list_etl`;
    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRF-Token': csrfToken,
            'X-JDY-VER': jdyVer
        }
    }).then(response => response.json()).then(data => {
        updateETLContent(data.etlList);
    }).catch(error => {
    });
}
// 辅助函数：确保数字是两位的
function formatTwoDigits(number) {
    return number < 10 ? '0' + number : number;
}
    function updateETLContent(etlList) {
    let tabContent = document.querySelectorAll('.tab-content')[3];
    tabContent.innerHTML = ''; 

    let settingsDiv = document.createElement('div');
    settingsDiv.className = 'etl-item';
    settingsDiv.id = 'etl-all';

    let settingsLink = document.createElement('a');
    settingsLink.href = `https://www.jiandaoyun.com/dashboard/app/${appId}/settings#/app_etl`;
    settingsLink.innerText = '数据工厂管理后台';
    settingsDiv.appendChild(settingsLink);
    tabContent.insertBefore(settingsDiv, tabContent.firstChild);

    etlList.forEach(etl => {
        let div = document.createElement('div');
        div.className = 'etl-item';
    
        let leftDiv = document.createElement('div');
        leftDiv.className = 'etl-left';
    
        let link = document.createElement('a');
        link.href = `https://www.jiandaoyun.com/dashboard/app/${appId}/etl/${etl.etlId}/edit`;
        link.innerText = etl.name;
    
        // 阻止a标签的默认行为和事件冒泡
        link.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            window.open(link.href, '_blank');
        });
    
        leftDiv.appendChild(link);
        div.appendChild(leftDiv);
    
        div.addEventListener('click', function() {
            window.open(link.href, '_blank');
        });

        leftDiv.appendChild(link);



let dateEl = document.createElement('span');
dateEl.id = `etl-${etl.etlId}-date`;
let date = new Date(etl.etlTable.data_modify_time);
dateEl.innerText = `${date.getFullYear()}年${formatTwoDigits(date.getMonth() + 1)}月${formatTwoDigits(date.getDate())}日 ${formatTwoDigits(date.getHours())}:${formatTwoDigits(date.getMinutes())}:${formatTwoDigits(date.getSeconds())}`;
leftDiv.appendChild(dateEl);

div.appendChild(leftDiv);

        let updateButton = document.createElement('button');
        updateButton.className = 'etl-refresh-button';
let svgContent = `<svg t="1696394141900" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2328" width="27" height="27"><path d="M919.467 526.933c-17.067 0-32-14.933-32-32 0-6.4 2.133-12.8 6.4-17.066l61.866-89.6c10.667-14.934 29.867-17.067 44.8-8.534s17.067 29.867 8.534 44.8l-61.867 89.6c-8.533 8.534-19.2 12.8-27.733 12.8z" p-id="2329" fill="#707070"></path><path d="M919.467 526.933c-6.4 0-12.8-2.133-17.067-6.4L810.667 460.8c-14.934-8.533-19.2-29.867-10.667-44.8s29.867-19.2 44.8-10.667l2.133 2.134 89.6 61.866c14.934 10.667 19.2 29.867 8.534 44.8-6.4 8.534-17.067 12.8-25.6 12.8z" p-id="2330" fill="#707070"></path><path d="M482.133 983.467c-260.266 0-471.466-211.2-471.466-469.334s211.2-471.466 471.466-473.6c228.267 0 422.4 162.134 462.934 386.134 2.133 17.066-8.534 34.133-25.6 38.4-17.067 2.133-34.134-8.534-38.4-25.6-40.534-219.734-251.734-366.934-473.6-326.4S40.533 364.8 81.067 586.667s253.866 366.933 473.6 326.4C665.6 891.733 763.733 825.6 825.6 729.6c8.533-14.933 29.867-19.2 44.8-10.667 14.933 8.534 19.2 29.867 10.667 44.8-87.467 136.534-236.8 219.734-398.934 219.734z" p-id="2331" fill="#707070"></path><path d="M482.133 450.133c-113.066 0-236.8-34.133-236.8-108.8s121.6-106.666 236.8-106.666 236.8 34.133 236.8 106.666-123.733 108.8-236.8 108.8z m0-153.6c-108.8 0-168.533 32-172.8 44.8 4.267 10.667 61.867 44.8 172.8 44.8s166.4-32 172.8-44.8c-6.4-12.8-64-44.8-172.8-44.8z m172.8 44.8z" p-id="2332" fill="#707070"></path><path d="M482.133 563.2c-113.066 0-236.8-34.133-236.8-108.8 0-17.067 14.934-32 32-32s32 14.933 32 32c4.267 12.8 61.867 44.8 172.8 44.8s168.534-32 172.8-44.8c0-17.067 14.934-32 32-32s32 14.933 32 32c0 74.667-123.733 108.8-236.8 108.8z" p-id="2333" fill="#707070"></path><path d="M482.133 678.4c-113.066 0-236.8-34.133-236.8-108.8 0-17.067 14.934-32 32-32s32 14.933 32 32c4.267 10.667 61.867 44.8 172.8 44.8s168.534-32 172.8-44.8c0-17.067 14.934-32 32-32s32 14.933 32 32c0 74.667-123.733 108.8-236.8 108.8z" p-id="2334" fill="#707070"></path><path d="M482.133 791.467c-113.066 0-236.8-34.134-236.8-108.8V339.2c0-17.067 14.934-32 32-32s32 14.933 32 32v341.333c4.267 12.8 61.867 44.8 172.8 44.8s168.534-32 172.8-44.8V339.2c0-17.067 14.934-32 32-32s32 14.933 32 32v341.333c0 76.8-123.733 110.934-236.8 110.934z" p-id="2335" fill="#707070"></path></svg>`;        updateButton.innerHTML = svgContent;
updateButton.innerHTML = svgContent;
        updateButton.style.cursor = "pointer"; 
        updateButton.addEventListener('click', function(e) {
            e.stopPropagation();
            initiateETLUpdate(etl);
        });
        div.appendChild(updateButton);

        div.addEventListener('click', function() {
            window.open(link.href, '_blank');
        });

        tabContent.appendChild(div);
    });
}


function initiateETLUpdate(etl) {
    let dateEl = document.querySelector(`#etl-${etl.etlId}-date`);
    dateEl.innerText = "更新中…";
    dateEl.style.color = "#6FB7AB";

    let updateUrl = `https://www.jiandaoyun.com/_/admin/app/${appId}/etl/${etl.etlId}/execute`;
    fetch(updateUrl, {
        method: 'POST',
        headers: {
            'X-CSRF-Token': csrfToken,
            'X-JDY-VER': jdyVer
        }
    }).then(() => {
        pollETLUpdateStatus(etl);
    }).catch(error => {
    });
}

function pollETLUpdateStatus(etl) {
    let startTime = Date.now();
    let dateEl = document.querySelector(`#etl-${etl.etlId}-date`);

    let pollInterval = setInterval(() => {
        if (Date.now() - startTime > 15000) {
            clearInterval(pollInterval);
            dateEl.innerText = "更新未完成，请去后台查看详情";
            dateEl.style.color = "#d15959";
            return;
        }
        fetchETLContentForPolling(etl, pollInterval); 
    }, 1000);
}


function fetchETLContentForPolling(targetEtl, pollInterval) {
    let url = `https://www.jiandaoyun.com/_/admin/app/${appId}/list_etl`;
    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRF-Token': csrfToken,
            'X-JDY-VER': jdyVer
        }
    }).then(response => response.json()).then(data => {
        let updatedEtl = data.etlList.find(e => e.etlId === targetEtl.etlId);
        if (updatedEtl.etlTable.data_modify_time !== targetEtl.etlTable.data_modify_time) {
let dateEl = document.querySelector(`#etl-${updatedEtl.etlId}-date`);
let date = new Date(updatedEtl.etlTable.data_modify_time);
dateEl.innerText = `${date.getFullYear()}年${formatTwoDigits(date.getMonth() + 1)}月${formatTwoDigits(date.getDate())}日 ${formatTwoDigits(date.getHours())}:${formatTwoDigits(date.getMinutes())}:${formatTwoDigits(date.getSeconds())}`;
dateEl.style.color = "#6fb7ab";
            clearInterval(pollInterval); 
        }
    }).catch(error => {
    });
}


if (settings.threeList) {


    let isModified = false;  // 标志，表示是否已经修改过DOM


    function modifyDOM() {
        if (isModified) return;  // 如果已经修改过，直接返回

        // 1. 获取menu-wrapper元素
        let menuWrapper = document.querySelector('.menu-wrapper');
        if (!menuWrapper) {
            return;
        }

        // 2. 创建选项卡元素
        let tabWrapper = document.createElement('ul');
        tabWrapper.className = 'tab-wrapper';

        let tabNames = ['表单', '智能', '聚合', '工厂'];
        let tabs = tabNames.map(name => {
            let tab = document.createElement('li');
            let div = document.createElement('div');
            div.innerText = name;
            tab.appendChild(div);
            return tab;
        });

        tabs.forEach(tab => tabWrapper.appendChild(tab));

        // 将选项卡元素插入到第一个div元素之后
        menuWrapper.insertBefore(tabWrapper, menuWrapper.children[1]);

        // 3. 将第二和第三个div元素放入第一个选项卡的内容中
        let tab1Content = document.createElement('div');
        tab1Content.className = 'tab-content';

        while (menuWrapper.children.length > 2) {
            tab1Content.appendChild(menuWrapper.children[2]);
        }

        // 为其他选项卡创建占位元素
        let placeholders = ['能看到这个说明你该刷新了', '能看到这个说明你该刷新了', '能看到这个说明你该刷新了', '能看到这个说明你该刷新了'];
        let tabContents = [tab1Content, ...placeholders.slice(1).map(text => {
            let div = document.createElement('div');
            div.className = 'tab-content';
            div.innerText = text;
            return div;
        })];

        tabContents.forEach(tc => menuWrapper.appendChild(tc));

        // 4. 点击选项卡切换内容显示
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.style.display = 'none');
                tab.classList.add('active');
                tabContents[index].style.display = 'block';
            });
        });


        // 默认显示第一个选项卡的内容
        tabs[0].click();

        let style = document.createElement('style');
        style.innerHTML = `
        .tab-wrapper {
            display: flex;
            padding: 0 2px;
            background: #f5f5f5 !important;
            border-bottom:  0px solid #ccc;




        }
        .tab-wrapper > li {
            padding: 8px 7%;
            list-style-type: none;
            cursor: pointer;

            margin: 0px;
            border-radius: 3px;
            box-shadow:-4px -1px 4px 0px #8888882b;
            background-color: #f5f5f5;
            transform: scale(0.9);
        }
        .tab-wrapper > li > div {
            display: inline-block;
                color: #525967;
        }
        .tab-wrapper > li.active {
            background-color: #fFF;
            transform: scale(1);

        }
        .tab-content {
            display: none;
        }

        #trigger-all{
                     margin-top: 20px;
                     margin-bottom: 15px;
    background:#F5F5F5;
        }

#trigger-all:hover {
    background-color: #e3e3e3; /* 悬停时的背景色 */
}



                #trigger-all a{
                             display: inline-block;
    text-align: center;
    position: relative;
    margin: 0 auto;
    color:#525967;
        }



        #aggregate-all{
                     margin-top: 20px;
                     margin-bottom: 15px;
    background:#F5F5F5;
        }

#aggregate-all:hover {
    background-color: #e3e3e3; /* 悬停时的背景色 */
}



                #aggregate-all a{
                             display: inline-block;
    text-align: center;
    position: relative;
    color:#525967;
        }



       .fx-flow-manage-menu,.fx-app-switch-trigger{
        background: #f5f5f5 !important;
        }

        .switch {
    background-color: #ccc;
    border: 0px solid #aaa;
    width: 44px;
    height: 22px;
    border-radius: 12px;
    position: relative;
    display: inline-block;
    cursor: pointer;
    margin-left: 10px;
    margin-left: auto; /* 将其推到容器的右侧 */
}
.switch.on {
    background-color: #00b899;
}
.switch::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border-radius: 9px;
    top: 3px;
    left: 3px;
    transition: left 0.2s;
}
.switch.on::after {
    left: 25px;
}
.trigger-item {
    background-color: #FFF; /* 背景色 */
    border: 1px solid #e1e1e1; /* 边框 */
    border-radius: 5px; /* 圆角 */
    padding: 10px; /* 内边距 */
    margin:-5px 12px;
    display: flex; /* 使用flex布局使内容水平排列 */
    align-items: center; /* 垂直居中对齐子元素 */
    margin-bottom: 10px; /* 每个条目之间的间距 */
    cursor: pointer; /* 更改鼠标样式 */
    transition: background-color 0.2s; /* 添加过渡效果 */
}

.trigger-item:hover {
    background-color: #F0F1F4; /* 悬停时的背景色 */
}

.trigger-item a {

    flex-grow: 1; /* 让链接占据大部分空间 */
    max-width: 72%;
    font-size: 13px; /* 字体大小 */
    color: #6a6a6a; /* 字体颜色 */
    text-decoration: none; /* 移除下划线 */
    margin-right: 20px; /* 右边距，与开关之间的间距 */
}

.aggregate-item {
    background-color: #FFF; /* 背景色 */
    border: 1px solid #e1e1e1; /* 边框 */
    border-radius: 5px; /* 圆角 */
    padding: 10px; /* 内边距 */
    margin:-5px 12px;
    display: flex; /* 使用flex布局使内容水平排列 */
    align-items: center; /* 垂直居中对齐子元素 */
    margin-bottom: 10px; /* 每个条目之间的间距 */
    cursor: pointer; /* 更改鼠标样式 */
    transition: background-color 0.2s; /* 添加过渡效果 */
}

.aggregate-item:hover {
    background-color: #F0F1F4; /* 悬停时的背景色 */
}

.aggregate-item a {

    flex-grow: 1; /* 让链接占据大部分空间 */
    font-size: 13px; /* 字体大小 */
    color: #6a6a6a; /* 字体颜色 */
    text-decoration: none; /* 移除下划线 */
}



.etl-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
        background-color: #FFF; /* 背景色 */
    border: 1px solid #e1e1e1; /* 边框 */
    border-radius: 5px; /* 圆角 */
    padding: 10px; /* 内边距 */
    margin:-5px 12px;
    margin-bottom: 10px; /* 每个条目之间的间距 */
    cursor: pointer; /* 更改鼠标样式 */
    transition: background-color 0.2s; /* 添加过渡效果 */
}

.etl-item:hover {
    background-color: #F0F1F4; /* 悬停时的背景色 */
}

.etl-left {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-right: 20px;
}

.etl-left a {
    flex-grow: 1;
    font-size: 13px;
    color: #444444;
    text-decoration: none;
}

.etl-left span {
flex-grow: 1;
    font-size: 11px;
    color: #9d9d9d;
    text-decoration: none;
    margin-top: 5px;
    margin-bottom: -5px;}

.etl-refresh-button {
    background: #00000000;
    cursor: pointer;
    border: none;
    width: 30px; 
    height: 30px;
    cursor: pointer;
    margin-bottom: -5px;
}
.etl-refresh-button svg {
    transition: all 0.3s;
}

.etl-refresh-button:hover svg {
    opacity: 0.6;
    transform: scale(1.1);
}


        #etl-all{
                     margin-top: 20px;
                     margin-bottom: 15px;
    background:#F5F5F5;
        }

#etl-all:hover {
    background-color: #e3e3e3; /* 悬停时的背景色 */
}



                #etl-all a{
                             display: inline-block;
    text-align: center;
    position: relative;
        margin: 0 auto;
    color:#525967;
        }




        `;
        document.head.appendChild(style);
        let interval = setInterval(() => {
            if (csrfToken !== null && jdyVer !== null) {
                clearInterval(interval);
                fetchIntelligentContent();
                fetchAggregateContent();
                fetchETLContent();
            }
        }, 100);  // 每100ms检查一次，拿到2个全局变量后

        isModified = true;  
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                let menuWrapper = document.querySelector('.menu-wrapper');
                if (menuWrapper) {
                    observer.disconnect(); 
                    modifyDOM();
                }
            }
        }
    });

    const config = { childList: true, subtree: true };

    observer.observe(document.body, config);


}


});

}


window.addEventListener('hashchange', function() {
    executeScript();
});


executeScript();
