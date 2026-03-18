<?php

declare(strict_types=1);

namespace Mhdrefdi\FilamentFreezeActionTable;

use Filament\Contracts\Plugin;
use Filament\Facades\Filament;
use Filament\Panel;
use Filament\Support\Facades\FilamentAsset;
use Filament\Tables\Table;

class FilamentFreezeActionTablePlugin implements Plugin
{
    /**
     * @var array<string, bool>
     */
    protected static array $registeredTableConfigureHooks = [];

    protected ?bool $enabledByDefault = null;

    protected ?int $zIndexBody = null;

    protected ?int $zIndexHeader = null;

    protected ?bool $shadowEnabled = null;

    protected ?string $shadowLight = null;

    protected ?string $shadowDark = null;

    protected ?int $darkHoverMixPercent = null;

    public static function make(): static
    {
        return new static;
    }

    public function enabledByDefault(bool $condition = true): static
    {
        $this->enabledByDefault = $condition;

        return $this;
    }

    public function zIndexBody(int $value): static
    {
        $this->zIndexBody = $value;

        return $this;
    }

    public function zIndexHeader(int $value): static
    {
        $this->zIndexHeader = $value;

        return $this;
    }

    public function shadowEnabled(bool $condition = true): static
    {
        $this->shadowEnabled = $condition;

        return $this;
    }

    public function shadowLight(string $value): static
    {
        $this->shadowLight = $value;

        return $this;
    }

    public function shadowDark(string $value): static
    {
        $this->shadowDark = $value;

        return $this;
    }

    public function darkHoverMixPercent(int $value): static
    {
        $this->darkHoverMixPercent = max(0, min(100, $value));

        return $this;
    }

    public function getId(): string
    {
        return 'mhdrefdi-ptr/filament-freeze-action-table';
    }

    public function register(Panel $panel): void
    {
        // Registered globally in the package service provider.
    }

    public function boot(Panel $panel): void
    {
        $panelId = $panel->getId();
        $enabledByDefault = $this->enabledByDefault ?? (bool) config('filament-freeze-action-table.enabled_by_default', true);
        $shadowEnabled = $this->shadowEnabled ?? (bool) config('filament-freeze-action-table.shadow_enabled', true);
        $darkHoverMixPercent = $this->darkHoverMixPercent ?? (int) config('filament-freeze-action-table.dark_hover_mix_percent', 5);
        $darkHoverMixPercent = max(0, min(100, $darkHoverMixPercent));

        FilamentAsset::registerCssVariables([
            'fft-z-index-body' => (string) ($this->zIndexBody ?? (int) config('filament-freeze-action-table.z_index_body', 15)),
            'fft-z-index-header' => (string) ($this->zIndexHeader ?? (int) config('filament-freeze-action-table.z_index_header', 16)),
            'fft-shadow-light' => $this->shadowLight ?? (string) config('filament-freeze-action-table.shadow_light', '-2px 0 4px -2px rgba(0, 0, 0, 0.22)'),
            'fft-shadow-dark' => $this->shadowDark ?? (string) config('filament-freeze-action-table.shadow_dark', '-2px 0 4px -2px rgba(255, 255, 255, 0.26)'),
            'fft-dark-hover-base-pct' => (100 - $darkHoverMixPercent) . '%',
            'fft-dark-hover-accent-pct' => $darkHoverMixPercent . '%',
        ], $this->getId());

        FilamentAsset::registerScriptData([
            'fftFreezeActionTable' => [
                'enabledByDefault' => $enabledByDefault,
                'shadowEnabled' => $shadowEnabled,
            ],
        ], $this->getId());

        if (isset(static::$registeredTableConfigureHooks[$panelId])) {
            return;
        }

        static::$registeredTableConfigureHooks[$panelId] = true;

        Table::configureUsing(function (Table $table) use ($enabledByDefault, $panelId): void {
            $currentPanel = Filament::getCurrentPanel();

            if ((! $currentPanel) || ($currentPanel->getId() !== $panelId)) {
                return;
            }

            if (! method_exists($table, 'freezeActionColumn')) {
                return;
            }

            $table->freezeActionColumn($enabledByDefault);
        });
    }
}
