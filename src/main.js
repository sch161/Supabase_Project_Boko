import { renderLogin } from "./pages/login.js";
import logo from './pages/assets/BokoLogo.png';
import { supabase } from "./supabase.js";
import "./styles/style.css";
import { renderBookShelf } from "./pages/bookshelf.js";

export async function renderMain() {
  const app = document.querySelector('#app');

  // 로그인한 유저 정보 가져오기, 로그인 안 하면 user -> null
  const { data: { user } } = await supabase.auth.getUser();

  // 책장 생성
  if (user) {
    const { data: shelf } = await supabase
      .from('bookshelves')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!shelf) {
      const { error } = await supabase
        .from('bookshelves')
        .insert({
          user_id: user.id,
          name: `${user.user_metadata.name}의 책장`
        });

      if (error) {
        console.error('책장 생성 실패', error);
      }
    }
  }

  // 전체 책장, 각 책장의 책 목록 가져오기
  const { data: shelves, error } = await supabase
    .from('bookshelves')
    .select(`
      *,
      book_records (
        id,
        book_title
      )
    `);

  // 에러 시 에러 출력, 함수 종료
  if (error) {
    console.error(error);
    return;
  }

  // 로그인한 사용자의 책장이 1번으로 오도록 정렬
  const sortedShelves = shelves.sort((a, b) => {
    if (user && a.user_id === user.id) return -1;
    if (user && b.user_id === user.id) return 1;
    return 0;
  });

  // 책장 배열 순회하면서 html 코드 문자열로 반환
  const shelvesHTML = shelves.map(shelf => {
    const books = shelf.book_records; // 현재 책장에 있는 책 목록 배열
    const isMe = user && shelf.user_id === user.id; // 책장이 로그인한 유저인지 확인

    const booksHTML = books.length > 0 // 책장에 책이 있으면 div 만들기
      ? books.map(b => `<div class="book-item">${b.book_title}</div>`).join('')
      : `<div class="empty-shelf">비어 있음</div>`;

    return `
      <div class="user-bookshelf-card">
        <div class="user-label">
          <span>👤</span> ${shelf.name}
          ${isMe ? '<span class="me-badge">나</span>' : ''}
        </div> 
        <div class="bookshelf-card" data-shelf-id="${shelf.id}">
          <div class="book-list">
            ${booksHTML}
          </div>
          <div class="card-footer">
            <span>${shelf.name}</span>
            <span>${books.length}권</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div class="main-container">

      <header class="header">
        <div class="header-left">
          <div class="logo">
            <img src="${logo}">
            <h1>Boko</h1>
          </div>
        </div>
        <div class="header-right">
          ${user // 로그인한 상태면 이름, 로그아웃 버튼
      ? `<span>${user.user_metadata.name ?? user.email}</span>
               <button id="logoutButton">로그아웃</button>`
      : `<button id="loginButton">로그인</button>`
    }
        </div>
      </header>

      <main>
        <p>모두의 서재</p>
        <h2>지금 읽고 있는 사람들</h2>

        <div class="bookshelf-grid">
          ${shelvesHTML}
        </div>

        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-number">${shelves.length}</span>
            <span class="stat-label">등록된 책장</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${shelves.reduce((acc, bookCount) => acc + bookCount.book_records.length, 0)}</span>
            <span class="stat-label">전체 독서 기록</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${user ? shelves.find(s => s.user_id === user.id)?.book_records.length ?? 0 : 0}</span>
            <span class="stat-label">내가 읽은 책</span>
          </div>
        </div>

      </main>
    </div>
  `;

  // 로그인 버튼
  document.getElementById('loginButton')?.addEventListener('click', () => {
    renderLogin();
  });

  // 로그아웃 버튼
  document.getElementById('logoutButton')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    renderMain();
  });

  // 비로그인으로 책장 클릭 시 경고창
  document.querySelectorAll('.bookshelf-card').forEach(card => {
    card.addEventListener('click', () => {
      if (!user) {
        alert('로그인이 필요한 서비스입니다.');
        renderLogin();
        return;
      }
      renderBookShelf(card.dataset.shelfId);
    });
  });

  // 로고 클릭 시 화면 렌더링
  document.querySelector('.logo').addEventListener('click', () => {
    renderMain();
  })
}

renderMain();