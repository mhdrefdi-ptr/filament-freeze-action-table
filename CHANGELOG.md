# Changelog

## Unreleased

### Added

- Filament panel plugin class: `FilamentFreezeActionTablePlugin`.
- Panel-level fluent configuration:
  - `enabledByDefault()`
  - `zIndexBody()`
  - `zIndexHeader()`
  - `shadowEnabled()`
  - `shadowLight()`
  - `shadowDark()`
  - `darkHoverMixPercent()`
- Publishable config file: `config/filament-freeze-action-table.php`.
- IDE helper file for macro autocomplete (`freezeActionColumn`).

### Changed

- Frontend injection moved from render hook to Filament assets (`FilamentAsset::register`).
- Sticky styles now support runtime CSS variable overrides for z-index, shadow, and dark hover blend.

### Migration Notes

1. Run `php artisan filament:assets` after updating.
2. Clear caches (`php artisan optimize:clear`) if old behavior persists.
3. Optional: register plugin in your `PanelProvider` for per-panel overrides.
