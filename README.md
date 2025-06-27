# SkyWay Authentication Sample

このリポジトリには、SkyWayで利用する認証情報を生成・取得するサンプルがあります。

SkyWayにおけるエンドユーザーの認証・認可について、詳細は[開発者ドキュメントのSkyWay Auth Tokenのページ](https://skyway.ntt.com/ja/docs/user-guide/authentication/skyway-auth-token/)をご覧ください。

## サーバーアプリケーション

認証情報の発行を行うサーバーアプリケーションです。

### NodeJSサーバー

Node.js サーバーには2つのサンプルがあります。
@skyway-sdk/token パッケージを使用すると、SkyWay Auth Token の生成が簡単に行えます。

#### use-token-package サンプル（@skyway-sdk/token 使用）

SkyWay 公式の Token パッケージを使用する方法のサンプルです。

```sh
cd server/nodejs/use-token-package
npm install
npm start
```

**設定方法:**
- 環境変数 `SKYWAY_APP_ID` と `SKYWAY_SECRET_KEY` を設定
- または、index.jsファイル内の変数値を書き換え

#### use-jsonwebtoken-package サンプル（jsonwebtoken パッケージ使用）

jsonwebtoken パッケージを使用して直接 SkyWay Auth Token を作成する方法のサンプルです。

```sh
cd server/nodejs/use-jsonwebtoken-package
npm install
npm start
```

**設定方法:**
- index.jsファイルをテキストエディタで開く
- `appId` と `secretKey` の各変数の値を自身のApp ID、Secret Keyに書き換える
- ファイルを保存してサーバーを起動

#### 共通仕様
両サンプルとも以下の仕様で動作します：
- **エンドポイント:** POST `/authenticate`
- **サーバーポート:** 8080

## クライアントアプリケーション

サーバーアプリケーションにリクエストを行い、認証情報を取得するWebアプリケーションです。
### 起動方法

clientディレクトリに移動し、http-serverを使用してポート3000でホスティングします。

```sh
cd client
npx http-server -p 3000
```

起動後、ブラウザから `http://localhost:3000` にアクセスしてください。

### 対応サーバー

クライアントアプリケーションは以下のサンプルサーバーに対応しています：
- **Node.jsサーバー**
  - **use-jsonwebtoken-package サンプル**
  - **use-token-package サンプル**

- 接続先: `http://localhost:8080/authenticate` (POST)
- 認証: 固定のsessionToken `'4CXS0f19nvMJBYK05o3toTWtZF5Lfd2t6Ikr2lID'`

すべてのサンプルサーバーは同じエンドポイントとリクエスト形式を使用しているため、どのサーバーでもクライアントアプリケーションをそのまま使用できます。

### 操作方法

1. いずれかのサーバーを起動してください
2. Room Name、Member Nameのテキストボックスに文字列を入力します
3. Get credentialボタンを押下します
4. 認証情報の取得に成功すると、結果がCredentialのエリアにJSON形式で出力されます
    - `authToken`がアプリケーションからSkyWayを利用する際に必要となります
5. Copy authToken to clipboardボタンを押下することで、クリップボードに `authToken`がコピーされます

### 留意事項
サンプルコードでは、ユーザー認証を模擬するため、固定文字列'4CXS0f19nvMJBYK05o3toTWtZF5Lfd2t6Ikr2lID' によるtoken認証を実装しています。
アプリケーションのユーザー認証の実装に合わせて適宜変更をお願いします。

### スクリーンショット

![クライアントアプリケーションのスクリーンショット](./docs/img/screen-shot.png)

## 公開リポジトリの運用方針について

このリポジトリは公開用のミラーリポジトリであり、こちらで開発は行いません。

### Issue / Pull Request

受け付けておりません。

Enterpriseプランをご契約のお客様はテクニカルサポートをご利用ください。
詳しくは[SkyWayサポート](https://support.skyway.ntt.com/hc/ja)をご確認ください。
