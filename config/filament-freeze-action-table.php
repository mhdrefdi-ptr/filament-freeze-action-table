<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Global Default
    |--------------------------------------------------------------------------
    |
    | When true, every Filament table will have freezeActionColumn(true) by
    | default. You can still override per-table with ->freezeActionColumn(false).
    |
    */
    'enabled_by_default' => true,

    /*
    |--------------------------------------------------------------------------
    | Stacking Context
    |--------------------------------------------------------------------------
    */
    'z_index_body' => 15,
    'z_index_header' => 16,

    /*
    |--------------------------------------------------------------------------
    | Sticky Shadow
    |--------------------------------------------------------------------------
    */
    'shadow_enabled' => true,
    'shadow_light' => '-2px 0 4px -2px rgba(0, 0, 0, 0.22)',
    'shadow_dark' => '-2px 0 4px -2px rgba(255, 255, 255, 0.26)',

    /*
    |--------------------------------------------------------------------------
    | Dark Hover Blend
    |--------------------------------------------------------------------------
    |
    | Used to avoid transparent look while preserving Filament dark hover feel.
    | Value is white mix percentage (0..100).
    |
    */
    'dark_hover_mix_percent' => 5,
];
