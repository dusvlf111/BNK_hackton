create table "user"
(
    id              text                                               not null
        primary key,
    name            text                                               not null,
    email           text                                               not null
        unique,
    "emailVerified" boolean                                            not null,
    image           text,
    "createdAt"     timestamp with time zone default CURRENT_TIMESTAMP not null,
    "updatedAt"     timestamp with time zone default CURRENT_TIMESTAMP not null,
    role            text
);

alter table "user"
    owner to postgres;

create table session
(
    id          text                                               not null
        primary key,
    "expiresAt" timestamp with time zone                           not null,
    token       text                                               not null
        unique,
    "createdAt" timestamp with time zone default CURRENT_TIMESTAMP not null,
    "updatedAt" timestamp with time zone                           not null,
    "ipAddress" text,
    "userAgent" text,
    "userId"    text                                               not null
        references "user"
            on delete cascade
);

alter table session
    owner to postgres;

create index "session_userId_idx"
    on session ("userId");

create table account
(
    id                      text                                               not null
        primary key,
    "accountId"             text                                               not null,
    "providerId"            text                                               not null,
    "userId"                text                                               not null
        references "user"
            on delete cascade,
    "accessToken"           text,
    "refreshToken"          text,
    "idToken"               text,
    "accessTokenExpiresAt"  timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    scope                   text,
    password                text,
    "createdAt"             timestamp with time zone default CURRENT_TIMESTAMP not null,
    "updatedAt"             timestamp with time zone                           not null
);

alter table account
    owner to postgres;

create index "account_userId_idx"
    on account ("userId");

create table verification
(
    id          text                                               not null
        primary key,
    identifier  text                                               not null,
    value       text                                               not null,
    "expiresAt" timestamp with time zone                           not null,
    "createdAt" timestamp with time zone default CURRENT_TIMESTAMP not null,
    "updatedAt" timestamp with time zone default CURRENT_TIMESTAMP not null
);

alter table verification
    owner to postgres;

create index verification_identifier_idx
    on verification (identifier);

create table guardian
(
    id          uuid                     default gen_random_uuid()            not null
        primary key,
    user_id     text                                                          not null
        constraint guardians_user_fk
            references "user"
            on delete cascade,
    guardian_id text                                                          not null
        constraint guardians_guardian_fk
            references "user"
            on delete cascade,
    permissions jsonb                    default '{}'::jsonb                  not null,
    status      text                     default 'pending'::text              not null,
    created_at  timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at  timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table guardian
    owner to postgres;

create table transaction
(
    id                uuid                     default gen_random_uuid()            not null
        primary key,
    user_id           text                                                          not null
        constraint transactions_user_fk
            references "user"
            on delete cascade,
    guardian_id       text
        constraint transactions_guardian_fk
            references "user"
            on delete set null,
    amount            numeric(14, 2)                                                not null,
    merchant_name     text                                                          not null,
    merchant_category text                                                          not null,
    risk_score        integer                  default 0                            not null
        constraint transactions_risk_score_check
            check ((risk_score >= 0) AND (risk_score <= 100)),
    risk_level        text                     default 'low'::text                  not null,
    risk_reasons      jsonb                    default '[]'::jsonb                  not null,
    status            text                     default 'pending'::text              not null
        constraint transactions_status_check
            check (status = ANY (ARRAY ['approved'::text, 'pending_verification'::text, 'blocked'::text])),
    voice_call_sid    text,
    voice_responses   jsonb                    default '[]'::jsonb                  not null,
    guardian_action   text,
    created_at        timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at        timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table transaction
    owner to postgres;

create index transactions_user_created_idx
    on transaction (user_id asc, created_at desc);

create table voice_call
(
    id               uuid                     default gen_random_uuid()            not null
        primary key,
    transaction_id   uuid                                                          not null
        constraint voice_calls_transaction_fk
            references transaction
            on delete cascade,
    call_sid         text                                                          not null,
    duration_seconds integer,
    responses        jsonb                    default '[]'::jsonb                  not null,
    recording_url    text,
    created_at       timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table voice_call
    owner to postgres;

create table alert
(
    id             uuid                     default gen_random_uuid()            not null
        primary key,
    user_id        text                                                          not null
        constraint alerts_user_fk
            references "user"
            on delete cascade,
    guardian_id    text
        constraint alerts_guardian_fk
            references "user"
            on delete cascade,
    transaction_id uuid
        constraint alerts_transaction_fk
            references transaction
            on delete cascade,
    type           text                                                          not null,
    severity       text                                                          not null,
    message        text,
    payload        jsonb                    default '{}'::jsonb                  not null,
    is_read        boolean                  default false                        not null,
    created_at     timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table alert
    owner to postgres;

create index alerts_guardian_is_read_idx
    on alert (guardian_id, is_read);

