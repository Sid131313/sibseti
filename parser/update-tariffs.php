<?php
declare(strict_types=1);
set_time_limit(0);

$config = require __DIR__ . '/config.php';
require __DIR__ . '/TariffParser.php';

foreach ($config['paths'] as $path) { if (str_ends_with($path, '.log') || str_ends_with($path, '.lock')) continue; if (!is_dir($path)) mkdir($path, 0775, true); }
$lock = fopen($config['paths']['lock'], 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) { fwrite(STDERR, "Tariff update is already running.\n"); exit(1); }

function readJson(string $path, array $fallback = []): array { if (!is_file($path)) return $fallback; $data = json_decode((string)file_get_contents($path), true); return is_array($data) ? $data : $fallback; }
function writeJson(string $path, array $data): void { $tmp = $path . '.tmp.' . getmypid(); $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR); file_put_contents($tmp, $json . PHP_EOL, LOCK_EX); rename($tmp, $path); }
function logEvent(array $config, array $event): void { file_put_contents($config['paths']['log'], json_encode(['time' => gmdate('c')] + $event, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX); }
function backup(array $config, string $city, string $path): void { if (!is_file($path)) return; copy($path, $config['paths']['backups'] . '/' . $city . '-' . gmdate('Ymd-His') . '.json'); $files = glob($config['paths']['backups'] . '/' . $city . '-*.json') ?: []; rsort($files); foreach (array_slice($files, $config['validation']['backup_count']) as $old) unlink($old); }
function mergeTariffs(array $auto, array $old, array $overrides, array $manual): array {
    $previous = []; foreach ($old as $tariff) $previous[$tariff['id']] = $tariff;
    $merged = [];
    foreach ($auto as $tariff) {
        $id = $tariff['id'];
        if (isset($previous[$id]) && (($previous[$id]['manual_lock'] ?? false) === true)) $tariff = $previous[$id];
        $tariff = array_replace($tariff, $overrides[$id] ?? []); unset($tariff['manual_lock']); $merged[$id] = $tariff; unset($previous[$id]);
    }
    foreach ($previous as $id => $tariff) { if (isset($overrides[$id]) || ($tariff['manual_lock'] ?? false)) { $tariff['source_active'] = false; $tariff = array_replace($tariff, $overrides[$id] ?? []); $merged[$id] = $tariff; } }
    foreach ($manual as $tariff) if (!empty($tariff['id'])) $merged[$tariff['id']] = array_replace(['source' => 'manual', 'source_active' => true, 'active' => true], $tariff);
    $merged = array_values(array_filter($merged, fn($tariff) => ($tariff['active'] ?? true) === true));
    usort($merged, fn($a, $b) => (($a['sort'] ?? PHP_INT_MAX) <=> ($b['sort'] ?? PHP_INT_MAX)) ?: strcmp($a['name'], $b['name'])); return $merged;
}

$parser = new TariffParser($config); $summary = [];
foreach ($config['cities'] as $city => $definition) {
    $url = $definition['source'] ?? 'https://sibsetipro.ru/' . $city . '/'; $started = microtime(true); $status = ['last_attempt' => gmdate('c'), 'last_success' => null, 'status' => 'error', 'tariffs_found' => 0];
    $finalPath = $config['paths']['final'] . '/' . $city . '.json'; $old = readJson($finalPath); $warnings = [];
    try {
        $response = $parser->fetch($url); $auto = $parser->parse($response['body'], $city, $url); $status['tariffs_found'] = count($auto);
        if (!$auto) throw new RuntimeException('No tariffs found; previous snapshot kept.');
        foreach ($auto as $tariff) if ($tariff['category'] === 'other') $warnings[] = 'Unknown tariff category: ' . $tariff['name'];
        foreach ($auto as $tariff) if ($tariff['price'] < $config['validation']['min_price'] || $tariff['price'] > $config['validation']['max_price'] || ($tariff['speed'] !== null && $tariff['speed'] > $config['validation']['max_speed'])) throw new RuntimeException('Invalid tariff values; previous snapshot kept.');
        if ($old && count($auto) / max(1, count($old)) < $config['validation']['min_count_ratio']) $warnings[] = 'Tariff count dropped sharply.';
        $oldById = []; foreach ($old as $tariff) $oldById[$tariff['id']] = $tariff;
        foreach ($auto as $tariff) if (isset($oldById[$tariff['id']]['price']) && max($tariff['price'], 1) / max($oldById[$tariff['id']]['price'], 1) > $config['validation']['price_change_ratio']) $warnings[] = 'Large price change: ' . $tariff['id'];
        writeJson($config['paths']['source'] . '/' . $city . '.json', $auto);
        $overrides = readJson($config['paths']['overrides'] . '/' . $city . '.json'); $manual = readJson($config['paths']['manual'] . '/' . $city . '.json');
        $final = mergeTariffs($auto, $old, $overrides, $manual); backup($config, $city, $finalPath); writeJson($finalPath, $final);
        $status['last_success'] = gmdate('c'); $status['status'] = 'success'; $status['tariffs_saved'] = count($final); $status['warnings'] = $warnings;
        logEvent($config, ['city' => $city, 'url' => $url, 'http_status' => $response['status'], 'found' => count($auto), 'saved' => count($final), 'warnings' => $warnings, 'duration_ms' => (int)((microtime(true) - $started) * 1000)]);
        $summary[] = "$city: " . count($final) . ' saved';
    } catch (Throwable $error) {
        $status['error'] = $error->getMessage(); writeJson($config['paths']['status'] . '/' . $city . '.json', $status);
        logEvent($config, ['city' => $city, 'url' => $url, 'http_status' => $response['status'] ?? 0, 'found' => $status['tariffs_found'], 'saved' => count($old), 'error' => $error->getMessage(), 'duration_ms' => (int)((microtime(true) - $started) * 1000)]);
        $summary[] = "$city: error ({$error->getMessage()})";
    }
    writeJson($config['paths']['status'] . '/' . $city . '.json', $status); usleep($config['http']['city_delay_us']);
}
flock($lock, LOCK_UN); fclose($lock); echo implode(PHP_EOL, $summary) . PHP_EOL;
