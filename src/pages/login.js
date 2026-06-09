import logo from '../pages/assets/BokoLogo.png';

export function renderLogin() {
    const app = document.querySelector("#app");

    app.innerHTML = `
    <div class="auth-container">

      <div class="logo">
        <img src="${logo}">
        <h1>Boko</h1>
        <p>나만의 독서 기록장</p>
      </div>

      <div class="auth-card">

        <div class="tabs">
          <button id="login-tab">로그인</button>
          <button id="signup-tab">회원가입</button>
        </div>

        <form id="login-form">

          <label>이메일</label>
          <input
            type="email"
            id="email"
            placeholder="s****@e-mirim.hs.kr"
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
        © 2026 Boko — 책과 함께하는 기록
      </p>

    </div>
  `;
};