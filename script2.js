



    chrome.storage.sync.get({
        openRight: true,
        openDoubleClick: true
    }, function(settings) {

        function findAncestor(el, className) {
            while (el && el !== document) {
                if (el.classList && el.classList.contains(className)) {
                    return el;
                }
                el = el.parentNode;
            }
            return null;
        }
    

        function openRight(event) {
            let treeNodeDiv = findAncestor(event.target, 'tree-node');
    
            if (treeNodeDiv) {
                let aTag = treeNodeDiv.querySelector('a.fx-entry-node');
                if (aTag && aTag.getAttribute('href')) {
                    let originalHref = aTag.getAttribute('href');
                    let newHref = 'https://www.jiandaoyun.com' + originalHref + '#/data';
                    window.open(newHref, '_blank');
                    // 阻止默认事件
                    event.preventDefault();
                }
            }
        }

    

        function openDoubleClick(event) {
            let treeNodeDiv = findAncestor(event.target, 'tree-node');
    
            if (treeNodeDiv) {
                let aTag = treeNodeDiv.querySelector('a.fx-entry-node');
                if (aTag && aTag.getAttribute('href')) {
                    let originalHref = aTag.getAttribute('href');
                    let newHref = 'https://www.jiandaoyun.com' + originalHref + '#/edit';
                    window.open(newHref, '_blank');
                }
            }
        }
    
        if (settings.openRight) {
        document.addEventListener('contextmenu', openRight);}
        if (settings.openDoubleClick) {
        document.addEventListener('dblclick', openDoubleClick);}
    


    });

