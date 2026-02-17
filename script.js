/**
 * P3R: Moonlight Link - Core Engine v1.1
 * * 기능: SPA 라우팅, 슬래시 트랜지션, STATUS 차트 렌더링
 * * 작성일: 2026-02-18
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- [1] State & Data Management ---
    const state = {
        currentPage: null,
        isAnimating: false
    };

    // 각 섹션별 콘텐츠 (HTML 문자열)
    const CONTENT_MAP = {
        status: `
            <div class="p3r-status">
                <div class="p3r-status__profile">
                    <div class="p3r-status__name">
                        <span class="label">NAME</span>
                        <h1 class="value">MAKOTO <span class="sub">YUKI</span></h1>
                    </div>
                    <div class="p3r-status__details">
                        <div class="stat-row">
                            <span class="label">LV</span>
                            <span class="value big">99</span>
                        </div>
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
            <div class="p3r-section" data-type="calendar">
                <h2 class="p3r-section__title">CALENDAR</h2>
                <p class="p3r-section__desc">Moon Phase & Schedule (Coming Soon)</p>
            </div>
        `,
        commu: `
            <div class="p3r-section" data-type="commu">
                <h2 class="p3r-section__title">SOCIAL LINK</h2>
                <p class="p3r-section__desc">Arcana & Bonds (Coming Soon)</p>
            </div>
        `,
        equip: `
            <div class="p3r-section" data-type="equip">
                <h2 class="p3r-section__title">EQUIPMENT</h2>
                <p class="p3r-section__desc">Weapon & Armor (Coming Soon)</p>
            </div>
        `,
        skill: `
            <div class="p3r-section" data-type="skill">
                <h2 class="p3r-section__title">SKILL LIST</h2>
                <p class="p3r-section__desc">Persona Skills (Coming Soon)</p>
            </div>
        `
    };

    // --- [2] DOM Elements ---
    const ui = {
        navItems: document.querySelectorAll('.p3r-nav__item'),
        contentArea: document.getElementById('app-content'),
        slashFx: document.querySelector('.p3r-fx__slash'),
        dateDisplay: document.querySelector('.p3r-hud__date')
    };

    // --- [3] Core Functions (Logic) ---

    /**
     * 페이지 전환 메인 함수
     */
    const navigate = (targetId) => {
        if (state.currentPage === targetId || state.isAnimating) return;
        
        if (!CONTENT_MAP[targetId]) {
            console.warn(`Unknown target: ${targetId}, redirecting to Status.`);
            targetId = 'status';
        }

        startTransition(targetId);
    };

    /**
     * 슬래시 트랜지션 및 콘텐츠 교체
     */
    const startTransition = (targetId) => {
        state.isAnimating = true;

        // 1. 슬래시 애니메이션 시작
        ui.slashFx.classList.add('is-active');

        // 2. 화면이 덮이는 시점(0.3s)에 콘텐츠 교체
        setTimeout(() => {
            renderContent(targetId);
            updateNavState(targetId);
            
            state.currentPage = targetId;
            
            if (window.location.hash !== `#${targetId}`) {
                history.pushState(null, null, `#${targetId}`);
            }

        }, 300); 

        // 3. 애니메이션 종료
        setTimeout(() => {
            ui.slashFx.classList.remove('is-active');
            state.isAnimating = false;
        }, 700);
    };

    /**
     * 콘텐츠 렌더링 및 페이지별 특수 로직 실행
     */
    const renderContent = (pageId) => {
        // HTML 주입
        ui.contentArea.innerHTML = CONTENT_MAP[pageId];
        
        // 페이드인 효과 리셋
        ui.contentArea.classList.remove('fade-in');
        void ui.contentArea.offsetWidth; // 리플로우 강제
        ui.contentArea.classList.add('fade-in');

        // [페이지별 특수 로직]
        if (pageId === 'status') {
            // 약간의 딜레이 후 차트 그리기 (DOM 렌더링 확보 및 애니메이션 효과)
            setTimeout(drawChart, 100);
        }
    };

    /**
     * STATUS 화면: 육각형 차트 그리기
     */
    const drawChart = () => {
        const polygon = document.getElementById('stat-polygon');
        if (!polygon) return;

        // 능력치 설정 (0 ~ 100)
        // 순서: Top, Top-Right, Bottom-Right, Bottom, Bottom-Left, Top-Left
        const stats = [90, 70, 80, 60, 85, 75];

        const centerX = 100;
        const centerY = 100;
        const maxRadius = 80;

        // 좌표 계산
        const points = stats.map((val, i) => {
            const angle = (Math.PI / 3) * i - (Math.PI / 2); // 12시 방향부터 시작
            const radius = (val / 100) * maxRadius;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');

        // SVG 속성 업데이트 (CSS transition에 의해 애니메이션됨)
        polygon.setAttribute('points', points);
    };

    /**
     * 내비게이션 스타일 업데이트
     */
    const updateNavState = (activeId) => {
        ui.navItems.forEach(item => {
            const target = item.dataset.target;
            if (target === activeId) {
                item.classList.add('p3r-nav__item--active');
            } else {
                item.classList.remove('p3r-nav__item--active');
            }
        });
    };

    /**
     * 날짜 초기화
     */
    const initDate = () => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()} / ${String(today.getMonth() + 1).padStart(2, '0')} / ${String(today.getDate()).padStart(2, '0')}`;
        ui.dateDisplay.textContent = formattedDate;
    };

    // --- [4] Event Listeners ---

    ui.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const target = e.target.dataset.target;
            navigate(target);
        });
    });

    window.addEventListener('popstate', () => {
        const target = window.location.hash.replace('#', '') || 'status';
        startTransition(target);
    });

    // --- [5] Initialization ---
    initDate();
    const initialTarget = window.location.hash.replace('#', '') || 'status';
    navigate(initialTarget);
});
