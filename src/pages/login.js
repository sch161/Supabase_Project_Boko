import logo from './assets/BokoLogo.png';
import { renderSignup } from './signup.js'
import { supabase } from '../supabase.js';
import { renderMain } from '../main.js';

export function renderLogin() {
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
          <button id="login-tab" class="active">로그인</button>
          <button id="signup-tab">회원가입</button>
        </div>

        <form id="login-form">

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
            로그인
          </button>

        </form>

      </div>

      <p class="footer">
        © 2026 Boko — Book Connection
      </p>

    </div>
  `;

  // 탭 전환
  document.querySelector("#signup-tab").addEventListener("click", () => {
    renderSignup();
  });

  // 로그인
  document.querySelector('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(`로그인 실패 ${error.message}`);
      return;
    }

    alert('로그인 성공');
    renderMain();
  });

};