# SkyWay Authentication Server Samples (Node.js)

このディレクトリには、SkyWayの認証サーバーを実装する2つの異なるアプローチのサンプルが含まれています。

## 実装方法の比較

### 1. `use-jsonwebtoken-package` - jsonwebtokenを使用
- `jsonwebtoken`パッケージを直接使用してJWTトークンを生成
- JWTの構造やSkyWayのトークン仕様を手動で実装

### 2. `use-token-package` - @skyway-sdk/tokenを使用
- SkyWay公式の`@skyway-sdk/token`パッケージを使用
- SkyWayのトークン仕様に特化した専用ライブラリ
- **より簡単な実装が可能**

## 実装の違いの例

### jsonwebtoken (`use-jsonwebtoken-package`)

```javascript
const jwt = require('jsonwebtoken');

const calculateAuthToken = (roomName, memberName, iat, exp) => {
  return jwt.sign({
    jti: crypto.randomUUID(),
    iat: iat,
    exp: exp,
    version: 3,
    scope: {
      // スコープ設定を手動で記述...
    }
  }, secretKey);
};
```

### @skyway-sdk/token (`use-token-package`)

```javascript
const {SkyWayAuthToken} = require("@skyway-sdk/token");

const calculateAuthToken = (roomName, memberName, iat, exp) => {
  return new SkyWayAuthToken({
    jti: crypto.randomUUID(),
    iat: iat,
    exp: exp,
    version: 3,
    scope: {
      // 同じスコープ設定だが、型安全性が提供される
    }
  }).encode(secretKey);
};
```

## 使い方

どちらのサンプルも同じAPIを提供します：

```bash
# use-jsonwebtoken-package の場合
cd use-jsonwebtoken-package
npm install
npm start

# use-token-package の場合
cd use-token-package
npm install
npm start
```

サーバーが起動したら、以下のエンドポイントにPOSTリクエストを送信：

```
POST http://localhost:8080/authenticate
Content-Type: application/json

{
  "roomName": "your-room-name",
  "memberName": "your-member-name",
  "sessionToken": "4CXS0f19nvMJBYK05o3toTWtZF5Lfd2t6Ikr2lID"
}
```
