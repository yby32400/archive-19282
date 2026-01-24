/* data.js - 여기만 수정하면 목록이 자동으로 바뀝니다! */

const diaryData = [
    {
        id: 1, 
        title: "퇴사까지 D-36, 오늘의 기분", 
        date: "26.01.23", 
        tag: "일상", 
        file: "posts/2026-01-23.md" // ✅ 실제 존재하는 파일!
    }, // 👈 (중요) 여기에 쉼표가 꼭 있어야 합니다!
    {
        id: 2,
        title: "홈페이지 리뉴얼 중... 삽질의 기록", 
        date: "26.01.23", 
        tag: "DEV", 
        file: "posts/20260123_dev.md" // ⚠️ 주의: 이 파일이 posts 폴더에 없으면 클릭해도 안 열려요!
    },
    {
        id: 3,
        title: "페르소나 5 엔딩 보고 옴", 
        date: "26.01.20", 
        tag: "덕질", 
        file: "posts/20260120_p5.md" // ⚠️ 주의: 파일이 없으면 테스트용으로만 보입니다.
    }
];

/* data.js 맨 아래에 추가 */

const photoData = [
    { src: "https://placehold.co/400x300/e0c3fc/fff", text: "일본 여행 준비 중 ✈️" },
    { src: "https://placehold.co/300x500/ff9a9e/fff", text: "페르소나 굿즈 샀다" }, 
    { src: "https://placehold.co/400x400/a18cd1/fff", text: "퇴근길 하늘" },
    { src: "https://placehold.co/300x400/fecfef/fff", text: "새 키보드 장만" },
    { src: "https://placehold.co/400x300/89f7fe/fff", text: "동네 고양이 🐱" },
    { src: "https://placehold.co/300x500/66a6ff/fff", text: "코딩 공부... 어렵다" },
];