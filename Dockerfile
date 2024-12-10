# Python ベースイメージを使用
FROM python:3.9

# 作業ディレクトリを設定
WORKDIR /app

# 必要なパッケージをインストール
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのソースをコピー
COPY . /app/

# デフォルトコマンド
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
