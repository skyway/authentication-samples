# SkyWay Authentication Sample

このリポジトリには、SkyWayで利用する認証情報を生成・取得するサンプルがあります。

SkyWayにおけるエンドユーザーの認証・認可について、詳細は[開発者ドキュメントのSkyWay Auth Tokenのページ](https://skyway.ntt.com/ja/docs/user-guide/authentication/skyway-auth-token/)をご覧ください。

## サーバーアプリケーション

`/authenticate`にてPOSTリクエストを受け付け、認証情報の発行を行います。

### NodeJSサーバー

server/nodejsディレクトリに移動して依存ライブラリをインストールしてください。
次に、index.jsファイルをテキストエディタで開き、 `appId` と `secretKey` の各変数の値を自身のApp ID、Secret Keyに書き換えてファイルを保存してください。
その後、 `npm start` コマンドでサーバーを起動してください。
サーバーは8080ポートを使用します。

```sh
cd server/nodejs
npm i
npm start
```

### PHPサーバー

server/on-cloud-run-functions/phpディレクトリに移動して、[Composer](https://getcomposer.org/) で依存ライブラリをインストールしてください。
次に、環境変数 `APP_ID` と `SECRET_KEY`、 `VALID_FIXED_SESSION_TOKEN` に値を設定してください。
- `APP_ID` と `SECRET_KEY`は、それぞれ自身のApp ID、Secret Keyを設定してください。
- `VALID_FIXED_SESSION_TOKEN`は、クライアントアプリケーションを検証する際に用いる固定値を設定してください。
  - 後述のクライアントアプリケーションをそのまま使う場合は、[`4CXS0f19nvMJBYK05o3toTWtZF5Lfd2t6Ikr2lID`](https://github.com/skyway/authentication-samples/blob/ea675724d7458c0f765b018c1698980493f8b06b/client/index.js#L15)を設定してください。
  - サンプルのため、クライアントアプリケーションからの[リクエストボディの sessionToken パラメーター](https://github.com/skyway/authentication-samples/blob/ea675724d7458c0f765b018c1698980493f8b06b/client/index.js#L15)と比較で検証する作りにしています。本番環境では、より高度な検証方法を用いられることが望ましいです。

環境変数の設定ができない場合は、 .env.example ファイルの名前を .env に変更し、上記3変数に値を設定してファイルを保存してください。
その後、環境変数`FUNCTION_TARGET`を設定し、`php -S localhost:8080` コマンドでローカルサーバーを起動してください。
サーバーは8080ポートを使用します。

```sh
cd server/on-cloud-run-functions/php
composer install

FUNCTION_TARGET=main php -S localhost:8080 vendor/google/cloud-functions-framework/router.php
```

## クライアントアプリケーション

サーバーアプリケーションにリクエストを行い、認証情報を取得します。

clientディレクトリをホスティングし、ブラウザから`index.html`にアクセスしてください。

### 操作方法

1. Room Name、Member Nameのテキストボックスに文字列を入力します。
2. Get credentialボタンを押下します。
3. 認証情報の取得に成功すると、結果がCredentialのエリアにJSON形式で出力されます。
    - `authToken`がアプリケーションからSkyWayを利用する際に必要となります
4. Copy authToken to clipboardボタンを押下することで、クリップボードに `authToken`がコピーされます。

### スクリーンショット

![クライアントアプリケーションのスクリーンショット](./docs/img/screen-shot.png)

## 公開リポジトリの運用方針について

このリポジトリは公開用のミラーリポジトリであり、こちらで開発は行いません。

### Issue / Pull Request

受け付けておりません。

Enterpriseプランをご契約のお客様はテクニカルサポートをご利用ください。
詳しくは[SkyWayサポート](https://support.skyway.ntt.com/hc/ja)をご確認ください。
