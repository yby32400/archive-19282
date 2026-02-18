/**
 * P3R: Moonlight Link - Core Engine v1.0
 * * 기능: SPA 라우팅, 슬래시 트랜지션 제어, 상태 관리
 * 작성일: 2026-02-18
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- [1] State & Data Management ---
    const state = {
        currentPage: null,
        isAnimating: false
    };

    // 각 섹션별 더미 콘텐츠 (추후 별도 파일이나 모듈로 분리 가능)
    const CONTENT_MAP = {
        status: `
            <div class="p3r-section" data-type="status">
                <h2 class="p3r-section__title">S.E.E.S STATUS</h2>
                <p class="p3r-section__desc">사용자의 페르소나 능력치 및 성향 그래프</p>
                </div>
        `,
        calendar: `
            <div class="p3r-section" data-type="calendar">
                <h2 class="p3r-section__title">CALENDAR</h2>
                <p class="p3r-section__desc">중요 일정 및 월령(Moon Phase)</p>
            </div>
        `,
        commu: `
            <div class="p3r-section" data-type="commu">
                <h2 class="p3r-section__title">SOCIAL LINK</h2>
                <p class="p3r-section__desc">아르카나 및 인연 리스트</p>
            </div>
        `,
        equip: `
            <div class="p3r-section" data-type="equip">
                <h2 class="p3r-section__title">EQUIPMENT</h2>
                <p class="p3r-section__desc">현재 장비 및 아이템</p>
            </div>
        `,
        skill: `
            <div class="p3r-section" data-type="skill">
                <h2 class="p3r-section__title">SKILL LIST</h2>
                <p class="p3r-section__desc">보유 스킬 및 키워드</p>
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

    // --- [3] Core Functions ---

    /**
     * 페이지 전환 메인 함수
     * @param {string} targetId - 이동할 페이지 ID (status, calendar 등)
     */
    const navigate = (targetId) => {
        // 이미 같은 페이지거나 애니메이션 중이면 무시
        if (state.currentPage === targetId || state.isAnimating) return;
        
        // 예외 처리: 존재하지 않는 페이지면 status로 리다이렉트
        if (!CONTENT_MAP[targetId]) {
            console.warn(`Unknown target: ${targetId}, redirecting to Status.`);
            targetId = 'status';
        }

        startTransition(targetId);
    };

    /**
     * 슬래시 트랜지션 및 콘텐츠 교체 로직
     * P3R의 날카로운 화면 전환 느낌을 구현
     */
    const startTransition = (targetId) => {
        state.isAnimating = true;

        // 1. 슬래시 애니메이션 시작 (화면 덮기)
        ui.slashFx.classList.add('is-active');

        // 2. 애니메이션 중간 지점(화면이 다 덮였을 때)에 콘텐츠 교체
        // CSS animation-duration: 0.6s 가정, 0.3s에 교체
        setTimeout(() => {
            renderContent(targetId);
            updateNavState(targetId);
            
            // 상태 업데이트
            state.currentPage = targetId;
            
            // 해시 업데이트 (히스토리 기록용, 무한루프 방지)
            if (window.location.hash !== `#${targetId}`) {
                history.pushState(null, null, `#${targetId}`);
            }

        }, 300); 

        // 3. 애니메이션 종료 후 클래스 제거 (화면 열기)
        setTimeout(() => {
            ui.slashFx.classList.remove('is-active');
            state.isAnimating = false;
        }, 700); // 0.6s + 여유시간
    };

    /**
     * 실제 HTML 콘텐츠 주입
     */
    const renderContent = (pageId) => {
        const html = CONTENT_MAP[pageId];
        ui.contentArea.innerHTML = html;
        
        // 콘텐츠 등장 애니메이션 효과를 위해 클래스 토글 (필요시 추가)
        ui.contentArea.classList.remove('fade-in');
        void ui.contentArea.offsetWidth; // 리플로우 강제
        ui.contentArea.classList.add('fade-in');
    };

    /**
     * 내비게이션 활성화 상태 변경
     */
    const updateNavState = (activeId) => {
        ui.navItems.forEach(item => {
            const target = item.dataset.target;
            if (target === activeId) {
                item.classList.add('p3r-nav__item--active');
                item.style.color = 'var(--p3r-cyan)'; // JS에서 직접 제어하거나 CSS 클래스로 위임
            } else {
                item.classList.remove('p3r-nav__item--active');
                item.style.color = ''; // 초기화
            }
        });
    };

    /**
     * 날짜 초기화 (현재 날짜 기준)
     */
    const initDate = () => {
        const today = new Date();
        // 포맷: 2026 / 02 / 18
        const formattedDate = `${today.getFullYear()} / ${String(today.getMonth() + 1).padStart(2, '0')} / ${String(today.getDate()).padStart(2, '0')}`;
        ui.dateDisplay.textContent = formattedDate;
    };

    // --- [4] Event Listeners ---

    // 내비게이션 클릭 이벤트
    ui.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const target = e.target.dataset.target;
            navigate(target);
        });
    });

    // 브라우저 뒤로가기/앞으로가기 감지
    window.addEventListener('popstate', () => {
        const target = window.location.hash.replace('#', '') || 'status';
        // 직접 render를 부르지 않고 navigate를 통해 애니메이션 효과 유지
        // 단, 무한 루프 방지를 위해 hash 변경 로직은 navigate 안에서 체크
        startTransition(target);
    });

    // --- [5] Initialization ---
    initDate();
    
    // 초기 로드 시 해시 확인 또는 기본값 설정
    const initialTarget = window.location.hash.replace('#', '') || 'status';
    navigate(initialTarget);
});
