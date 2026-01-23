document.addEventListener("DOMContentLoaded", function() {
    
    // 1. 手機漢堡選單切換
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
            
            // Icon 切換
            const icon = menuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                setTimeout(() => { icon.classList.remove('fa-bars'); icon.classList.add('fa-times'); }, 100);
            } else {
                setTimeout(() => { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }, 100);
            }
        });
    }

    // 2. [新增] 手機版下拉選單手風琴效果
    const dropdowns = document.querySelectorAll('.dropdown > a');
    const subDropdowns = document.querySelectorAll('.submenu-toggle');

    // 第一層下拉 (首頁、產品服務)
    dropdowns.forEach(link => {
        link.addEventListener('click', function(e) {
            // 只有在手機版 (螢幕小於 900px) 且有子選單時才攔截點擊
            if (window.innerWidth <= 900) {
                const nextEl = this.nextElementSibling;
                if (nextEl && nextEl.classList.contains('dropdown-menu')) {
                    e.preventDefault(); // 阻止跳轉
                    nextEl.classList.toggle('show-mobile'); // 切換顯示
                    
                    // 旋轉箭頭
                    const icon = this.querySelector('.toggle-icon');
                    if (icon) icon.classList.toggle('rotate');
                }
            }
        });
    });

    // 第二層下拉 (線上點餐)
    subDropdowns.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 900) {
                const nextEl = this.nextElementSibling;
                if (nextEl && nextEl.classList.contains('submenu')) {
                    e.preventDefault();
                    nextEl.classList.toggle('show-mobile');
                    
                    const icon = this.querySelector('.arrow-right');
                    if (icon) {
                        // 簡單的箭頭轉向
                        icon.style.transform = nextEl.classList.contains('show-mobile') ? 'rotate(90deg)' : 'rotate(0deg)';
                    }
                }
            }
        });
    });

    // 3. 品牌歷程捲動特效
    const scrollContainer = document.querySelector('.timeline-scroll-box');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (scrollContainer && timelineItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, { root: scrollContainer, threshold: 0.2 });

        timelineItems.forEach(item => observer.observe(item));
    }

    // 4. FAQ 相關功能
    const searchInput = document.getElementById('faq-search-input');
    if (searchInput) {
        window.openTab = function(evt, categoryName) {
            searchInput.value = ''; 
            filterFAQ('');
            let x = document.getElementsByClassName("faq-category");
            for (let i = 0; i < x.length; i++) { x[i].style.display = "none"; x[i].classList.remove("active"); }
            let tablinks = document.getElementsByClassName("tab-btn");
            for (let i = 0; i < tablinks.length; i++) { tablinks[i].className = tablinks[i].className.replace(" active", ""); }
            document.getElementById(categoryName).style.display = "block";
            setTimeout(() => { document.getElementById(categoryName).classList.add("active"); }, 10);
            if (evt) evt.currentTarget.className += " active";
        };

        const accordions = document.querySelectorAll('.accordion-item');
        accordions.forEach(item => {
            item.querySelector('.accordion-header').addEventListener('click', () => {
                accordions.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.accordion-body').style.maxHeight = null;
                    }
                });
                item.classList.toggle('active');
                let body = item.querySelector('.accordion-body');
                if (item.classList.contains('active')) body.style.maxHeight = body.scrollHeight + "px";
                else body.style.maxHeight = null;
            });
        });

        searchInput.addEventListener('input', (e) => { filterFAQ(e.target.value.toLowerCase().trim()); });

        window.filterFAQ = function(term) {
            const allCategories = document.querySelectorAll('.faq-category');
            const allItems = document.querySelectorAll('.accordion-item');
            if (term === "") {
                allCategories.forEach(cat => { cat.style.display = 'none'; cat.classList.remove('active'); });
                allItems.forEach(item => item.style.display = 'block');
                let activeBtn = document.querySelector('.tab-btn.active');
                if(activeBtn) {
                    let catId = activeBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
                    document.getElementById(catId).style.display = 'block';
                    setTimeout(() => document.getElementById(catId).classList.add('active'), 10);
                }
                return;
            }
            allCategories.forEach(cat => { cat.style.display = 'block'; cat.classList.add('active'); });
            allItems.forEach(item => {
                let q = item.querySelector('.accordion-header').innerText.toLowerCase();
                let a = item.querySelector('.accordion-body').innerText.toLowerCase();
                item.style.display = (q.includes(term) || a.includes(term)) ? 'block' : 'none';
            });
            allCategories.forEach(cat => {
                if (cat.querySelectorAll('.accordion-item[style="display: block;"]').length === 0) 
                    cat.style.display = 'none';
                else 
                    cat.style.display = 'block';
            });
        };
    }
});