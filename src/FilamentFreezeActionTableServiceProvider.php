<?php

namespace Mhdrefdi\FilamentFreezeActionTable;

use Filament\Support\Assets\Css;
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Filament\Tables\Table;
use Illuminate\Support\ServiceProvider;
use Mhdrefdi\FilamentFreezeActionTable\Support\FreezeActionTable;

class FilamentFreezeActionTableServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../config/filament-freeze-action-table.php',
            'filament-freeze-action-table',
        );
    }

    public function boot(): void
    {
        $this->registerPublishing();
        $this->registerTableMacro();
        $this->configureTablesGlobally();
        $this->registerAssets();
    }

    protected function registerPublishing(): void
    {
        if (! $this->app->runningInConsole()) {
            return;
        }

        $this->publishes([
            __DIR__ . '/../config/filament-freeze-action-table.php' => config_path('filament-freeze-action-table.php'),
        ], 'filament-freeze-action-table-config');
    }

    protected function registerTableMacro(): void
    {
        if (Table::hasMacro('freezeActionColumn')) {
            return;
        }

        Table::macro('freezeActionColumn', function (bool $condition = true): Table {
            return FreezeActionTable::make($this, $condition);
        });
    }

    protected function configureTablesGlobally(): void
    {
        $isEnabledByDefault = (bool) config('filament-freeze-action-table.enabled_by_default', true);

        Table::configureUsing(function (Table $table) use ($isEnabledByDefault): void {
            if (method_exists($table, 'freezeActionColumn')) {
                $table->freezeActionColumn($isEnabledByDefault);
            }
        });
    }

    protected function registerAssets(): void
    {
        $shadowEnabled = (bool) config('filament-freeze-action-table.shadow_enabled', true);
        $darkHoverMixPercent = (int) config('filament-freeze-action-table.dark_hover_mix_percent', 5);
        $darkHoverMixPercent = max(0, min(100, $darkHoverMixPercent));

        FilamentAsset::register([
            Css::make('freeze-action-column', __DIR__ . '/../resources/dist/freeze-action-column.css'),
            Js::make('freeze-action-column', __DIR__ . '/../resources/dist/freeze-action-column.js'),
        ], 'mhdrefdi-ptr/filament-freeze-action-table');

        FilamentAsset::registerCssVariables([
            'fft-z-index-body' => (string) config('filament-freeze-action-table.z_index_body', 15),
            'fft-z-index-header' => (string) config('filament-freeze-action-table.z_index_header', 16),
            'fft-shadow-light' => config('filament-freeze-action-table.shadow_light', '-2px 0 4px -2px rgba(0, 0, 0, 0.22)'),
            'fft-shadow-dark' => config('filament-freeze-action-table.shadow_dark', '-2px 0 4px -2px rgba(255, 255, 255, 0.26)'),
            'fft-dark-hover-base-pct' => (100 - $darkHoverMixPercent) . '%',
            'fft-dark-hover-accent-pct' => $darkHoverMixPercent . '%',
        ], 'mhdrefdi-ptr/filament-freeze-action-table');

        FilamentAsset::registerScriptData([
            'fftFreezeActionTable' => [
                'enabledByDefault' => (bool) config('filament-freeze-action-table.enabled_by_default', true),
                'shadowEnabled' => $shadowEnabled,
            ],
        ], 'mhdrefdi-ptr/filament-freeze-action-table');
    }
}
