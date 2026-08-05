<?php
declare(strict_types=1);

// GraphiteNote SDK utility: result_headers

class GraphiteNoteResultHeaders
{
    public static function call(GraphiteNoteContext $ctx): ?GraphiteNoteResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
