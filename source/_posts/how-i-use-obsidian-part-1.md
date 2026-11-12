---
title: 'How I Use Obsidian, Part 1: Where Everything Lives'
date: 2026-11-12 17:42:43
tags:
  - thoughts
  - obsidian
---

Back in {% post_link a-year-in-linux 'A Year in Linux' %}, Obsidian got a small section near the end. The idea was simple: keep as little as possible in my head and jot everything else down. The showpiece was a table of every game I'd finished, filled in by QuickAdd and a script that pulls metadata from IGDB.

That table was only the start. Once the games were in, I saw the potential of having most of my life documented and properly structured. More QuickAdd automation came next, then Bases, and finally dashboards built with DataviewJS. Somewhere along the way, a simple note-taking app turned into a whole app. A perfectly normal thing to do with a note-taking app. Probably.

One thing never changed: it's all plain files. [File over app](https://stephango.com/file-over-app) is a philosophy about preserving what you make for the future. Obsidian is built on it, and I follow it fully. The dashboards and automations sit on top, but underneath it's just Markdown and frontmatter.

## The whole map

Today the vault is split into seven top-level areas, and every note lives in one of them.

```text
Obsidian/
├── 00 Inbox/
│   └── Clippings/
├── 10 Operations/
│   ├── Agents/
│   ├── Bases/
│   ├── Data/
│   ├── Meta/
│   ├── Scripts/
│   └── Templates/
├── 20 Active Efforts/
│   ├── Personal/
│   └── Work/
├── 30 Atlas/
│   ├── Books/
│   ├── Gaming/
│   ├── Life Trackers/
│   ├── Links/
│   ├── Movies/
│   ├── Pets/
│   ├── Prompts/
│   ├── Reference/
│   ├── Series/
│   ├── Social Media/
│   └── Travel/
├── 40 Chronology/
│   ├── 2024/
│   ├── 2025/
│   └── 2026/
├── 50 Life Administration/
│   ├── Finances/
│   ├── Garage/
│   ├── Infrastructure/
│   └── Wallets/
└── 99 Attachments/
    ├── Banners/
    └── Photos/
```

*The first two levels. Everything else lives somewhere inside them.*

- `00 Inbox`: the capture point. Clippings and fleeting thoughts land here until I sort them.
- `10 Operations`: the engine room. Templates, scripts, Bases, data files and the notes that document the vault itself. It's also the hub for all the automation and the AI assistants that work in the vault.
- `20 Active Efforts`: the day-to-day. Work, side hobbies and projects, like this website.
- `30 Atlas`: interests and life tracking, mostly things with a status. Games, books, movies, series, travel, pets and habit trackers.
- `40 Chronology`: the daily journal, one folder per year.
- `50 Life Administration`: the official side of life. Finances, documents, vouchers, the car, and runbooks for my backups and email.
- `99 Attachments`: the junk drawer for images. Banners, photos and anything else that gets embedded.

Atlas is for things with a status, like media and trips: they start, progress and finish. Life Administration is the ongoing stuff that never really finishes, much like paperwork itself.

## Why numbers (only) at the top

The structure started life as [Johnny Decimal](https://johnnydecimal.com/). If you haven't come across it: areas get a range of ten, categories inside an area get their own number, and every item gets an ID. In my vault that meant `30 Atlas`, categories from `31` to `39` inside it, and notes numbered like `31.01`.

It looked tidy, but it clashed with how I actually wanted to organise my files. The numbers didn't give me anything a good folder name couldn't, and the fixed slots limited what folders I could have and where they could go. `31.01` is a great name for a filing cabinet and a terrible name for a note about a video game.

So I loosened it, and over the last year the setup has changed a lot. The numbers are gone everywhere except the top level. Subfolders and notes get plain, descriptive names: `Gaming` rather than `31 Gaming`, and `Metroid Dread` rather than something like `31.04 Metroid Dread`.

The top-level numbers stayed for two boring reasons: sort order and muscle memory. The areas always appear in the same order, and I enjoy having them ordered.

## Where does this note go?

Rules are easier to see with real notes, so here are three.

### A game

`Metroid Dread` lives in `30 Atlas/Gaming`, and it stays there whether I'm playing it, dropped it or finished it. That's one of the ideas I'm strictest about: a status is a property, not a folder. When I finish a game, `playing_status` changes to `done` and `completion_status` to `completed`. The note itself doesn't move.

Here's the game I'm playing right now. The note shows it as Playing and Pending:

{% asset_img game-note-overview.png '"A game note for RoboCop: Rogue City - Unfinished Business, with its tracking cards" "A game note for RoboCop: Rogue City - Unfinished Business, with its tracking cards"' %}

Underneath, it's all plain frontmatter. Most of it is filled in automatically from IGDB and HowLongToBeat, which is a story for a later part. The status lives at the bottom:

```yaml
title: "RoboCop: Rogue City - Unfinished Business"
tags:
  - game
icon: SiSteam

# Basic Information
release_date: "2025-07-17"
genre: ["Adventure", "Shooter"]
modes: ["Single player"]
platform: "Steam"

# Developer Information
developer: "Teyon"

# Playtime Information
main_story_playtime: 7.9
main_plus_extras_playtime: 10.6
completionist_playtime: 11.1
playtime_source: "hltb"

# … ratings, summary, artwork and external links …

# Personal Tracking
playing_status: playing
completion_status: pending
collection_status: digital
start_date: 2026-11-11
finish_date:
completed_date:
playtime_hours: 1.7
rating:
```

*The cards are just frontmatter in nicer clothes.*

It didn't always work like that. Status used to be a folder change. Under Gaming I had a `Wishlist` folder, a `Backlog` folder and a `Completed` folder, and notes moved between them as their state changed. A game's whole life story was a series of drag-and-drops. Once status became a property, the drag-and-drops stopped.

### A trip

My upcoming Rome trip sits in `30 Atlas/Travel`, in a note named after the place and the date it starts. You could argue a trip belongs in Active Efforts, since it gets planned, it happens and it ends. But it has a status, just like a game, so it goes in Atlas. Its frontmatter holds the travel dates and where it is on the map.

{% asset_img trip-note.png '"The Rome trip note, with its status set to Planning" "The Rome trip note, with its status set to Planning"' %}

*Status: Planning. It stays in Atlas before, during and after the trip.*

### A half-baked idea

Anything I need to do or remember later goes into `00 Inbox` through a QuickAdd command, one for personal and one for work, so capturing takes seconds. The inbox is where I track those items, and I usually deal with them within 24 hours.

{% asset_img inbox-capture.png '"The QuickAdd prompt for capturing to the Personal Inbox" "The QuickAdd prompt for capturing to the Personal Inbox"' %}

*Capture first, spell-check later.*

## The rules that keep it tidy

Status-as-property and the inbox habit do most of the work.

Deep nesting is an organisational nightmare, so my folders rarely go more than four levels deep.

Tags are the honest weak spot. Right now they mostly label what a note is: 139 games, 54 movies, a handful of trips. Beyond that, they're still very underused, and I haven't found a way to take full advantage of them yet. If you've cracked tags, I'm all ears.

As for upkeep, my vault's own docs describe a weekly five-minute tidy-up. I don't do it. It's an ongoing thing instead: I fix what looks out of place as I go.

## What's next in the series

The next parts cover what's built on top of this structure, starting with the Launchpad: the dashboard my vault opens on, and the first thing I see every time I start Obsidian.

{% asset_img launchpad-teaser.png '"A sneak peek at the Launchpad dashboard" "A sneak peek at the Launchpad dashboard"' %}

*A sneak peek. The personal bits are blurred; the rest is coming in part 2.*

After that, the rough plan is:

- Automation and QuickAdd
- Bases and data
- Mobile and CSS

The order is flexible, which is a polite way of saying I haven't decided yet.
