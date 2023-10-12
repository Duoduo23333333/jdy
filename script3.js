



    chrome.storage.sync.get({
        NavItems: true
    }, function(settings) {


        let appId = window.location.href.match(/https:\/\/www.jiandaoyun.com\/dashboard(?:#)?\/app\/([^\/]+)/)[1];

        function createNavItem(name, url) {
            const li = document.createElement('li');
            li.className = 'tab-header-item form-tab-item';
            li.setAttribute('data-tab-id', name.toLowerCase().replace(/\s/g, '-'));
    
            const div = document.createElement('div');
            div.className = 'tab-header-content';
            div.title = name;
            div.textContent = name;
    
            div.addEventListener('click', () => window.open(url, '_blank'));
    
            li.appendChild(div);
    
            return li;
        }
    
        function tryToAddNavItems() {
            const navigationCenter = document.querySelector('.navigation-center');
            if (!navigationCenter) return false;
    
            const tabHeaderWrapper = navigationCenter.querySelector('.tab-header-wrapper');
            if (!tabHeaderWrapper) return false;
    
            const urls = [
                `https://www.jiandaoyun.com/dashboard/app/${appId}/settings#/app_trigger`,
                `https://www.jiandaoyun.com/dashboard/app/${appId}/settings#/app_aggregate`,
                `https://www.jiandaoyun.com/dashboard/app/${appId}/settings#/app_etl`,
            ];
    
            const newItems = [
                createNavItem('智能助手', urls[0]),
                createNavItem('聚合表', urls[1]),
                createNavItem('数据工厂', urls[2])
            ];
            newItems.forEach(item => tabHeaderWrapper.appendChild(item));
    
            return true;
        }
        if (settings.NavItems) {
        const interval = setInterval(() => {
            if (tryToAddNavItems()) {
                clearInterval(interval);
    
                const style = document.createElement('style');
                style.textContent = `
                    .fx-form-navigation-bar .x-tab.horizontal-tab .form-nav-tab [data-tab-id="data"]:after,
                    .fx-form-navigation-bar .x-tab.horizontal-tab .form-nav-tab [data-tab-id="智能助手"]:after {
                        background: #e1e3e5;
                        content: "";
                        cursor: none;
                        display: block;
                        height: 20px;
                        left: -23px;
                        pointer-events: none;
                        position: absolute;
                        top: 20px;
                        width: 1px;
                    }
                    .fx-form-navigation-bar .x-tab.horizontal-tab .form-nav-tab [data-tab-id="data"],
                    .fx-form-navigation-bar .x-tab.horizontal-tab .form-nav-tab [data-tab-id="智能助手"] {
                        margin-left: 46px;
                        overflow: visible;
                    }
                    .fx-form-navigation-bar .x-tab.horizontal-tab .form-nav-tab [data-tab-id="数据工厂"] {
                        margin: 0 !important;
                    }
                    .fx-form-navigation-bar .x-tab.horizontal-tab .form-nav-tab [data-tab-id="数据工厂"]:after {
                        display: none !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }, 50);  // 50ms一次等加载出来
    }

    });

