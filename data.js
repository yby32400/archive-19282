/* ==========================================================
   ★ 여기에 글을 쓰세요! (저장하면 사이트에 바로 반영됨)
   ========================================================== */

// 1. 달력 일정 (날짜: { 이미지, 링크 })
const mySchedule = {
    "1-29": { img: "https://pbs.twimg.com/media/G-ubDR3bAAAeXV-?format=jpg&name=large", link: "https://drive.google.com" },
    "2-14": { img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", link: "#" }
};

// 2. 공지사항 (Notice)
const noticePosts = [
    {
        title: "아카이브 오픈 안내",
        date: "2026.01.18",
        body: `옵시드 카렌 아카이브가 오픈되었습니다.`
    }
];

// 3. 체키/사진 (Cheki) - images에 여러 장 넣기 가능
const chekiPosts = [
    {
        title: "1월 29일 정산 (사진 예시)",
        date: "2026.01.29",
        tag: "CHEKI",
        images: [
            "https://images.unsplash.com/photo-1595079676339-1534801ad6cf", // 첫번째
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac"  // 두번째
        ],
        body: `오늘 카렌이랑 체키 찍었는데 너무 귀여웠음.`
    }
];

// 4. 미디어 (Media)
const mediaPosts = [
    {
        title: "페르소나5 플레이 영상",
        date: "2026.01.15",
        tag: "YOUTUBE",
        img: "https://images.unsplash.com/photo-1635322966219-b75ed3a90e27?q=80&w=1000&auto=format&fit=crop",
        link: "https://youtube.com", 
        body: ""
    }
];
