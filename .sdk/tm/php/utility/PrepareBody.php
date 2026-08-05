<?php
declare(strict_types=1);

// GraphiteNote SDK utility: prepare_body

class GraphiteNotePrepareBody
{
    public static function call(GraphiteNoteContext $ctx): mixed
    {
        if ($ctx->op->input === 'data') {
            return ($ctx->utility->transform_request)($ctx);
        }
        return null;
    }
}
