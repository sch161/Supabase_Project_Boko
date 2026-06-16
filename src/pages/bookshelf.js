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
    const { data: books, error } = await supabase
        .from('book_records')
        .select('*')
        .eq('bookshelf_id', shelfId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    const isMe = user && shelf.user_id === user.id;

    const booksHtml = books.length === 0 ?
        `
        <div class="empty-bookshelf">
          책장이 비어있습니다.
        </div>
        ` :
        books.map((book, index) => `
            <div class="book-record">
                <div class="book-record-top">

                    <div class="book-record-left">
                        <span class="book-number">
                            ${String(index + 1).padStart(2, '0')}
                        </span>

                        <div class="book-record-info">
                            <h2 class="book-record-title">
                                ${book.title}
                            </h2>

                            <p class="book-record-book-title">
                                『${book.book_title}』
                            </p>

                            <p class="book-record-commentary">
                                "${book.book_commentary}"
                            </p>

                            ${isMe ? `
                                <p class="book-record-content">
                                    ${book.book_content}
                                </p>
                            ` : ''}
                        </div>
                    </div>

                    <div class="book-record-right">

                        <span class="book-record-date">
                            ${book.created_at.slice(0, 10)}
                        </span>

                        ${isMe ? `
                            <button
                                class="edit-button"
                                data-id="${book.id}">
                                ✎
                            </button>

                            <button
                                class="delete-button"
                                data-id="${book.id}">
                                🗑
                            </button>
                        ` : ''}

                    </div>

                </div>
            </div>

            <hr class="divider">
        `).join('');


    app.innerHTML = `
    <div class="bookshelf-container">

        <header class="header">
            <div class="header-left-bookshelf">
                <button id="backButton">←</button>
                <div>
                    <h1 class="bookshelf-title">${shelf.name}</h1>
                </div>
            </div>
            <div class="header-right">
                ${isMe ? `<button id="addButton" class="add-button">+ 독후감 쓰기</button>` : ''}
            </div>
        </header>

        <main>
            <div class="book-container">

                <div id="writeForm" class="write-form hidden">

                    <h2>새 독후감</h2>

                    <div class="form-row">
                        <div class="form-group">
                            <label>독후감 제목 *</label>
                            <input id="title" placeholder="이 글의 제목">
                        </div>

                        <div class="form-group">
                            <label>책 제목 *</label>
                            <input id="bookTitle" placeholder="읽은 책 제목">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>내용</label>
                        <textarea id="content" placeholder="책에 대한 생각, 인상 깊었던 부분 등을 자유롭게 적어보세요."></textarea>
                    </div>

                    <div class="form-group">
                        <label>한줄평</label>
                        <input type="text" id="commentary" placeholder="이 책을 한 문장으로 표현한다면?">
                    </div>

                    <div class="form-buttons">
                        <button id="cancelButton">취소</button>
                        <button id="saveButton">저장하기</button>
                    </div>

                </div>

                ${booksHtml}
            </div>
        </main>

    </div>
    `;

    // 메인 화면으로 가기
    document.getElementById('backButton')?.addEventListener('click', () => {
        renderMain();
    });

    // 독후감 폼 열기 (+ 독후감 쓰기)
    document.getElementById('addButton')?.addEventListener('click', async () => {
        const { count } = await supabase
            .from('book_records')
            .select('*', { count: 'exact', head: true })
            .eq('bookshelf_id', shelfId);

        if (count >= 5) {
            alert('독후감은 최대 5권까지 등록할 수 있습니다.');
            return;
        }

        document.getElementById('writeForm').classList.remove('hidden');
    });

    // 독후감 폼 닫기 (취소)
    document.getElementById('cancelButton')?.addEventListener('click', () => {
        editingBookId = null;

        document.getElementById('title').value = '';
        document.getElementById('bookTitle').value = '';
        document.getElementById('content').value = '';
        document.getElementById('commentary').value = '';

        document.getElementById('saveButton').textContent = '저장하기';

        document.getElementById('writeForm').classList.add('hidden');
    });

    // 독후감 추가 (저장하기)
    document.getElementById('saveButton')?.addEventListener('click', async () => {

        const title = document.getElementById('title').value;
        const bookTitle = document.getElementById('bookTitle').value;
        const content = document.getElementById('content').value;
        const commentary = document.getElementById('commentary').value;

        if (!title || !bookTitle || !content || !commentary) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        let error;

        if (editingBookId) {

            const result = await supabase
                .from('book_records')
                .update({
                    title,
                    book_title: bookTitle,
                    book_content: content,
                    book_commentary: commentary
                })
                .eq('id', editingBookId);

            error = result.error;

        } else {

            const result = await supabase
                .from('book_records')
                .insert({
                    bookshelf_id: shelfId,
                    user_id: user.id,
                    title,
                    book_title: bookTitle,
                    book_content: content,
                    book_commentary: commentary
                });

            error = result.error;
        }

        if (error) {
            console.error(error);
            alert('저장 실패');
            return;
        }

        alert(editingBookId ? '수정 완료' : '작성 완료');

        renderBookShelf(shelfId);
    });

    // 독후감 삭제 (휴지통)
    document.querySelectorAll('.delete-button').forEach((button) => {

        button.addEventListener('click', async () => {

            const bookId = button.dataset.id;

            const sure = confirm('정말 삭제하시겠습니까?');

            if (!sure) return;

            const { data, error } = await supabase
                .from('book_records')
                .delete()
                .eq('id', bookId);


            if (error) {
                console.error(error);
                alert('삭제 실패');
                return;
            }

            alert('삭제 완료');

            renderBookShelf(shelfId);
        });
    });

    // 독후감 수정 (연필)
    let editingBookId = null;
    document.querySelectorAll('.edit-button').forEach((button) => {

        button.addEventListener('click', () => {

            const bookId = button.dataset.id;

            const book = books.find(bf => bf.id === bookId);

            editingBookId = bookId;

            document.getElementById('title').value = book.title;
            document.getElementById('bookTitle').value = book.book_title;
            document.getElementById('content').value = book.book_content;
            document.getElementById('commentary').value = book.book_commentary;

            document.getElementById('writeForm').classList.remove('hidden');
            document.getElementById('saveButton').textContent = '수정하기';
        });
    });

}
