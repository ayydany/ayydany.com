---
title: Switching from Windows to Linux - A Journey
date: 2024-06-09 01:03:43
tags: 
  - thoughts 
  - linux
layout: post
---

## Switching from Windows to Linux: A Journey

I've always been mostly a Windows user all my life, dabbled a bit with Linux while in university, and Mac was never really a thing for me. That is until my last job required me to switch to using a Mac, and a lot of what comes with it.

My previous work was under a heavy Microsoft environment, so it made sense to develop our code on Windows machines, deploy it on Azure servers, and everything else in between. I even dabbled a bit in old classic Windows Forms and WPF afterward. But since switching to my latest job, I've been exploring the Mac development environment a bit more and everything else that comes with it. Also, it was my first time really doing everything under a package manager and wow! After working with Homebrew for a while, I even started using Scoop on Windows (amazing btw) and, of course, Winget. I do prefer Scoop due to the way it stores versions and configurations.

### Considering the Switch to Linux

With all this said and done, the recent "Recall" news on Windows, or how it was "Recalled" *badum-tssss*, made me even more curious about how it would be to switch for a while to a complete Linux environment. Here are some considerations I had to take into account:

- **Gaming**:
  - I thought it would be pretty great since, with the Steam Deck introduction, everything seems to run fine there. Oh boy, how wrong I was!
- **Configuration Stuff**:
  - How could I bring the things from my PC back into Linux? Like the Firefox profile or Thunderbird configuration. I needed to have a system.
- **Lacking Software**:
  - I still remember when I had to run some programs via Wine because they weren't available on Linux. I've noticed that everything major currently has a version on Linux, so I didn't think this would be an issue.
- **Hardware Issues**:
  - Big unknown! I thought it would be smooth, but honestly, I have a lot of peripherals connected to my PC, and it would be terrible if something didn't work correctly.
- **Distro**:
  - The big one! What distro to use? There are so many to choose from. For me, it was pretty straightforward as I already had Arch Linux in mind. It's a pretty barebones distro that allows the user to completely customize it the way they want, which really attracted me to it.

### The Switch

Two days ago, I decided to make the change! The installation went very smoothly. I simply formatted an SSD I had already installed on the PC (it was hosting some Steam games) and installed it there. So I'm currently dual-booting Windows and Linux on my machine under a GRUB boot manager, which has Windows configured on it, so I can go to it whenever I need to.

Regarding Linux, post-install, I had some issues with the compositor, namely how Wayland behaves under NVIDIA GPUs, since I'm using KDE Plasma. But besides that, we're good to go. I even did a quick setup to back up most of my dotfiles using `stow`, which was really simple. I'll probably do another post in a bit explaining how I'm handling those configurations on two different machines and OSes (namely Linux and Mac).

{% asset_img desktop.png %}

This journey has just begun, and I'm excited to see where it leads me!
