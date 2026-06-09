import logo from './assets/BokoLogo.png';
import { renderSignup } from './signup.js'

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

  document.querySelector("#signup-tab").addEventListener("click", ()=>{
    renderSignup();
  })
};