# Filament Freeze Action Table

Keep Filament table action columns sticky on the right during horizontal scrolling.

Supports Filament `^4.0`.

## Installation

```bash
composer require mhdrefdi-ptr/filament-freeze-action-table
php artisan filament:assets
```

## Quick Start (Recommended)

Register the plugin in your panel provider:

```php
use Filament\Panel;
use Mhdrefdi\FilamentFreezeActionTable\FilamentFreezeActionTablePlugin;

public function panel(Panel $panel): Panel
{
    return $panel
        ->plugin(
            FilamentFreezeActionTablePlugin::make()
                ->enabledByDefault(true)
        );
}
```

## Plugin Configuration

Available fluent methods:

- `enabledByDefault(bool $condition = true)`
- `zIndexBody(int $value)`
- `zIndexHeader(int $value)`
- `shadowEnabled(bool $condition = true)`
- `shadowLight(string $value)`
- `shadowDark(string $value)`
- `darkHoverMixPercent(int $value)`

Example:

```php
->plugin(
    FilamentFreezeActionTablePlugin::make()
        ->enabledByDefault(true)
        ->zIndexBody(15)
        ->zIndexHeader(16)
        ->shadowEnabled(true)
        ->darkHoverMixPercent(5)
)
```

### Multi-panel behavior

- `Table::configureUsing()` is guarded per panel ID (no duplicate registrations).
- Defaults are applied only when the current panel matches that plugin's panel.

## Per-table Override

```php
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->freezeActionColumn(false); // disable for this table
}
```

Enable explicitly:

```php
return $table->freezeActionColumn(true);
```

## Optional Config File

If you prefer config-file driven setup:

```bash
php artisan vendor:publish --tag=filament-freeze-action-table-config
```

Available keys in `config/filament-freeze-action-table.php`:

- `enabled_by_default`
- `z_index_body`
- `z_index_header`
- `shadow_enabled`
- `shadow_light`
- `shadow_dark`
- `dark_hover_mix_percent`

## How It Works

- Frontend behavior is loaded via Filament assets (`FilamentAsset::register`), not inline render hooks.
- Action column is detected from action triggers in the row.
- Shadow appears only when horizontal overflow exists.

## Testing

Browser spec:

- `tests/browser/freeze-action-column.spec.ts`

Run:

```bash
npx playwright install chromium
npx playwright test packages/mhdrefdi-ptr/filament-freeze-action-table/tests/browser/freeze-action-column.spec.ts
```

Optional env URLs:

- `FFT_TEST_URL` (default: `http://127.0.0.1:8000/admin/users`)
- `FFT_TEST_URL_WIDE` (default: `http://127.0.0.1:8000/admin/users-wide`)

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
