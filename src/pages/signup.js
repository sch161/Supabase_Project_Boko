import logo from './assets/BokoLogo.png';
import { renderLogin } from './login.js'
import { supabase } from '../supabase.js';

export function renderSignup() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="auth-container">

      <div class="logo">
        <img src="${logo}">
        <h1>Boko</h1>
        <p>꾸준히 채워가는 나만의 도서관</p>
      </div>

      <div class="auth-card">

        <div class="tabs">
          <button id="login-tab">로그인</button>
          <button id="signup-tab" class="active">회원가입</button>
        </div>

        <form id="signup-form">

          <label>이름</label>
          <input
            type="text"
            id="name"
            placeholder="홍길동"
          >

          <label>이메일</label>
          <input
            type="email"
            id="email"
            placeholder="example@email.com"
          >

          <label>비밀번호</label>
          <input
            type="password"
            id="password"
          >

          <button type="submit">
            회원가입
          </button>

        </form>

      </div>

      <p class="footer">
        © 2026 Boko — Book Connection
      </p>

    </div>
  `;

  // 탭 전환
  document.querySelector("#login-tab").addEventListener("click", () => {
    renderLogin();
  });

  // 회원가입
  document.querySelector('#signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (error) {
      alert(`회원가입 실패 ${error.message}`);
      return;
    }

    alert('회원가입 성공! 로그인해주세요.');
  });

};