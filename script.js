/**
 * P3R: Moonlight Link - Integrated Script v1.2
 * * 기능: SPA 엔진, 슬래시 트랜지션, STATUS 차트, CALENDAR 월령, 수중 FX
 * * 작성일: 2026-02-18
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- [1] State & Data Management ---
    const state = {
        currentPage: null,
        isAnimating: false
    };

    // 섹션별 콘텐츠 데이터
    const CONTENT_MAP = {
        status: `
            <div class="p3r-status">
                <div class="p3r-status__profile">
                    <div class="p3r-status__name">
                        <span class="label">NAME</span>
                        <h1 class="value">MAKOTO <span class="sub">YUKI</span></h1>
                    </div>
                    <div class="p3r-status__details">
                        <div class="stat-row"><span class="label">LV</span><span class="value big">99</span></div>
                        <div class="stat-row">
                            <span class="label">HP</span>
                            <div class="bar-container"><div class="bar-fill" style="width: 100%"></div></div>
                            <span class="value">999</span>
                        </div>
                        <div class="stat-row">
                            <span class="label">SP</span>
                            <div class="bar-container"><div class="bar-fill" style="width: 85%"></div></div>
                            <span class="value">482</span>
                        </div>
                    </div>
                </div>
                <div class="p3r-status__chart-wrapper">
                    <svg class="p3r-chart" viewBox="0 0 200 200">
                        <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" class="chart-bg"/>
                        <polygon points="100,40 152,70 152,130 100,160 48,130 48,70" class="chart-bg"/>
                        <polygon points="100,60 135,80 135,120 100,140 65,120 65,80" class="chart-bg"/>
                        <polygon id="stat-polygon" points="100,100 100,100 100,100 100,100 100,100 100,100" class="chart-data"/>
                        <text x="100" y="15" class="chart-label">ACADEMICS</text>
                        <text x="180" y="60" class="chart-label">CHARM</text>
                        <text x="180" y="150" class="chart-label">COURAGE</text>
                        <text x="100" y="195" class="chart-label">SKILL</text>
                        <text x="20" y="150" class="chart-label">LUCK</text>
                        <text x="20" y="60" class="chart-label">AGILITY</text>
                    </svg>
                </div>
            </div>
        `,
        calendar: `
            <div class="p3r-calendar">
                <div class="p3r-calendar__moon-section">
                    <div class="moon-container">
                        <div class="moon-shadow" id="moon-shadow"></div>
                    </div>
                    <h2 class="moon-phase-text" id="moon-text">LOADING...</h2>
                    <p class="moon-sub">The Dark Hour approaches...</p>
                </div>
                <div class="p3r-calendar__schedule">
                    <h3 class="schedule-title">UPCOMING EVENTS</h3>
                    <ul class="schedule-list">
                        <li class="schedule-item active"><span class="date">04 / 09</span><span class="event">Transfer Student</span></li>
                        <li class="schedule-item"><span class="date">05 / 09</span><span class="event">Full Moon Operation</span></li>
                        <li class="schedule-item"><span class="date">06 / 08</span><span class="event">Tartarus Exploration</span></li>
                    </ul>
                </div>
            </div>
        `,
        commu: `<div class="p3r-section"><h2 class="p3r-section__title">COMMU</h2><p class="p3r-section__desc">Social Links Coming Soon...</p></div>`,
        equip: `<div class="p3r-section"><h2 class="p3r-section__title">EQUIP</h2><p class="p3r-section__desc">Equipment Coming Soon...</p></div>`,
        skill: `<div class="p3r-section"><h2 class="p3r-section__title">SKILL</h2><p class="p3r-section__desc">Skill List Coming Soon...</p></div>`
    };

    // --- [2] DOM Elements ---
    const ui = {
        navItems: document.querySelectorAll('.p3r-nav__item'),
        contentArea: document.getElementById('app-content'),
        slashFx: document.querySelector('.p3r-fx__slash'),
        dateDisplay: document.querySelector('.p3r-hud__date'),
        particleContainer: document.querySelector('.p3r-stage__particles')
    };

    // --- [3] Core Functions ---

    // 페이지 이동 함수
    const navigate = (targetId) => {
        if (state.currentPage === targetId || state.isAnimating) return;
        if (!CONTENT_MAP[targetId]) targetId = 'status';
        startTransition(targetId);
    };

    // 슬래시 전환 애니메이션
    const startTransition = (targetId) => {
        state.isAnimating = true;
        ui.slashFx.classList.add('is-active');

        setTimeout(() => {
            renderContent(targetId);
            updateNavState(targetId);
            state.currentPage = targetId;
            if (window.location.hash !== `#${targetId}`) {
                history.pushState(null, null, `#${targetId}`);
            }
        }, 300); 

        setTimeout(() => {
            ui.slashFx.classList.remove('is-active');
            state.isAnimating = false;
        }, 700);
    };

    // 콘텐츠 렌더링 및 페이지별 로직 트리거
    const renderContent = (pageId) => {
        ui.contentArea.innerHTML = CONTENT_MAP[pageId];
        ui.contentArea.classList.remove('fade-in');
        void ui.contentArea.offsetWidth;
        ui.contentArea.classList.add('fade-in');

        // 페이지별 특수 함수 실행
        if (pageId === 'status') setTimeout(drawChart, 100);
        if (pageId === 'calendar') setTimeout(updateMoonPhase, 100);
    };

    // STATUS: 육각형 차트 그리기
    const drawChart = () => {
        const polygon = document.getElementById('stat-polygon');
        if (!polygon) return;
        const stats = [90, 75, 80, 65, 85, 70]; // 샘플 데이터
        const points = stats.map((val, i) => {
            const angle = (Math.PI / 3) * i - (Math.PI / 2);
            const radius = (val / 100) * 80;
            return `${100 + radius * Math.cos(angle)},${100 + radius * Math.sin(angle)}`;
        }).join(' ');
        polygon.setAttribute('points', points);
    };

    // CALENDAR: 월령 업데이트
    const updateMoonPhase = () => {
        const shadow = document.getElementById('moon-shadow');
        const text = document.getElementById('moon-text');
        if (!shadow) return;

        const day = new Date().getDate();
        const phase = (day % 30) / 30; // 0.0 ~ 1.0 근사치
        const shadowPos = (phase * 200) - 100;
        
        shadow.style.transform = `translateX(${shadowPos}%)`;
        if (phase < 0.1 || phase > 0.9) text.textContent = "NEW MOON";
        else if (phase > 0.4 && phase < 0.6) text.textContent = "FULL MOON";
        else text.textContent = "WAXING MOON";
    };

    // 전역 FX: 수중 기포 생성
    const createBubbles = () => {
        if (!ui.particleContainer) return;
        for (let i = 0; i < 20; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            const size = Math.random() * 10 + 5 + 'px';
            bubble.style.width = size;
            bubble.style.height = size;
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.animationDelay = Math.random() * 10 + 's';
            bubble.style.animationDuration = Math.random() * 10 + 10 + 's';
            ui.particleContainer.appendChild(bubble);
        }
    };

    // 내비게이션 상태 업데이트
    const updateNavState = (activeId) => {
        ui.navItems.forEach(item => {
            item.classList.toggle('p3r-nav__item--active', item.dataset.target === activeId);
        });
    };

    // HUD: 날짜 표시
    const initDate = () => {
        const now = new Date();
        ui.dateDisplay.textContent = `${now.getFullYear()} / ${String(now.getMonth() + 1).padStart(2, '0')} / ${String(now.getDate()).padStart(2, '0')}`;
    };

    // --- [4] Event Listeners & Init ---

    ui.navItems.forEach(item => {
        item.addEventListener('click', (e) => navigate(e.target.dataset.target));
    });

    window.addEventListener('popstate', () => {
        const target = window.location.hash.replace('#', '') || 'status';
        startTransition(target);
    });

    initDate();
    createBubbles();
    navigate(window.location.hash.replace('#', '') || 'status');
});
