<?php
declare(strict_types=1);

// GraphiteNote SDK utility registration

require_once __DIR__ . '/../core/UtilityType.php';
require_once __DIR__ . '/Clean.php';
require_once __DIR__ . '/Done.php';
require_once __DIR__ . '/MakeError.php';
require_once __DIR__ . '/FeatureAdd.php';
require_once __DIR__ . '/FeatureHook.php';
require_once __DIR__ . '/FeatureInit.php';
require_once __DIR__ . '/Fetcher.php';
require_once __DIR__ . '/MakeFetchDef.php';
require_once __DIR__ . '/MakeContext.php';
require_once __DIR__ . '/MakeOptions.php';
require_once __DIR__ . '/MakeRequest.php';
require_once __DIR__ . '/MakeResponse.php';
require_once __DIR__ . '/MakeResult.php';
require_once __DIR__ . '/MakePoint.php';
require_once __DIR__ . '/MakeSpec.php';
require_once __DIR__ . '/MakeUrl.php';
require_once __DIR__ . '/Param.php';
require_once __DIR__ . '/PrepareAuth.php';
require_once __DIR__ . '/PrepareBody.php';
require_once __DIR__ . '/PrepareHeaders.php';
require_once __DIR__ . '/PrepareMethod.php';
require_once __DIR__ . '/PrepareParams.php';
require_once __DIR__ . '/PreparePath.php';
require_once __DIR__ . '/PrepareQuery.php';
require_once __DIR__ . '/ResultBasic.php';
require_once __DIR__ . '/ResultBody.php';
require_once __DIR__ . '/ResultHeaders.php';
require_once __DIR__ . '/TransformRequest.php';
require_once __DIR__ . '/TransformResponse.php';

GraphiteNoteUtility::setRegistrar(function (GraphiteNoteUtility $u): void {
    $u->clean = [GraphiteNoteClean::class, 'call'];
    $u->done = [GraphiteNoteDone::class, 'call'];
    $u->make_error = [GraphiteNoteMakeError::class, 'call'];
    $u->feature_add = [GraphiteNoteFeatureAdd::class, 'call'];
    $u->feature_hook = [GraphiteNoteFeatureHook::class, 'call'];
    $u->feature_init = [GraphiteNoteFeatureInit::class, 'call'];
    $u->fetcher = [GraphiteNoteFetcher::class, 'call'];
    $u->make_fetch_def = [GraphiteNoteMakeFetchDef::class, 'call'];
    $u->make_context = [GraphiteNoteMakeContext::class, 'call'];
    $u->make_options = [GraphiteNoteMakeOptions::class, 'call'];
    $u->make_request = [GraphiteNoteMakeRequest::class, 'call'];
    $u->make_response = [GraphiteNoteMakeResponse::class, 'call'];
    $u->make_result = [GraphiteNoteMakeResult::class, 'call'];
    $u->make_point = [GraphiteNoteMakePoint::class, 'call'];
    $u->make_spec = [GraphiteNoteMakeSpec::class, 'call'];
    $u->make_url = [GraphiteNoteMakeUrl::class, 'call'];
    $u->param = [GraphiteNoteParam::class, 'call'];
    $u->prepare_auth = [GraphiteNotePrepareAuth::class, 'call'];
    $u->prepare_body = [GraphiteNotePrepareBody::class, 'call'];
    $u->prepare_headers = [GraphiteNotePrepareHeaders::class, 'call'];
    $u->prepare_method = [GraphiteNotePrepareMethod::class, 'call'];
    $u->prepare_params = [GraphiteNotePrepareParams::class, 'call'];
    $u->prepare_path = [GraphiteNotePreparePath::class, 'call'];
    $u->prepare_query = [GraphiteNotePrepareQuery::class, 'call'];
    $u->result_basic = [GraphiteNoteResultBasic::class, 'call'];
    $u->result_body = [GraphiteNoteResultBody::class, 'call'];
    $u->result_headers = [GraphiteNoteResultHeaders::class, 'call'];
    $u->transform_request = [GraphiteNoteTransformRequest::class, 'call'];
    $u->transform_response = [GraphiteNoteTransformResponse::class, 'call'];
});
