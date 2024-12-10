
// // Googleマップの初期化
// function initMap() {
//     // 地図を設定（東京を中心）
//     const map = new google.maps.Map(document.getElementById("map"), {
//         zoom: 12,
//         center: { lat: 35.6895, lng: 139.6917 }, // 東京の緯度・経度
//     });

//     // カテゴリごとのアイコン設定
//     const categoryIcons = {
//         work: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
//         personal: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
//         other: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
//         default: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
//     };

//     // Djangoから渡されたTODOデータを取得
//     const todosData = document.getElementById("todos-data").textContent;
//     let todos = [];
//     try {
//         todos = JSON.parse(todosData); // JSONデータを解析
//         // console.log("TODOデータ:", todos); // デバッグ用
//     } catch (error) {
//         console.error("JSONの解析中にエラーが発生しました:", error.message);
//     }
    
//     // TODOデータごとにマーカーを地図に追加
//     todos.forEach(todo => createMarker(todo, map, categoryIcons));
    
//     // 地図クリックイベントを設定（新しいTODOの場所指定用）
//     setupMapClickListener(map);
// }

// // マーカーを作成して地図に追加
// function createMarker(todo, map, categoryIcons) {
//     // マーカー設定
//     const marker = new google.maps.Marker({
//         position: { lat: parseFloat(todo.latitude), lng: parseFloat(todo.longitude) },
//         map: map,
//         title: todo.title,
//         icon: categoryIcons[todo.category] || categoryIcons.default, // カテゴリに応じたアイコン
//     });

//     // 情報ウィンドウ（マーカークリック時のポップアップ）
//     const infoWindow = new google.maps.InfoWindow({
//         content: `
//             <div style="font-family: Arial; font-size: 14px; color: #333;">
//                 <h3 style="color: #4CAF50;">${todo.title}</h3>
//                 <p>${todo.description || "説明なし"}</p>
//                 <p style="font-style: italic;">カテゴリ: ${todo.category || "未分類"}</p>
//             </div>
//         `,
//     });

//     // マーカークリックで情報ウィンドウを表示
//     marker.addListener('click', () => infoWindow.open(map, marker));
// }

// // 地図をクリックしたときにマーカーを追加
// function setupMapClickListener(map) {
//     let selectedMarker = null; // 現在選択中のマーカー

//     map.addListener("click", (event) => {
//         const lat = event.latLng.lat(); // クリック位置の緯度
//         const lng = event.latLng.lng(); // クリック位置の経度

//         // 既存のマーカーを削除
//         if (selectedMarker) {
//             selectedMarker.setMap(null);
//         }

//         // 新しいマーカーを作成
//         selectedMarker = new google.maps.Marker({
//             position: { lat, lng },
//             map: map,
//             animation: google.maps.Animation.DROP,
//         });

//         // 緯度・経度をフォームにセット
//         document.getElementById("latitude").value = lat;
//         document.getElementById("longitude").value = lng;

//         console.log(`新しいマーカー: 緯度 ${lat}, 経度 ${lng}`);
//     });
// }

// // // 削除ボタンのクリックイベントを設定
// // function handleDeleteButtons() {
// //     const deleteButtons = document.querySelectorAll('.delete-btn');

// //     deleteButtons.forEach(button => {
// //         button.addEventListener('click', function (event) {
// //             event.preventDefault(); // ページ遷移を防ぐ
// //             const todoId = this.dataset.id; // ボタンからTODOのIDを取得

// //             if (confirm('このTODOを削除しますか？')) {
// //                 deleteTodo(todoId); // 削除処理を呼び出し
// //             }
// //         });
// //     });
// // }

// // // TODOを削除するリクエストを送信
// // function deleteTodo(todoId) {
// //     fetch(`delete/${todoId}/`, {
// //         method: 'POST',
// //         headers: {
// //             'X-CSRFToken': getCSRFToken(), // CSRFトークンを設定
// //         },
// //     })
// //         .then(response => {
// //             if (!response.ok) {
// //                 throw new Error('ネットワークエラー');
// //             }
// //             return response.json(); // レスポンスをJSON形式で取得
// //         })
// //         .then(data => {
// //             if (data.success) {
// //                 alert(data.message);
// //                 document.getElementById(`todo-item-${todoId}`).remove(); // TODOリストから削除
// //             } else {
// //                 alert(data.message);
// //             }
// //         })
// //         .catch(error => console.error('削除エラー:', error));
// // }

// // // CSRFトークンを取得
// // function getCSRFToken() {
// //     const cookies = document.cookie.split(';');
// //     for (let cookie of cookies) {
// //         const [name, value] = cookie.trim().split('=');
// //         if (name === 'csrftoken') {
// //             return value;
// //         }
// //     }
// //     return null;
// // }

// // // 初期化処理
// // document.addEventListener("DOMContentLoaded", function () {
// //     initMap(); // Googleマップを初期化
// //     handleDeleteButtons(); // 削除ボタンを設定
// //     setupMapClickListener();
// // });

