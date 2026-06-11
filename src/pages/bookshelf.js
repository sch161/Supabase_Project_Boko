import { renderMain } from "../main";
import { supabase } from "../supabase";

export async function renderBookShelf(shelfId) {
    const app = document.querySelector('#app');

    // 로그인 한 유저 정보 가져오기
    const { data: { user } } = await supabase.auth.getUser();

    // 책장 내용 가져오기
    const { data: shelf } = await supabase
        .from('bookshelves')
        .select('*')
        .eq('id', shelfId)
        .single();

    // 책 목록 가져오기 (시간 순 오름차순 정렬)
    const { data: book, error } = await supabase
        .from('book_records')
        .select('*')
        .eq('bookshelf_id', shelfId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    const isMe = user && shelf.user_id === user.id;

    app.innerHTML = `
    <div class="bookshelf-container">

        <header class="header">
            <div class="header-left-bookshelf">
                <button id="backButton">←</button>
                <div>
                    <p class="bookshelf-label">${shelf.name}</p>
                    <h1 class="bookshelf-title">${shelf.name}</h1>
                </div>
            </div>
            <div class="header-right">
                ${isMe ? `<button id="addButton" class="add-button">+ 독후감 쓰기</button>` : ''}
            </div>
        </header>

        <main>
            <div class="book-container">
                    <div class="book-record">
                        <div class="book-record-top">
                            <div class="book-record-left">
                                <span class="book-number">01</span>
                                <div class="book-record-info">
                                    <h2 class="book-record-title">인간 실격을 읽고</h2>
                                    <p class="book-record-book-title">『인간 실격』</p>
                                    <p class="book-record-commentary">"인간이라는 존재를 다시 생각하게 만드는 잔인한 자서전"</p>
                                    ${isMe ? `<p class="book-record-content">다자이 오사무의 인간 실격은 자신을 끊임없이 부정하는 한 남자의 이야기다. 요조의 시선으로 세상을 바라보면, 우리가 당연하게 여기는 모든 것이 낯설고 두렵게 느껴진다. 읽는 내내 불편했지만, 그 불편함이야말로 이 책의 힘이라고 생각했다.</p>` : ''}
                                </div>
                            </div>
                            <div class="book-record-right">
                                <span class="book-record-date">🗓 2024-03-15</span>
                                ${isMe ? `
                                    <button class="edit-button" data-id="${book.id}">✏️</button>
                                    <button class="delete-button" data-id="${book.id}">🗑</button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <hr class="divider">

                    <div class="book-record">
                        <div class="book-record-top">
                            <div class="book-record-left">
                                <span class="book-number">02</span>
                                <div class="book-record-info">
                                    <h2 class="book-record-title">채식주의자가 남긴 것</h2>
                                    <p class="book-record-book-title">『채식주의자』</p>
                                    <p class="book-record-commentary">"폭력과 순결 사이, 꽃이 되고 싶었던 한 사람의 이야기"</p>
                                    ${isMe ? `<p class="book-record-content">한강의 문장은 차갑고 정확하다. 영혜의 선택이 가족에게 가져오는 혼란을 통해, 우리 사회가 개인의 몸과 의지를 어떻게 통제하려 하는지를 섬뜩하게 그려낸다.</p>` : ''}
                                </div>
                            </div>
                            <div class="book-record-right">
                                <span class="book-record-date">🗓 2024-05-22</span>
                                ${isMe ? `
                                    <button class="edit-button" data-id="${book.id}">✏️</button>
                                    <button class="delete-button" data-id="${book.id}">🗑</button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <hr class="divider">

                    <div class="book-record">
                        <div class="book-record-top">
                            <div class="book-record-left">
                                <span class="book-number">03</span>
                                <div class="book-record-info">
                                    <h2 class="book-record-title">노르웨이의 숲에서 길을 잃다</h2>
                                    <p class="book-record-book-title">『노르웨이의 숲』</p>
                                    <p class="book-record-commentary">"젊음의 상실을 이토록 아름답게 그린 소설"</p>
                                    ${isMe ? `<p class="book-record-content">무라카미 하루키 특유의 감성이 가득한 소설. 상실과 성장을 이렇게 담담하게 그릴 수 있다는 것이 놀라웠다.</p>` : ''}
                                </div>
                            </div>
                            <div class="book-record-right">
                                <span class="book-record-date">🗓 2024-05-22</span>
                                ${isMe ? `
                                    <button class="edit-button" data-id="${book.id}">✏️</button>
                                    <button class="delete-button" data-id="${book.id}">🗑</button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
            </div>
        </main>

    </div>
    `;

    // 메인 화면으로 가기
    document.getElementById('backButton')?.addEventListener('click', () => {
        renderMain();
    });
}
