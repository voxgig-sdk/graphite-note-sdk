<?php
declare(strict_types=1);

// GraphiteNote SDK base feature

class GraphiteNoteBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(GraphiteNoteContext $ctx, array $options): void {}
    public function PostConstruct(GraphiteNoteContext $ctx): void {}
    public function PostConstructEntity(GraphiteNoteContext $ctx): void {}
    public function SetData(GraphiteNoteContext $ctx): void {}
    public function GetData(GraphiteNoteContext $ctx): void {}
    public function GetMatch(GraphiteNoteContext $ctx): void {}
    public function SetMatch(GraphiteNoteContext $ctx): void {}
    public function PrePoint(GraphiteNoteContext $ctx): void {}
    public function PreSpec(GraphiteNoteContext $ctx): void {}
    public function PreRequest(GraphiteNoteContext $ctx): void {}
    public function PreResponse(GraphiteNoteContext $ctx): void {}
    public function PreResult(GraphiteNoteContext $ctx): void {}
    public function PreDone(GraphiteNoteContext $ctx): void {}
    public function PreUnexpected(GraphiteNoteContext $ctx): void {}
}
