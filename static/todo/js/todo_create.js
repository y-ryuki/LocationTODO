// Googleマップの初期化
function initMap() {
    // 地図を設定（東京を中心）
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 35.6895, lng: 139.6917 }, // 東京の緯度・経度
    });    
    // 地図クリックイベントを設定（新しいTODOの場所指定用）
    setupMapClickListener(map);
}


// 地図をクリックしたときにマーカーを追加
function setupMapClickListener(map) {
    let selectedMarker = null; // 現在選択中のマーカー

    map.addListener("click", (event) => {
        const lat = event.latLng.lat(); // クリック位置の緯度
        const lng = event.latLng.lng(); // クリック位置の経度

        // 既存のマーカーを削除
        if (selectedMarker) {
            selectedMarker.setMap(null);
        }

        // 新しいマーカーを作成
        selectedMarker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            animation: google.maps.Animation.DROP,
        });

        // 緯度・経度をフォームにセット
        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lng;

        console.log(`新しいマーカー: 緯度 ${lat}, 経度 ${lng}`);
    });
}

// 初期化処理
document.addEventListener("DOMContentLoaded", function () {
    initMap(); // Googleマップを初期化
});

