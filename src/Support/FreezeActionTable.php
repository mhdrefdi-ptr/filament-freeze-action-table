<?php

namespace Mhdrefdi\FilamentFreezeActionTable\Support;

use Filament\Actions\Action;
use Filament\Tables\Table;

class FreezeActionTable
{
    public static function make(Table $table, bool $condition = true): Table
    {
        $attribute = ['data-freeze-action-column' => $condition ? 'true' : 'false'];

        if (method_exists($table, 'extraAttributes')) {
            $table->extraAttributes($attribute, true);
        }

        if (method_exists($table, 'modifyUngroupedRecordActionsUsing')) {
            $table->modifyUngroupedRecordActionsUsing(function (Action $action) use ($attribute): Action {
                return $action->extraAttributes($attribute, true);
            });
        }

        if (method_exists($table, 'modifyGroupedRecordActionsUsing')) {
            $table->modifyGroupedRecordActionsUsing(function (Action $action) use ($attribute): Action {
                return $action->extraAttributes($attribute, true);
            });
        }

        return $table;
    }
}
