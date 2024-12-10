let lastPosition = null; // 前回の位置情報を保持
const DISTANCE_THRESHOLD = 50; // 閾値（メートル単位）

document.addEventListener('DOMContentLoaded', () => {
    const checkLocationInterval = 5000; // 5秒ごとにチェック
    setInterval(checkUserLocation, checkLocationInterval);
});

async function checkUserLocation() {
    if (!navigator.geolocation) {
        alert("位置情報が利用できません。");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;

            // 前回の位置情報と比較して距離を計算
            if (lastPosition) {
                const distance = calculateDistance(
                    lastPosition.latitude,
                    lastPosition.longitude,
                    latitude,
                    longitude
                );

                console.log(`前回からの移動距離: ${distance}メートル`);

                if (distance < DISTANCE_THRESHOLD) {
                    console.log("閾値未満の移動: 通知なし");
                    return; // 閾値未満の移動の場合、通知しない
                }
            }

            // 現在地をサーバーに送信
            try {
                const response = await fetch('/todo/check-location/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFToken(),
                    },
                    body: JSON.stringify({ latitude, longitude }),
                });

                if (!response.ok) {
                    console.error(`サーバーエラー: ${response.status}`);
                    return;
                }

                const data = await response.json();
                console.log(data);

                if (data.success && Array.isArray(data.todos_in_range) && data.todos_in_range.length > 0) {
                    data.todos_in_range.forEach(todo => alertUser(todo));
                } else {
                    console.log("通知すべきアラートはありません");
                }
            } catch (error) {
                console.error("位置情報チェックエラー:", error);
                alert("位置情報チェック中にエラーが発生しました。");
            }

            // 現在地を記録
            lastPosition = { latitude, longitude };
        },
        (error) => {
            console.error("現在地取得エラー:", error.message);
            alert("現在地の取得に失敗しました。位置情報サービスを確認してください。");
        }
    );
}

// ユーザーに通知を表示
function alertUser(alert) {
    window.alert(`TODOに到着しました: ${alert.title}\n${alert.description}`);
}

// 距離計算（ハヴァサイン公式を利用）
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // 地球の半径（メートル）
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 距離（メートル単位）
}

// CSRFトークン取得
function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') return value;
    }
    return null;
}
