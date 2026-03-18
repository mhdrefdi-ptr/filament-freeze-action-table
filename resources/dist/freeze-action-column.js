(function () {
    const TABLE_SELECTOR = '.fi-ta table, .fi-table table, table.fi-ta-table';
    const CONFIG = {
        enabledByDefault: true,
        shadowEnabled: true,
        ...((window.filamentData && window.filamentData.fftFreezeActionTable) || {}),
    };

    function hasActionTrigger(cell) {
        if (!cell) {
            return false;
        }

        const selectors = [
            '[wire\\:click*="mountTableAction"]',
            '[x-on\\:click*="mountTableAction"]',
            '[class*="fi-ta-action"]',
            '[data-table-action]',
            '[data-action-id]',
        ];

        return selectors.some((selector) => cell.querySelector(selector));
    }

    function resolveActionColumnIndex(table) {
        const firstRow = table.querySelector('tbody tr');

        if (!firstRow) {
            return null;
        }

        const cells = Array.from(firstRow.children);

        for (let index = cells.length - 1; index >= 0; index--) {
            if (hasActionTrigger(cells[index])) {
                return index;
            }
        }

        return null;
    }

    function shouldFreeze(table) {
        const explicitOnTable = table.getAttribute('data-freeze-action-column')
            ?? table.closest('[data-freeze-action-column]')?.getAttribute('data-freeze-action-column');

        if (explicitOnTable === 'false') {
            return false;
        }

        if (explicitOnTable === 'true') {
            return true;
        }

        const explicitOnAction = table.querySelector('[data-freeze-action-column="false"]')
            ? 'false'
            : (table.querySelector('[data-freeze-action-column="true"]') ? 'true' : null);

        const explicit = explicitOnAction;

        if (explicit === 'false') {
            return false;
        }

        if (explicit === 'true') {
            return true;
        }

        return CONFIG.enabledByDefault;
    }

    function applyFreeze(table) {
        table.querySelectorAll('.fft-freeze-action-col').forEach((element) => {
            element.classList.remove('fft-freeze-action-col');
            element.classList.remove('fft-freeze-shadow');
            element.style.removeProperty('--fft-cell-bg');
        });

        if (!shouldFreeze(table)) {
            return;
        }

        const actionColumnIndex = resolveActionColumnIndex(table);

        if (actionColumnIndex === null) {
            return;
        }

        function findHorizontalScrollContainer() {
            let current = table.parentElement;

            while (current && current !== document.body) {
                const styles = getComputedStyle(current);
                const overflowX = styles.overflowX || styles.overflow;
                const canScrollX = /auto|scroll|overlay/.test(overflowX);

                if (canScrollX) {
                    return current;
                }

                current = current.parentElement;
            }

            return null;
        }

        function isTransparent(color) {
            return !color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
        }

        function isUsableBackground(styles) {
            return !(
                isTransparent(styles.backgroundColor) &&
                (!styles.backgroundImage || styles.backgroundImage === 'none')
            );
        }

        function getColorAlpha(color) {
            if (!color) {
                return 0;
            }

            const value = color.trim().toLowerCase();

            if (value === 'transparent' || value === 'rgba(0, 0, 0, 0)') {
                return 0;
            }

            const slashAlpha = value.match(/\/\s*([0-9.]+)\s*\)$/);
            if (slashAlpha) {
                const parsed = parseFloat(slashAlpha[1]);
                return Number.isNaN(parsed) ? 1 : parsed;
            }

            const rgbaAlpha = value.match(/rgba\(\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([0-9.]+)\s*\)/);
            if (rgbaAlpha) {
                const parsed = parseFloat(rgbaAlpha[1]);
                return Number.isNaN(parsed) ? 1 : parsed;
            }

            return 1;
        }

        function isOpaqueBackground(styles, minAlpha = 0.9) {
            if (styles.backgroundImage && styles.backgroundImage !== 'none') {
                return true;
            }

            if (isTransparent(styles.backgroundColor)) {
                return false;
            }

            return getColorAlpha(styles.backgroundColor) >= minAlpha;
        }

        function resolveBackground(cell) {
            const candidates = [
                cell,
                cell?.parentElement,
                table,
                table.parentElement,
                table.closest('.fi-ta'),
                table.closest('.fi-table'),
                document.documentElement,
            ];

            for (const candidate of candidates) {
                if (!candidate) {
                    continue;
                }

                const styles = getComputedStyle(candidate);

                if (isOpaqueBackground(styles)) {
                    return styles.backgroundColor;
                }
            }

            return document.documentElement.classList.contains('dark')
                ? '#0f172a'
                : '#ffffff';
        }

        function resolveRowLikeBackgroundLoose(row, excludedIndex) {
            const siblings = Array.from(row?.children ?? []).filter((_, index) => index !== excludedIndex);

            for (const sibling of siblings) {
                const styles = getComputedStyle(sibling);

                if (isUsableBackground(styles)) {
                    return styles.backgroundColor || styles.background;
                }
            }

            const rowStyles = row ? getComputedStyle(row) : null;

            if (rowStyles && isUsableBackground(rowStyles)) {
                return rowStyles.backgroundColor || rowStyles.background;
            }

            return resolveBackground(row ?? table);
        }

        function resolveTableBaseBackground() {
            const container = table.closest('.fi-ta-ctn')
                ?? table.closest('.fi-ta-content-ctn')
                ?? table.closest('.fi-ta')
                ?? table.closest('.fi-table');

            return resolveBackground(container ?? table);
        }

        function resolveHeaderBackground() {
            const head = table.querySelector('thead');
            const firstHeaderRow = head?.querySelector('tr') ?? null;

            if (firstHeaderRow) {
                return resolveRowLikeBackgroundLoose(firstHeaderRow, actionColumnIndex);
            }

            return resolveBackground(head ?? table);
        }

        const headerBackground = resolveHeaderBackground();
        const scrollContainer = findHorizontalScrollContainer();
        const hasHorizontalOverflow = CONFIG.shadowEnabled && (scrollContainer
            ? (scrollContainer.scrollWidth - scrollContainer.clientWidth > 1)
            : (table.scrollWidth - table.clientWidth > 1));

        table.querySelectorAll('thead tr').forEach((row) => {
            const cell = row.children[actionColumnIndex];

            if (!cell) {
                return;
            }

            cell.classList.add('fft-freeze-action-col');
            cell.classList.toggle('fft-freeze-shadow', hasHorizontalOverflow);
            cell.style.setProperty('--fft-table-base-bg', resolveTableBaseBackground());
            cell.style.setProperty('--fft-cell-bg', headerBackground);
        });

        table.querySelectorAll('tbody tr').forEach((row) => {
            const cell = row.children[actionColumnIndex];

            if (!cell) {
                return;
            }

            cell.classList.add('fft-freeze-action-col');
            cell.classList.toggle('fft-freeze-shadow', hasHorizontalOverflow);
            const tableBaseBackground = resolveTableBaseBackground();
            cell.style.setProperty('--fft-table-base-bg', tableBaseBackground);
            cell.style.setProperty('--fft-cell-bg', tableBaseBackground);
        });
    }

    function refreshAll() {
        document.querySelectorAll(TABLE_SELECTOR).forEach((table) => {
            applyFreeze(table);
        });
    }

    let observer;
    let themeObserver;
    let refreshQueued = false;

    function scheduleRefresh() {
        if (refreshQueued) {
            return;
        }

        refreshQueued = true;

        requestAnimationFrame(() => {
            refreshQueued = false;
            refreshAll();
        });
    }

    function boot() {
        scheduleRefresh();

        if (observer) {
            observer.disconnect();
        }

        if (themeObserver) {
            themeObserver.disconnect();
        }

        observer = new MutationObserver(() => {
            scheduleRefresh();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        themeObserver = new MutationObserver(() => {
            scheduleRefresh();
        });

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'style', 'data-theme'],
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }

    document.addEventListener('livewire:navigated', scheduleRefresh);
    window.addEventListener('resize', scheduleRefresh);
})();
