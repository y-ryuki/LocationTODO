(() => {
    // 初期化処理
    document.addEventListener("DOMContentLoaded", () => {
        initMap();
        setupTodoHandlers();
        setupCompleteButtons();
    });

    let map; // Googleマップのインスタンス
    let markers = {}; // TODO IDと対応するマーカーを保持

    /** Googleマップの初期化 */
    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: { lat: 35.6895, lng: 139.6917 }, // 東京
        });

        const categoryIcons = getCategoryIcons();
        const todos = parseTodosData();

        todos.forEach(todo => createMarker(todo, categoryIcons));
    }

    /** カテゴリごとのアイコン設定を取得 */
    function getCategoryIcons() {
        return {
            work: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            personal: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            other: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            default: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        };
    }

    /** TODOデータを取得して解析 */
    function parseTodosData() {
        const todosData = document.getElementById("todos-data").textContent;
        try {
            return JSON.parse(todosData);
        } catch (error) {
            console.error("JSONの解析中にエラーが発生しました:", error.message);
            alert('TODOデータの取得に失敗しました。リロードしてください。');
            return [];
        }
    }

    /** マーカーを作成して地図に追加 */
    function createMarker(todo, categoryIcons) {
        const marker = new google.maps.Marker({
            position: { lat: parseFloat(todo.latitude), lng: parseFloat(todo.longitude) },
            map: map,
            title: todo.title,
            icon: categoryIcons[todo.category] || categoryIcons.default,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="font-family: Arial; font-size: 14px; color: #333;">
                    <h3 style="color: #4CAF50;">${todo.title}</h3>
                    <p>${todo.description || "説明なし"}</p>
                    <p style="font-style: italic;">カテゴリ: ${todo.category || "未分類"}</p>
                </div>
            `,
        });

        marker.addListener('click', () => infoWindow.open(map, marker));

        // マーカーを保存
        markers[todo.id] = marker;
    }

    /** TODO削除および編集のハンドラーを設定 */
    function setupTodoHandlers() {
        setupDeleteButtons();
        setupTodoEditing();
    }

    /** 削除ボタンの設定 */
    function setupDeleteButtons() {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                const todoId = button.dataset.id;
                if (confirm('このTODOを削除しますか？')) {
                    deleteTodo(todoId);
                }
            });
        });
    }

    /** TODO削除リクエストを送信 */
    async function deleteTodo(todoId) {
        try {
            const response = await fetch(`/todo/delete/${todoId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                },
            });

            if (!response.ok) throw new Error('ネットワークエラー');
            const data = await response.json();

            if (data.success) {
                alert(data.message);
                document.getElementById(`todo-item-${todoId}`).remove();
                if (markers[todoId]) {
                    markers[todoId].setMap(null); // マーカーを地図から削除
                    delete markers[todoId]; // オブジェクトからも削除
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('削除エラー:', error);
        }
    }

    /** TODO編集機能を設定 */
    function setupTodoEditing() {
        const modal = document.getElementById('update-modal');
        const form = document.getElementById('update-form');

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', () => {
                const todoId = button.dataset.id;
                showUpdateModal(todoId, modal);
            });
        });

        form.addEventListener('submit', event => handleFormSubmit(event, form, modal));
    }

    /** 編集モーダルを表示 */
    function showUpdateModal(todoId, modal) {
        const todoItem = document.getElementById(`todo-item-${todoId}`);
        const title = todoItem.querySelector('strong').innerText;
        const description = todoItem.querySelector('.description').innerText;

        document.getElementById('todo-id').value = todoId;
        document.getElementById('todo-title').value = title;
        document.getElementById('todo-description').value = description;

        modal.style.display = 'block';
    }

    /** フォーム送信時の処理 */
    async function handleFormSubmit(event, form, modal) {
        event.preventDefault();

        const todoId = document.getElementById('todo-id').value;
        const title = document.getElementById('todo-title').value;
        const description = document.getElementById('todo-description').value;


        if (!title) {
            document.getElementById('error-message').innerText = "タイトルは必須です。";
            document.getElementById('error-message').style.display = "block";
            return;
        }

        if (title.length > 30) {
            document.getElementById('error-message').innerText = "タイトルは30文字以内で入力してください";
            document.getElementById('error-message').style.display = "block";
            return;
        }

        if (description.length > 500) {
            document.getElementById('error-message').innerText = "説明は500文字以内で入力してください";
            document.getElementById('error-message').style.display = "block";
            return;
        }

        try {
            const response = await fetch(`/todo/update/${todoId}/ajax/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({ title, description }),
            });

            const data = await response.json();

            if (data.success) {
                updateTodoInView(todoId, title, description);
                alert(data.message);
                modal.style.display = 'none';
            } else {
                alert('更新に失敗しました');
            }
        } catch (error) {
            console.error('更新エラー:', error);
        }
    }

    /** モーダル外クリックで閉じる */
    window.addEventListener('click', event => {
        const modal = document.getElementById('update-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    /** TODOリストを更新 */
    function updateTodoInView(todoId, title, description) {
        const todoItem = document.getElementById(`todo-item-${todoId}`);
        todoItem.innerHTML = `
            <strong>${title}</strong>: ${description}
            <button class="edit-btn" data-id="${todoId}">編集</button>
            <button class="delete-btn" data-id="${todoId}">削除</button>
        `;

            // 更新後にイベントリスナーを再設定
        setupDeleteButtons();
        setupTodoEditing();
    }


    function setupCompleteButtons() {
        const completeButtons = document.querySelectorAll('.complete-btn');
    
        completeButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const todoId = event.target.dataset.id;
                const isCompleted = event.target.textContent.includes('未完了');
    
                const url = isCompleted ? `/todo/uncomplete/${todoId}/` : `/todo/complete/${todoId}/`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                    },
                });
    
                const data = await response.json();
                if (data.success) {
                    alert(data.message);
    
                    const todoItem = document.getElementById(`todo-item-${todoId}`);
                    todoItem.classList.toggle('completed');
                    event.target.textContent = isCompleted ? '完了' : '未完了に戻す';
                } else {
                    alert('状態の更新に失敗しました');
                }
            });
        });
    }
    

    /** CSRFトークンを取得 */
    function getCSRFToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') return value;
        }
        return null;
    }
})();
