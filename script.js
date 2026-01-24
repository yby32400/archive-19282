/* =======================================================
   ASE.LOG FINAL SCRIPT (Ver 11.0 - Repair & Polish)
   ======================================================= */

/* 1. 전역 변수 */
const playlist = [
    { title: "Track 1 - Persona Vibe", src: "images/music1.mp3", cover: "images/cover1.jpg" },
    { title: "Track 2 - Coding Mode", src: "images/music2.mp3", cover: "images/cover2.jpg" },
    { title: "Track 3 - Resignation", src: "images/music3.mp3", cover: "images/cover3.jpg" }
];
let currentSongIndex = 0;
let isPlaying = false;
let timerInterval;
const audio = document.getElementById('bgm');

/* 2. 초기화 (통합) */
window.onload = function() {
    // 날짜 계산
    calculateDday();
    calculateLoveDays();
    
    // 플레이어 초기화 (드래그 + 리스트 생성)
    const playerPopup = document.getElementById("retro-player-popup");
    if(playerPopup) {
        makeDraggable(playerPopup);
        renderPlaylist(); // 리스트 생성 실행
    }

    // 마우스 별 가루 효과 복구
    initSparkleEffect();

    // 시작 시 홈 화면 보이기
    goHome();
};

/* 3. 화면 전환 (페이드 효과 적용) */
const views = {
    home: document.getElementById('home-view'),
    post: document.getElementById('post-view'),
    guestbook: document.getElementById('comment-section')
};

/* (이 부분 붙여넣기) */
function switchView(targetId) {
    const target = views[targetId];
    // 현재 눈에 보이고 있는 화면을 찾음
    const current = Object.values(views).find(el => el && el.style.display !== 'none' && !el.classList.contains('hidden-view'));

    // 1. 새 화면을 켜는 내부 함수
    const showTarget = () => {
        // 모든 화면을 일단 안 보이게(display:none) 정리
        Object.values(views).forEach(el => {
            if(el) el.style.display = 'none';
        });

        if(target) {
            target.style.display = 'block'; // 공간 차지
            // 브라우저가 인식할 시간을 줌 (중요!)
            setTimeout(() => {
                target.classList.remove('hidden-view'); // 스르륵 나타남
            }, 50);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // 2. 실제 전환 로직 (순차 실행)
    if (current && current !== target) {
        // 현재 화면이 있으면 -> 먼저 투명하게 만듦 (Fade Out)
        current.classList.add('hidden-view');
        
        // 0.4초(CSS 애니메이션 시간) 기다렸다가 새 화면 킴
        setTimeout(showTarget, 400); 
    } else {
        // 처음 켜거나 현재 화면이 없으면 바로 킴
        showTarget();
    }
}

function goHome() { switchView('home'); }
function openGuestbook() { switchView('guestbook'); }

/* script.js 수정 - loadPost 함수 교체 */

function loadPost(filename) {
    const contentBox = document.getElementById('markdown-content');
    
    // 1. 일단 내용을 흐리게 숨김 (Fade Out)
    contentBox.classList.add('content-fade-out');

    // 2. 0.3초 뒤(숨겨진 뒤)에 데이터를 가져옴
    setTimeout(() => {
        fetch(filename)
            .then(res => res.ok ? res.text() : "File not found")
            .then(text => {
                // 내용 교체
                contentBox.innerHTML = marked.parse(text);
                
                // 스크롤 맨 위로 올리기
                window.scrollTo({ top: 0, behavior: 'auto' });

                // 3. 다시 부드럽게 보여줌 (Fade In)
                // 브라우저가 내용을 그릴 시간을 아주 잠깐 줌
                setTimeout(() => {
                    contentBox.classList.remove('content-fade-out');
                }, 50);

                switchView('post'); 
            })
            .catch(err => {
                contentBox.innerHTML = "<h3>⚠️ Error loading post.</h3>";
                contentBox.classList.remove('content-fade-out');
            });
    }, 300); // CSS transition 시간(0.3s)과 맞춤
}

/* 4. 플레이어 로직 (리스트 포함) */
function renderPlaylist() {
    const container = document.getElementById('playlist-container');
    container.innerHTML = ''; 

    playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        if(index === currentSongIndex) item.classList.add('active');
        item.innerText = `${index + 1}. ${track.title}`;
        
        item.onclick = () => {
            currentSongIndex = index;
            changeTrack();
            playRetro(); // 클릭 시 바로 재생
        };
        container.appendChild(item);
    });
}

function toggleMusic() { 
    const popup = document.getElementById('retro-player-popup');
    if(popup) popup.style.display = 'flex'; // flex로 변경하여 정렬 유지
    updatePlayerDisplay();
}
function closePlayer() { document.getElementById('retro-player-popup').style.display = 'none'; }

function playRetro() {
    if(!audio) return;
    if (!audio.src || audio.src === "") audio.src = playlist[currentSongIndex].src;
    
    audio.play().then(() => { 
        isPlaying = true; updatePlayerDisplay(); startTimer(); renderPlaylist();
    }).catch(console.error);
}
function pauseRetro() { if(audio) audio.pause(); isPlaying = false; updatePlayerDisplay(); stopTimer(); }
function stopRetro() { if(audio) { audio.pause(); audio.currentTime = 0; } isPlaying = false; updatePlayerDisplay(); stopTimer(); }
function nextSong() { currentSongIndex = (currentSongIndex + 1) % playlist.length; changeTrack(); }
function prevSong() { currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length; changeTrack(); }

function changeTrack() { 
    if(audio) audio.src = playlist[currentSongIndex].src; 
    if (isPlaying) playRetro(); else updatePlayerDisplay();
    renderPlaylist();
}

function updatePlayerDisplay() {
    const marquee = document.getElementById('player-track-title');
    const screenBg = document.getElementById('player-screen-bg');
    
    if(marquee) marquee.innerText = (isPlaying ? "[PLAYING] ▶ " : "[STOPPED] ⏹ ") + playlist[currentSongIndex].title;
    if(screenBg) screenBg.style.backgroundImage = `url('${playlist[currentSongIndex].cover}')`;
}

function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
        if(!audio) return;
        const t = audio.currentTime;
        const timeDisplay = document.getElementById('play-time');
        if(timeDisplay) {
            timeDisplay.innerText = `${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;
        }
    }, 1000);
}
function stopTimer() { clearInterval(timerInterval); }

/* 5. 날짜 계산 */
function calculateDday() {
    const ddayElement = document.getElementById('d-day-count');
    if (!ddayElement) return;
    const target = new Date("2026-03-14"); target.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    ddayElement.innerText = diff > 0 ? "D-" + diff : "D-Day!";
}

function calculateLoveDays() {
    const dateTaemin = new Date("2015-05-25"); 
    const dateSoo = new Date("2024-01-01");
    const setDays = (start, id) => {
        const el = document.getElementById(id);
        if(!el) return;
        start.setHours(0,0,0,0);
        const today = new Date(); today.setHours(0,0,0,0);
        el.innerText = "+" + (Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1);
    };
    setDays(dateTaemin, 'love-day-1');
    setDays(dateSoo, 'love-day-2');
}

/* 6. 별 가루 효과 (복구됨!) */
function initSparkleEffect() {
    document.addEventListener('mousemove', function(e) {
        if(Math.random() > 0.5) return; 
        const star = document.createElement('span');
        star.classList.add('star-trail');
        star.innerText = '✦'; 
        star.style.left = e.clientX + 'px';
        star.style.top = e.clientY + 'px';
        star.style.fontSize = (Math.random() * 20 + 10) + 'px';
        const colors = ['#FF9A9E', '#A18CD1', '#FECFEF', '#FFFFFF'];
        star.style.color = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 800);
    });
}

/* script.js 하단 makeDraggable 함수 교체 */

function makeDraggable(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    // 파란색 헤더 부분(ID: player-drag-handle)을 잡아야 움직임
    const handle = document.getElementById("player-drag-handle");
    
    if (handle) {
        handle.onmousedown = dragMouseDown;
        handle.style.cursor = "grab"; // 마우스 올리면 손바닥 모양
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        
        // 1. 현재 마우스 위치 가져오기
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // 2. [중요] 드래그 시작 시 CSS의 중앙 정렬(transform)을 해제하고 현재 위치로 고정
        const rect = elmnt.getBoundingClientRect();
        elmnt.style.left = rect.left + 'px';
        elmnt.style.top = rect.top + 'px';
        elmnt.style.transform = "none"; // 중앙 정렬 해제!
        
        // 커서 모양 '움켜쥔 손'으로 변경
        handle.style.cursor = "grabbing";

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        
        // 이동 거리 계산
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // 새 위치 적용
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // 드래그 종료 시 이벤트 해제 및 커서 복구
        document.onmouseup = null;
        document.onmousemove = null;
        handle.style.cursor = "grab";
    }
}

function toggleTheme() {
    const body = document.body;
    body.getAttribute('data-theme') === 'dark' ? body.removeAttribute('data-theme') : body.setAttribute('data-theme', 'dark');
}

/* [NEW] 볼륨 조절 기능 */
function setVolume(value) {
    const audio = document.getElementById('bgm');
    if(audio) {
        audio.volume = value; // 0.0 ~ 1.0 사이 값 적용
    }
}

/* script.js의 renderDiaryList 함수 교체 */

let currentFilter = 'all'; // 현재 선택된 필터 (기본값: 전체)

function renderDiaryList(filter = 'all') {
    currentFilter = filter; // 선택한 필터 저장
    const contentBox = document.getElementById('markdown-content');
    
    // 1. 데이터 필터링 (선택한 태그만 남기기)
    const filteredData = filter === 'all' 
        ? diaryData 
        : diaryData.filter(post => post.tag === filter);

    // 2. 필터 버튼 HTML (현재 선택된 버튼은 색깔 다르게 표시)
    const btnClass = (type) => type === currentFilter ? 'filter-btn active' : 'filter-btn';
    
    let html = `
        <div class="diary-header">
            <h1 style="border:none; margin:0;">📂 Diary Archive</h1>
            <p style="color:#666; margin-bottom: 20px;">총 ${filteredData.length}개의 기록</p>
            
            <div class="filter-container">
                <button class="${btnClass('all')}" onclick="renderDiaryList('all')">전체</button>
                <button class="${btnClass('일상')}" onclick="renderDiaryList('일상')">🍰 일상</button>
                <button class="${btnClass('DEV')}" onclick="renderDiaryList('DEV')">💻 DEV</button>
                <button class="${btnClass('덕질')}" onclick="renderDiaryList('덕질')">💜 덕질</button>
            </div>
        </div>

        <ul class="diary-list-style">
    `;

    // 3. 리스트 생성 (필터링된 데이터로)
    if (filteredData.length === 0) {
        html += `<li style="text-align:center; padding:40px; color:#888;">작성된 글이 없습니다. 🥲</li>`;
    } else {
        filteredData.forEach(post => {
            html += `
                <li onclick="loadPost('${post.file}')">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="tag ${getTagColor(post.tag)}">${post.tag}</span>
                        <span class="title">${post.title}</span>
                    </div>
                    <span class="date">${post.date}</span>
                </li>
            `;
        });
    }
    html += `</ul>`;

    contentBox.innerHTML = html;
    contentBox.classList.remove('content-fade-out'); // 페이드 효과
    switchView('post');
}

// (선택 사항) 태그별로 색상을 다르게 주는 함수 (꾸미기용)
function getTagColor(tag) {
    if (tag === 'DEV') return 'tag-dev';      // CSS에서 .tag-dev 색상 지정 필요
    if (tag === '덕질') return 'tag-fan';     // CSS에서 .tag-fan 색상 지정 필요
    return 'tag-daily';                       // 기본값
}

/* script.js의 renderGallery 함수 */
function renderGallery() {
    const contentBox = document.getElementById('markdown-content');
    
    let html = `
        <div class="btn-back" onclick="goHome()">⬅ Back to Home</div>
        <h1 style="margin-bottom:20px;">📷 Photo Gallery</h1>
        
        <div class="gallery-grid"> 
    `;

    photoData.forEach(photo => {
        html += `
            <div class="photo-card" onclick="alert('${photo.text}')">
                <img src="${photo.src}" alt="사진">
                <div class="photo-caption">${photo.text}</div>
            </div>
        `;
    });

    html += `</div>`; 

    contentBox.innerHTML = html;
    contentBox.classList.remove('content-fade-out');
    switchView('post'); 
}

/* script.js의 renderGallery 함수 수정 */

function renderGallery() {
    const contentBox = document.getElementById('markdown-content');
    
    let html = `
        <div class="btn-back" onclick="goHome()">⬅ Back to Home</div>
        <h1 style="margin-bottom:20px;">📷 Photo Gallery</h1>
        
        <div class="gallery-grid"> 
    `;

    photoData.forEach(photo => {
        html += `
            <div class="photo-card" onclick="alert('${photo.text}')">
                <img src="${photo.src}" alt="사진">
                <div class="photo-caption">${photo.text}</div>
            </div>
        `;
    });

    html += `</div>`; 

    contentBox.innerHTML = html;
    contentBox.classList.remove('content-fade-out');
    switchView('post'); 

}

