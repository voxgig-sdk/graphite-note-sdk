<?php
declare(strict_types=1);

// GraphiteNote SDK utility: feature_hook

class GraphiteNoteFeatureHook
{
    public static function call(GraphiteNoteContext $ctx, string $name): void
    {
        if (!$ctx->client) {
            return;
        }
        $features = $ctx->client->features ?? null;
        if (!$features) {
            return;
        }
        foreach ($features as $f) {
            if (method_exists($f, $name)) {
                $f->$name($ctx);
            }
        }
    }
}
