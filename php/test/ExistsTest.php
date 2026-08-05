<?php
declare(strict_types=1);

// GraphiteNote SDK exists test

require_once __DIR__ . '/../graphitenote_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = GraphiteNoteSDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
