
# Todoアプリ

## 概要
位置情報で管理するTODO
Google Mapから位置情報を指定してTODOを入力
入力後、リストからTODOを確認することができる。通知は指定した場所から半径500メートル以内に到着した場合通知される。現在地の更新は10秒ごとにチェックを行い、50メートル動いた場合に更新され、通知するか判断する。


## 技術スタック
開発環境
Docker,MacOS

バックエンド
Django 4.1
Python 3.9

フロントエンド
JavaScript
GoogleMapsAPI

データベース
MySQL 8.0
