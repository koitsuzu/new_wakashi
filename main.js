document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Animations
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.5 } });

    heroTl.to(".reveal-text", {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        delay: 0.5
    });

    // Hero Slider Logic
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        if (slides[index]) slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
    }

    function nextSlide() {
        if (slides.length > 0) {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
    }

    if (slides.length > 0) {
        setInterval(nextSlide, 5000);
        dots.forEach((dot, index) => {
            dot.onclick = () => {
                currentSlide = index;
                showSlide(currentSlide);
            };
        });
    }

    // --- Value Foods Style Animation System ---
    const initStaggeredAnimations = () => {
        // 分別處理不同的區塊，給予不同的觸發點
        const config = [
            { selector: '.product-grid', start: "top 85%" },
            { selector: '.awards-list', start: "top 80%" },
            { selector: '.faq-grid', start: "top 75%" }, // FAQ 稍晚一點觸發
            { selector: '.puzzle-clues', start: "top 85%" },
            { selector: '.mini-product-list', start: "top 90%" }
        ];

        config.forEach(cfg => {
            const containers = document.querySelectorAll(cfg.selector);
            containers.forEach(grid => {
                gsap.fromTo(grid.children, 
                    { y: 30, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: grid,
                            start: cfg.start, // 使用獨立的啟動點
                            toggleActions: "play none none none"
                        },
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.1,
                        ease: "power2.out"
                    }
                );
            });
        });
    };

    const initImageReveals = () => {
        const revealTargets = document.querySelectorAll('.editorial-image img, .about-image img, .award-logo, .hero-carousel img');
        revealTargets.forEach(img => {
            gsap.fromTo(img, { scale: 1.15, filter: "blur(5px)" }, {
                scrollTrigger: { trigger: img, start: "top 95%" },
                scale: 1, filter: "blur(0px)", duration: 2, ease: "power2.out"
            });
        });
    };

    // 3. 通用淡入動畫 (確保所有獨立 fade-up 元件皆能顯示)
    const initFadeUpAnimations = () => {
        const fadeUps = document.querySelectorAll('.fade-up');
        fadeUps.forEach(el => {
            // 檢查該元素是否已經在被 Stagger 處理的容器中
            const isInsideGrid = el.closest('.product-grid, .awards-list, .faq-grid, .puzzle-clues, .mini-product-list');
            
            if (!isInsideGrid) {
                gsap.fromTo(el, 
                    { opacity: 0, y: 20 },
                    {
                        scrollTrigger: { 
                            trigger: el, 
                            start: "top 88%" // 更精確的獨立元件觸發點
                        },
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power2.out"
                    }
                );
            }
        });
    };

    initStaggeredAnimations();
    initImageReveals();
    initFadeUpAnimations(); // 執行修復後的通用動畫

    // Glass Nav background change on scroll
    const nav = document.querySelector('.glass-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.width = '95%';
                nav.style.borderRadius = '20px';
                nav.style.top = '10px';
                nav.style.background = 'rgba(255, 255, 255, 0.9)';
            } else {
                nav.style.width = '90%';
                nav.style.borderRadius = '50px';
                nav.style.top = '20px';
                nav.style.background = 'rgba(249, 245, 240, 0.8)';
            }
        });
    }

    // Product Card Micro-interactions (GSAP version for smoothness)
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                boxShadow: "0 30px 60px rgba(60, 42, 33, 0.1)",
                duration: 0.4,
                ease: "power2.out"
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.05)",
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });

    // Sakura Petal Animation (Bonus atmospheric effect)
    // Create petals randomly
    function createPetal() {
        if (document.hidden) return; // Don't run if tab is not active

        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.top = '-20px';
        petal.style.position = 'fixed';
        petal.style.zIndex = '999';
        petal.style.pointerEvents = 'none';
        petal.style.width = '15px';
        petal.style.height = '15px';
        petal.style.background = 'url("image/sakura_petal_transparent.png") no-repeat center center / contain';

        document.body.appendChild(petal);

        gsap.to(petal, {
            y: window.innerHeight + 100,
            x: '+=100',
            rotation: 360,
            duration: 5 + Math.random() * 5,
            ease: "none",
            onComplete: () => {
                petal.remove();
            }
        });
    }

    // Occasionally create a petal for atmosphere
    setInterval(createPetal, 3000);

    // Puzzle Game Logic
    const puzzleItems = JSON.parse(localStorage.getItem('wakashi_puzzle')) || [false, false, false];

    // --- Puzzle Game Logic (Fragment System) ---
    const updatePuzzleUI = () => {
        const fragments = [
            "【職人之心】獲得 1/3 碎片：堅持傳統手作...",
            "【季節之靈】獲得 2/3 碎片：順應節氣流轉...",
            "【榮耀之光】獲得 3/3 碎片：贏得國際讚譽..."
        ];

        puzzleItems.forEach((found, index) => {
            const el = document.getElementById(`clue-${index + 1}`);
            if (found && el) {
                el.classList.add('found');
                el.querySelector('.status').innerText = '已解鎖';
                // 顯示故事碎片而非序號
                el.querySelector('p').innerHTML = `<span style="font-style: italic;">${fragments[index]}</span>`;
            }
        });

        // 檢查是否全數找齊
        if (puzzleItems.every(v => v === true)) {
            const puzzleBox = document.querySelector('.puzzle-box');
            if (puzzleBox) {
                puzzleBox.style.border = '2px solid var(--accent-color)';
                puzzleBox.style.boxShadow = '0 0 50px rgba(166, 141, 125, 0.3)';
            }
            
            // 在第三個區塊顯示唯一大獎序號
            const finalClue = document.getElementById('clue-3');
            if (finalClue) {
                finalClue.querySelector('p').innerHTML = `
                    <div style="margin-top:10px;">
                        <strong style="color:var(--accent-color); font-size:1.4rem;">終極大獎：WAKASHI-MASTER</strong>
                        <p style="font-size:0.8rem; margin-top:5px;">( 結帳滿 500 打 9 折 )</p>
                    </div>
                `;
            }

            // 彈出成功 Modal
            const modal = document.getElementById('reward-modal');
            const storedPromo = localStorage.getItem('wakashi_promo');
            if (modal && !storedPromo) {
                localStorage.setItem('wakashi_promo', 'WAKASHI-MASTER');
                document.getElementById('promo-code').innerText = 'WAKASHI-MASTER';
                modal.style.display = 'block';
            }
        }
    };

    updatePuzzleUI();

    // Close Modal Logic
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.onclick = () => document.getElementById('reward-modal').style.display = 'none';
    }

    // Function to find a piece
    window.findPiece = (index) => {
        puzzleItems[index] = true;
        localStorage.setItem('wakashi_puzzle', JSON.stringify(puzzleItems));
        alert('你發現了一枚神祕的「饈菓子」花飾！');
        window.location.reload();
    };

    // Auto-inject hidden pieces based on current page
    const path = window.location.pathname;
    if (path.includes('about.html') && !puzzleItems[0]) {
        createHiddenPiece(0, '85%', '15%');
    } else if (path.includes('products.html') && !puzzleItems[1]) {
        createHiddenPiece(1, '92%', '80%');
    } else if (path.includes('awards.html') && !puzzleItems[2]) {
        // 第三個位置調整到更顯眼的 Footer 上方
        createHiddenPiece(2, '88%', '50%');
    }

    function createHiddenPiece(index, top, left) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.top = top;
        piece.style.left = left;
        piece.onclick = () => window.findPiece(index);
        document.body.appendChild(piece);

        // 監聽滾動，只有快到底部時才顯示
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (scrollPercent > 0.85) {
                piece.classList.add('visible');
            }
        });
    }

    // --- Product Data Management ---
    const productData = [
        {
            category: "大福系列",
            items: [
                { id: 101, name: "紅豆生大福", desc: "選用十勝紅豆，軟糯 Q 彈的經典滋味", img: "image/d1.jpg" },
                { id: 102, name: "草莓大福", desc: "旬之果物與綿密豆沙的完美邂逅", img: "image/d2.jpg" },
                { id: 103, name: "艾草大福", desc: "帶有清淡草本香氣，古法手搗外皮", img: "image/d3.jpg" },
                { id: 104, name: "豆乳大福", desc: "質地輕盈如雪，入口即化的溫潤感", img: "image/d4.jpg" }
            ]
        },
        {
            category: "糰子系列",
            items: [
                { id: 201, name: "三色花見糰子", desc: "櫻色、白色、綠色，象徵春季的繽紛", img: "image/d7.jpg" },
                { id: 202, name: "御手洗糰子", desc: "裹上鹹甜交織的秘製醬油膏", img: "image/d8.jpg" },
                { id: 203, name: "醬燒黑芝麻糰子", desc: "濃郁芝麻香氣，微焦的炭火風味", img: "image/d9.jpg" },
                { id: 204, name: "抹茶紅豆糰子", desc: "選用宇治抹茶製作，甘甜適中", img: "image/d10.jpg" }
            ]
        },
        {
            category: "和菓子系列",
            items: [
                { id: 301, name: "季節生菓子", desc: "職人手工捏製，凝聚季節美景的藝術品", img: "image/p1.jpg" },
                { id: 302, name: "旬之生菓子", desc: "選用當季節氣食材，呈現最鮮活的滋味", img: "image/p2.jpg" },
                { id: 303, name: "饈之精選菓子", desc: "品牌的經典代表作，極致的甜味平衡", img: "image/p3.jpg" },
                { id: 304, name: "手作乾菓子", desc: "酥脆輕盈，如雪花般的化口感受", img: "image/p4.jpg" },
                { id: 305, name: "和風最中", desc: "經典糯米外皮與綿密紅豆餡", img: "image/p5.jpg" },
                { id: 306, name: "御茶合點", desc: "專為茶道設計，襯托抹茶回甘的驚喜", img: "image/p6.jpg" }
            ]
        },
        {
            category: "羊羹系列",
            items: [
                { id: 401, name: "琥珀羊羹", desc: "晶瑩剔透的質感，濃郁豆香餘韻悠長", img: "image/y1.jpg" },
                { id: 402, name: "經典練羊羹", desc: "遵循古法熬製，入口即化的綿密口感", img: "image/y2.jpg" },
                { id: 403, name: "小倉紅豆羊羹", desc: "飽含顆粒感，層次豐富的傳統選擇", img: "image/y3.jpg" },
                { id: 404, name: "抹茶羊羹", desc: "濃郁茶香與豆沙的和諧共奏", img: "image/y4.jpg" },
                { id: 405, name: "栗子羊羹", desc: "大粒栗子點綴，口感扎實滿足", img: "image/y5.jpg" }
            ]
        },
        {
            category: "饈之禮盒系列",
            items: [
                { id: 501, name: "四季之韻禮盒", desc: "集合四季精華，最完整的贈禮選擇", img: "image/w1.jpg" },
                { id: 502, name: "職人手作木盒", desc: "原木質感包裝，展現極致品味", img: "image/w2.jpg" },
                { id: 503, name: "節氣限定禮籃", desc: "依當令食材打造，限時限量的感動", img: "image/w5.jpg" },
                { id: 504, name: "商業致禮盒", desc: "專為正式場合設計，穩重而不失禮數", img: "image/w3.jpg" },
                { id: 505, name: "御茶道特選組", desc: "適合搭配各種名茶的高級組合", img: "image/w4.jpg" },
                { id: 506, name: "品牌紀念典藏", desc: "網羅歷年獲獎之作的頂級盛宴", img: "image/w6.jpg" }
            ]
        }
    ];

    function renderProducts() {
        const container = document.getElementById('products-dynamic-container');
        if (!container) return;

        container.innerHTML = productData.map(group => `
            <div class="product-group" style="margin-bottom: 80px;">
                <div class="section-header fade-up">
                    <span class="subtitle">COLLECTIONS</span>
                    <h2>${group.category}</h2>
                </div>
                <div class="product-grid">
                    ${group.items.map(item => `
                        <div class="product-card fade-up" data-img="${item.img}">
                            <div class="product-img">
                                <img src="${item.img}" alt="${item.name}">
                            </div>
                            <h3>${item.name}</h3>
                            <p>${item.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        initScrollAnimations();
        initModalTrigger();
    }

    function initScrollAnimations() {
        gsap.utils.toArray('.fade-up').forEach((el, index) => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                },
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            });
        });
    }

    function initModalTrigger() {
        const cards = document.querySelectorAll('.product-card');
        const detailModal = document.getElementById('detail-modal');
        if (!detailModal) return;

        cards.forEach(card => {
            card.onclick = () => {
                const title = card.querySelector('h3').innerText;
                const desc = card.querySelector('p').innerText;
                const img = card.getAttribute('data-img');

                document.getElementById('modal-title').innerText = title;
                document.getElementById('modal-desc').innerText = desc;
                document.getElementById('modal-img').src = img;
                detailModal.style.display = 'block';
            };
        });

        const closeDetail = document.querySelector('.close-detail');
        if (closeDetail) {
            closeDetail.onclick = () => detailModal.style.display = 'none';
        }

        window.onclick = (event) => {
            if (event.target == detailModal) detailModal.style.display = 'none';
        };
    }

    // Start rendering
    renderProducts();

    // FAQ Toggle Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.onclick = () => {
            item.classList.toggle('active');
        };
    });
});
