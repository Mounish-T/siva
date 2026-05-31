-- Pulse Music - Supabase schema
-- Run in Supabase SQL editor (https://app.supabase.com/project/_/sql)
-- Auth (auth.users) is built-in; we add a profile and user-owned playlists/favorites.

-- ---------- Profiles ----------
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique,
    avatar_url text,
    created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are readable by owner"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

-- Auto-create a profile row on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id) values (new.id);
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ---------- Favorites ----------
-- Songs are not stored in our DB; we just store Jamendo track IDs the user liked.
create table if not exists public.favorites (
    user_id uuid not null references auth.users(id) on delete cascade,
    track_id text not null,
    track_title text,
    track_artist text,
    track_image text,
    track_audio text,
    track_duration int,
    created_at timestamptz default now(),
    primary key (user_id, track_id)
);

create index if not exists favorites_user_idx on public.favorites(user_id);

alter table public.favorites enable row level security;

create policy "Users read own favorites"
    on public.favorites for select using (auth.uid() = user_id);
create policy "Users insert own favorites"
    on public.favorites for insert with check (auth.uid() = user_id);
create policy "Users delete own favorites"
    on public.favorites for delete using (auth.uid() = user_id);

-- ---------- Playlists ----------
create table if not exists public.playlists (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    created_at timestamptz default now()
);

create index if not exists playlists_user_idx on public.playlists(user_id);

alter table public.playlists enable row level security;

create policy "Users read own playlists"
    on public.playlists for select using (auth.uid() = user_id);
create policy "Users manage own playlists"
    on public.playlists for all using (auth.uid() = user_id);

create table if not exists public.playlist_tracks (
    playlist_id uuid not null references public.playlists(id) on delete cascade,
    track_id text not null,
    position int not null default 0,
    track_title text,
    track_artist text,
    track_image text,
    track_audio text,
    track_duration int,
    added_at timestamptz default now(),
    primary key (playlist_id, track_id)
);

create index if not exists playlist_tracks_pl_idx on public.playlist_tracks(playlist_id);

alter table public.playlist_tracks enable row level security;

create policy "Users read tracks in own playlists"
    on public.playlist_tracks for select
    using (
        exists (
            select 1 from public.playlists p
            where p.id = playlist_id and p.user_id = auth.uid()
        )
    );
create policy "Users manage tracks in own playlists"
    on public.playlist_tracks for all
    using (
        exists (
            select 1 from public.playlists p
            where p.id = playlist_id and p.user_id = auth.uid()
        )
    );

-- ---------- Recently played ----------
create table if not exists public.recently_played (
    id bigserial primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    track_id text not null,
    played_at timestamptz default now()
);

create index if not exists recently_played_user_idx
    on public.recently_played(user_id, played_at desc);

alter table public.recently_played enable row level security;

create policy "Users read own recently played"
    on public.recently_played for select using (auth.uid() = user_id);
create policy "Users insert own recently played"
    on public.recently_played for insert with check (auth.uid() = user_id);
