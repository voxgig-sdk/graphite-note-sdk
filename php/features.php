<?php
declare(strict_types=1);

// GraphiteNote SDK feature factory

require_once __DIR__ . '/feature/BaseFeature.php';
require_once __DIR__ . '/feature/TestFeature.php';


class GraphiteNoteFeatures
{
    public static function make_feature(string $name)
    {
        switch ($name) {
            case "base":
                return new GraphiteNoteBaseFeature();
            case "test":
                return new GraphiteNoteTestFeature();
            default:
                return new GraphiteNoteBaseFeature();
        }
    }
}
