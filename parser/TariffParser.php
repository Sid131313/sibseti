<?php
declare(strict_types=1);

final class TariffParser
{
    public function __construct(private array $config) {}

    public function fetch(string $url): array
    {
        $curl = curl_init($url);
        curl_setopt_array($curl, [CURLOPT_RETURNTRANSFER => true, CURLOPT_FOLLOWLOCATION => true, CURLOPT_CONNECTTIMEOUT => $this->config['http']['connect_timeout'], CURLOPT_TIMEOUT => $this->config['http']['timeout'], CURLOPT_USERAGENT => $this->config['http']['user_agent'], CURLOPT_ENCODING => '']);
        $body = curl_exec($curl);
        $error = curl_error($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        curl_close($curl);
        if (!is_string($body) || $status < 200 || $status >= 300) throw new RuntimeException($error ?: "HTTP $status");
        return ['body' => $body, 'status' => $status];
    }

    public function parse(string $html, string $city, string $url): array
    {
        libxml_use_internal_errors(true);
        $document = new DOMDocument('1.0', 'UTF-8');
        $document->loadHTML('<?xml encoding="utf-8" ?>' . $html, LIBXML_NOWARNING | LIBXML_NOERROR);
        $xpath = new DOMXPath($document);
        $headings = $xpath->query('//h1|//h2|//h3|//h4|//h5|//h6');
        $tariffs = []; $category = 'other'; $sort = 10;
        foreach ($headings as $heading) {
            $headingText = $this->text($heading);
            $normalized = $this->category($headingText);
            if ($normalized !== null) { $category = $normalized; continue; }
            $container = $this->cardContainer($heading);
            if (!$container) continue;
            $cardText = $this->text($container);
            $tariff = $this->extract($headingText, $cardText, $city, $category, $url, $sort);
            if ($tariff) { $tariffs[$tariff['id']] = $tariff; $sort += 10; }
        }
        return array_values($tariffs);
    }

    private function cardContainer(DOMNode $node): ?DOMNode
    {
        for ($parent = $node->parentNode; $parent && $parent->nodeType === XML_ELEMENT_NODE; $parent = $parent->parentNode) {
            $text = $this->text($parent);
            if (preg_match('/\b\d+[\s ]*₽/u', $text) && preg_match('/Мбит\/с/u', $text)) return $parent;
        }
        return null;
    }

    private function extract(string $name, string $text, string $city, string $category, string $url, int $sort): ?array
    {
        if ($name === '' || !preg_match('/(\d+[\s ]*)₽/u', $text, $price)) return null;
        preg_match('/(\d+)\s*Мбит\/с/u', $text, $speed);
        preg_match('/(\d+)\s*канал/u', $text, $tv);
        preg_match('/Подключение\s*(\d+[\s ]*)\s*₽/u', $text, $connection);
        preg_match('/((?:Wi-?Fi|Вай-?Фай)[^\n,;]*)/ui', $text, $router);
        $id = $city . '-' . $category . '-' . $this->slug($name);
        return ['id' => $id, 'city' => $city, 'category' => $category, 'name' => $name, 'speed' => isset($speed[1]) ? (int)$speed[1] : null, 'tv_channels' => isset($tv[1]) ? (int)$tv[1] : null, 'price' => $this->number($price[1]), 'old_price' => null, 'connection_price' => isset($connection[1]) ? $this->number($connection[1]) : null, 'router' => isset($router[1]) ? trim($router[1]) : null, 'description' => '', 'features' => [], 'source_url' => $url, 'source_key' => '', 'source_active' => true, 'active' => true, 'sort' => $sort, 'updated_at' => gmdate('c')];
    }

    private function category(string $heading): ?string
    {
        $heading = mb_strtolower($heading, 'UTF-8');
        if (str_contains($heading, 'интернет') && (str_contains($heading, 'тв') || str_contains($heading, 'телевид'))) return 'internet_tv';
        if (str_contains($heading, 'домашний интернет')) return 'internet';
        if (str_contains($heading, 'цифров') && str_contains($heading, 'тв')) return 'other';
        return null;
    }
    private function text(DOMNode $node): string { return trim(preg_replace('/\s+/u', ' ', $node->textContent ?? '')); }
    private function number(string $value): int { return (int)preg_replace('/\D/u', '', $value); }
    private function slug(string $text): string
    {
        $map = ['а'=>'a','б'=>'b','в'=>'v','г'=>'g','д'=>'d','е'=>'e','ё'=>'e','ж'=>'zh','з'=>'z','и'=>'i','й'=>'y','к'=>'k','л'=>'l','м'=>'m','н'=>'n','о'=>'o','п'=>'p','р'=>'r','с'=>'s','т'=>'t','у'=>'u','ф'=>'f','х'=>'h','ц'=>'ts','ч'=>'ch','ш'=>'sh','щ'=>'sch','ъ'=>'','ы'=>'y','ь'=>'','э'=>'e','ю'=>'yu','я'=>'ya'];
        $text = mb_strtolower($text, 'UTF-8'); $text = strtr($text, $map); $text = preg_replace('/[^a-z0-9]+/', '-', $text); return trim($text, '-');
    }
}
