<?php
use Google\CloudFunctions\FunctionsFramework;
use Psr\Http\Message\ServerRequestInterface;
use Firebase\JWT\JWT;
use Ramsey\Uuid\Uuid;
require 'vendor/autoload.php';

// load environment variables from .env file
// - createImmutable() prevents overriding existing environment variables
// - safeLoad() continues execution even if .env file doesn't exist
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

// should set your appId and secret key in `environment variable` or in `.env file`
$appId = getenv('APP_ID') ?: $_ENV['APP_ID'] ?: 'YourAppId (Deprecated)';
$secretKey = getenv('SECRET_KEY') ?: $_ENV['SECRET_KEY'] ?: 'YourSecretKey (Deprecated)';
$validFixedSessionToken = getenv('VALID_FIXED_SESSION_TOKEN') ?: $_ENV['VALID_FIXED_SESSION_TOKEN'] ?: 'YourValidFixedSessionToken (Deprecated)';

function authenticate($request) {
    global $validFixedSessionToken;

    $roomName = $request['roomName'] ?? null;
    $memberName = $request['memberName'] ?? null;
    $sessionToken = $request['sessionToken'] ?? null;

    if ($roomName === null || $memberName === null || $sessionToken === null) {
        http_response_code(400);
        echo 'Bad Request';
        return;
    }

    // Check the sessionToken for your app.
    if ($sessionToken !== $validFixedSessionToken) {
        http_response_code(401);
        echo 'Authentication Failed';
        return;
    }

    $iat = time();
    $exp = $iat + 36000; // 10h

    $credential = [
        'roomName' => $roomName,
        'memberName' => $memberName,
        'iat' => $iat,
        'exp' => $exp,
        'authToken' => calculateAuthToken($roomName, $memberName, $iat, $exp)
    ];

    return json_encode($credential);
}

function calculateAuthToken($roomName, $memberName, $iat, $exp) {
    global $appId, $secretKey;

    $payload = [
        'jti' => Uuid::uuid4()->toString(),
        'iat' => $iat,
        'exp' => $exp,
        'version' => 3,
        'scope' => [
            'appId' => $appId,
            'turn' => [
                'enabled' => true
            ],
            'analytics' => [
                'enabled' => true
            ],
            'rooms' => [
                [
                    'id' => '*',
                    'name' => $roomName,
                    'methods' => ['create', 'close', 'updateMetadata'],
                    'sfu' => [
                        'enabled' => true,
                        'maxSubscribersLimit' => 99
                    ],
                    'member' => [
                        'id' => '*',
                        'name' => $memberName,
                        'methods' => ['publish', 'subscribe', 'updateMetadata']
                    ]
                ]
            ]
        ]
    ];

    return JWT::encode($payload, $secretKey, 'HS256');
}

// Register the function with Functions Framework.
// This enables omitting the `FUNCTIONS_SIGNATURE_TYPE=http` environment
// variable when deploying. The `FUNCTION_TARGET` environment variable should
// match the first parameter.
FunctionsFramework::http('main', 'main');

function main(ServerRequestInterface $request): string
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

    $requestMethod = $_SERVER['REQUEST_METHOD'];
    $requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    if ($requestPath === '/authenticate' && $requestMethod === 'POST') {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if ($contentType === 'application/json') {
            $requestBody = file_get_contents('php://input');
            $request = json_decode($requestBody, true);
        } else {
            $request = $_POST;
        }

        return authenticate($request);
    }

    if ($requestMethod === 'OPTIONS') {
        // Preflight request
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        http_response_code(204);
        return '';
    }

    http_response_code(404);
    return 'Not Found';
}
?>
