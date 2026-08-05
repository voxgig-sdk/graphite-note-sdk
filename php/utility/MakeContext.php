<?php
declare(strict_types=1);

// GraphiteNote SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class GraphiteNoteMakeContext
{
    public static function call(array $ctxmap, ?GraphiteNoteContext $basectx): GraphiteNoteContext
    {
        return new GraphiteNoteContext($ctxmap, $basectx);
    }
}
