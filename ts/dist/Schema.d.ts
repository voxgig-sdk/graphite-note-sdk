declare const OPTSPEC: {
    allow: {
        method: string;
        op: string;
    };
    apikey: string;
    auth: {
        basic: boolean;
        prefix: string;
    };
    base: string;
    clean: {
        keys: string;
    };
    entity: {
        "`$CHILD`": {
            "`$OPEN`": boolean;
            active: boolean;
            alias: {};
        };
    };
    extend: string;
    headers: {
        "`$CHILD`": string;
    };
    prefix: string;
    secret: string;
    server: {
        "`$CHILD`": string;
    };
    suffix: string;
    system: {
        fetch: string;
    };
    test: {
        active: boolean;
        entity: {
            "`$OPEN`": boolean;
        };
    };
    utility: {};
    feature: {
        "`$CHILD`": {
            "`$OPEN`": boolean;
            active: boolean;
        };
        debug: (string | {
            "`$OPEN`": boolean;
            active: string[];
            max: string[];
            redact: string[];
            now: string[];
            onEntry: string[];
        })[];
        idempotency: (string | {
            "`$OPEN`": boolean;
            active: string[];
            header: (string | string[])[];
            methods: string[];
            ops: string[];
            keygen: string[];
        })[];
        metrics: (string | {
            "`$OPEN`": boolean;
            active: string[];
            now: string[];
        })[];
        paging: (string | {
            "`$OPEN`": boolean;
            active: string[];
            afterVar: (string | string[])[];
            cursorParam: (string | string[])[];
            firstVar: (string | string[])[];
            limitParam: (string | string[])[];
            pageParam: (string | string[])[];
            startPage: string[];
            limit: string[];
            ops: string[];
        })[];
        ratelimit: (string | {
            "`$OPEN`": boolean;
            active: string[];
            burst: string[];
            rate: string[];
            now: string[];
            sleep: string[];
        })[];
        retry: (string | {
            "`$OPEN`": boolean;
            active: string[];
            factor: string[];
            maxDelay: string[];
            minDelay: string[];
            retries: string[];
            statuses: string[];
            jitter: string[];
            sleep: string[];
        })[];
        test: (string | {
            "`$OPEN`": boolean;
            active: string[];
            entity: string[];
            net: string[];
        })[];
        timeout: (string | {
            "`$OPEN`": boolean;
            active: string[];
            ms: string[];
            clearTimer: string[];
            setTimer: string[];
        })[];
    };
};
declare const ENTITYSPEC: {};
export { OPTSPEC, ENTITYSPEC, };
