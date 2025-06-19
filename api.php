<?php
// Отобразить ошибки
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
if (!array_key_exists("uclick", $_COOKIE)) {
    setrawcookie("uclick", "", strtotime("+1 year"));
}

// Change domain to IP tracker when using Cloudflare (For example: http://122.232.40.207/click)
const TRACKER_URL_TEMPLATE = "https://hatetrfc.space/click";
const CAMPAIGN_KEY = "6a7bc98dd7828a009673";
const API_KEY = "1d11c31294abd7df0b94b48cdd5229a3041e0fd29ed397e95172cf63189e51de";

final class BinomClickAPI
{
    private array $clickInfo;
    private string $landingHTMLContent;
    private array $response;

    public function __construct()
    {
        $this->clickInfo = [];
        $this->landingHTMLContent = "";
        $this->response = [];
    }

    public function sendBaseClick(string $campaignKey = ""): void
    {
        $trackerUrl = "";
        if ("" !== $campaignKey) {
            $trackerUrl = sprintf("%s?key=%s&api_key=%s", TRACKER_URL_TEMPLATE, $campaignKey, API_KEY);
        }

        if ("" !== CAMPAIGN_KEY && "" === $trackerUrl) {
            $trackerUrl = sprintf("%s?key=%s&api_key=%s", TRACKER_URL_TEMPLATE, CAMPAIGN_KEY, API_KEY);
        }

        if (isset($_GET)) {
            foreach ($_GET as $key => $value) {
                $trackerUrl .= sprintf("&%s=%s", (string) $key, urlencode((string) $value));
            }
        }

        $headers = [];

        foreach ($_SERVER as $key => $value) {
            if (strpos($key, "HTTP_") === 0 && $key !== "HTTP_HOST") {
                $key = str_replace(" ", "-", ucwords(str_replace("_", " ", strtolower(substr($key, 5)))));

                $headers[$key] = "$key: $value";
            }
        }

        if (array_key_exists("REMOTE_ADDR", $_SERVER)) {
            $remoteAddr = $_SERVER["REMOTE_ADDR"];
            $headers["X-Forwarded-For"] = "X-Forwarded-For: $remoteAddr";
        }

        if (array_key_exists("HTTP_CF_CONNECTING_IP", $_SERVER)) {
            $connectingIp = $_SERVER["HTTP_CF_CONNECTING_IP"];
            $headers["X-Forwarded-For"] = "X-Forwarded-For: $connectingIp";
        }

        $ch = curl_init();

        $uclickCookie = "";
        if (array_key_exists("uclick", $_COOKIE)) {
            $value = $_COOKIE["uclick"];
            $uclickCookie = "uclick=$value;";
        }

        curl_setopt($ch, CURLOPT_URL, $trackerUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_COOKIE, $uclickCookie);

        $result = curl_exec($ch);

        if ($err = curl_errno($ch)) {
            $message = curl_strerror($err);

            $this->clickInfo = [];
            $this->landingHTMLContent = "";
            $this->response = [
                "status" => "error",
                "message" => (string) $message,
            ];

            return;
        }

        curl_close($ch);

        $body = json_decode($result, true, 512, JSON_THROW_ON_ERROR);

        $this->clickInfo = $body["click_info"];
        $this->clickInfo["landing_link"] = $body["url"];

        if ("DIRECT" === $body["content"]) {
            $this->clickInfo["landing_link"] = "DIRECT";
            $this->clickInfo["offer_link"] = $body["url"];
        }

        setrawcookie("uclick", $body["uclick_value"], strtotime("+1 year"));

        $this->landingHTMLContent = $body["content"];
        $this->response = [
            "status" => "success",
            "message" => "",
        ];
    }

    public function setLPClick($clickId)
    {
        if ("" === $clickId) {
            return false;
        }

        $trackerUrl = sprintf("%s?lp=1&api_key=%s&bcid=%s", TRACKER_URL_TEMPLATE, API_KEY, $clickId);

        if (isset($_GET)) {
            foreach ($_GET as $key => $value) {
                $trackerUrl .= sprintf("&%s=%s", (string) $key, (string) $value);
            }
        }

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $trackerUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);

        $result = curl_exec($ch);

        if ($err = curl_errno($ch)) {
            $message = curl_strerror($err);

            $this->clickInfo = [];
            $this->landingHTMLContent = "";
            $this->response = [
                "status" => "error",
                "message" => (string) $message,
            ];

            return false;
        }

        curl_close($ch);

        // Если не будет кампании то будет ошибка!!!
        $body = json_decode($result, true, 512, JSON_THROW_ON_ERROR);

        $this->clickInfo = $body["click_info"];
        $this->clickInfo["offer_link"] = $body["url"];
        $this->landingHTMLContent = "";
        $this->response = [
            "status" => "success",
            "message" => "",
        ];
        
        return $body;
    }

    public function loadLanding(): void
    {
        if ("" !== $this->landingHTMLContent) {
            echo $this->landingHTMLContent;

            return;
        }

        if (0 === (int) $this->clickInfo["landing_id"]) {
            echo "DIRECT";

            return;
        }

        echo file_get_contents($this->getLandingUrl());
    }

    public function getRedirectURL(): string
    {
        $url = "";

        if (array_key_exists("id", $this->clickInfo)) {
            $url = sprintf("%s?lp=1&bcid=%s", TRACKER_URL_TEMPLATE, $this->clickInfo["id"]);
        }

        return $url;
    }

    public function getClickInfo(): array
    {
        return $this->clickInfo;
    }

    public function getLandingUrl(): string
    {
        if (array_key_exists("landing_link", $this->clickInfo)) {
            return $this->clickInfo["landing_link"];
        }

        return "Unknown";
    }

    public function getOfferUrl(): string
    {
        if (array_key_exists("offer_link", $this->clickInfo)) {
            return $this->clickInfo["offer_link"];
        }

        return "Unknown";
    }

    public function getResponse(): array
    {
        return $this->response;
    }
}

$binomClickAPI = new BinomClickAPI();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST["action"] ?? "";
    $clid = $_POST["clid"] ?? null;

    if ($action === "setLPClick" && $clid) {
        
        $res = $binomClickAPI->setLPClick($clid);
        
        if ($res !== false) {
        if(isset($res['click_info']) && isset($res['click_info']['offer_link']))
            echo $res['click_info']['offer_link'];
            exit;
        }
        echo 'error';
        exit;
    }
}

?>