---
title: "My Dotfiles Setup: A Tale of Two Systems"
date: 2026-03-23 15:00:00
tags: 
  - thoughts 
  - automation
  - dotfiles
layout: post
---

## The Struggle is Real

Let’s be honest for a second: managing multiple computers is a nightmare. For the longest time, I was living a double life. I had my Arch Linux workstation (KDE Plasma for the win!) and my MacBook for when I needed to actually be mobile. 

The problem? They felt like two completely different strangers. 

I’d hop onto the Mac, try to use a Zsh alias I literally *just* made on Linux, and... nothing. Command not found. Total silence. Then I’d spend twenty minutes manually copying files over like it was 2005. I had "final" config files scattered across random GitHub repos and it was, frankly, a mess.

## Enter the Unified Repo

I finally reached a breaking point. I didn't need more repos; I needed a system. So, I did what any self-respecting "data freak" would do: I consolidated everything. 

Now, I have one single `dotfiles` repository that handles everything. Instead of a giant pile of hidden files, I organized it by "packages" and "profiles." 

It looks a bit like this:

```text
dotfiles/
├── packages/
│   ├── arch-kde/
│   │   └── zsh/
│   ├── macos/
│   │   └── zsh/
│   └── shared/
│       └── vim/
└── install.py
```

The "shared" stuff is the real MVP here. My Vim config doesn't care what OS I'm on, so why should I manage it twice?

## The Magic of GNU Stow

Now, how do these files actually get where they need to go? **GNU Stow**. 

I know, I know—it sounds like some dusty old server tool, but it's actually pure magic. It’s basically a symlink manager. You tell it where your config is, and it "stows" it into your home directory. The system *thinks* the file is right there in `~/`, but the real version is safely tucked away in my Git repo.

A simple stow command looks like this:

```bash
# Stow the zsh package into the home directory
stow -t ~ zsh
```

Suddenly, my `.zshrc` is exactly where it needs to be. Any change I make is instantly tracked. No more manual copying, no more "config_v2_final_REALLY_FINAL.conf". 

### Fun Fact: The Overkill Script

Because I can't just leave things simple, I wrote a custom `install.py` script to wrap around Stow. It’s a bit overkill, honestly. It uses **multi-threading** to check for conflicts and stow packages in parallel. 

Here’s a peek at how I handle the parallel execution:

```python
with concurrent.futures.ThreadPoolExecutor() as executor:
    futures = [
        executor.submit(simulate_package, stow_args, action_args, pkg, cwd)
        for pkg in packages
    ]
    # Wait for all simulations to finish...
```

Why? Because waiting three seconds for a symlink is three seconds too long! 

It also keeps me honest by checking if I actually have my favorite tools installed—stuff like `zoxide` (my replacement for `cd`), `thefuck` (for fixing typos), and `fzf`.

## Crossing the OS Divide

The real trick was making Arch and macOS play nice together. I didn't want a massive, messy `.zshrc` full of "if this is a Mac, do this" checks. That’s just trading one headache for another.

Instead, I use profiles. My custom `install.py` script (which I'm pretty proud of, badum-tssss!) detects which machine I'm on and only stows the packages that actually belong there. 

{% asset_img dotfiles_logo.png dotfiles %}

Now, whether I'm at my desk on Arch or at a cafe with my MacBook, my environment feels identical. 
 My aliases work, my prompt is the same, and I can actually get back to work instead of fighting with my terminal.

It took a bit of setup, but man, was it worth it. If you're still manually copying configs... do yourself a favor and check out Stow!
