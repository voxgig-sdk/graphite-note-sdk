<?php
declare(strict_types=1);

// GraphiteNote SDK utility: result_body

class GraphiteNoteResultBody
{
    public static function call(GraphiteNoteContext $ctx): ?GraphiteNoteResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result && $response && $response->json_func && $response->body) {
            $result->body = ($response->json_func)();
        }
        return $result;
    }
}
