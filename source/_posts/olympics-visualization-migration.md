---
title: 'Migrating My Olympics Visualization to React & Bun'
date: 2026-03-29 14:00:00
tags:
  - react
  - d3
  - bun
  - typescript
  - projects
  - migration
---

It’s been a while since I first built my **Olympics Visualization** project. Back then, it was a pure JavaScript application powered by **jQuery** and **D3.js**. While it served its purpose well, the codebase had become increasingly difficult to maintain as I added more features. 

Recently, I decided it was time for a complete overhaul. I’ve migrated the entire project to a modern stack: **React**, **TypeScript**, and **Bun**, following the **Bulletproof React** architecture.

## Why the Migration?

The original version was a classic "spaghetti" of jQuery selectors and manual DOM manipulations. Adding a new chart or changing the state (like the selected year or country) required carefully syncing multiple parts of the application. 

By moving to React, I gained:
- **Declarative UI:** The view automatically stays in sync with the state.
- **Type Safety:** TypeScript helps catch errors during development rather than at runtime.
- **Better State Management:** Moving from global variables to **Zustand** made handling complex filters a breeze.
- **Faster DX:** Switching from a traditional Node.js setup to **Bun** and **Vite** significantly improved my development workflow.

## The Architecture: Bulletproof React

I decided to follow the **Bulletproof React** pattern to keep the project organized and scalable. Instead of a flat `components/` folder, I grouped functionality into "features." 

For this project, the core feature is the **Dashboard**, which houses all the visualizations:
- `src/features/dashboard/components/Worldmap.tsx`
- `src/features/dashboard/components/Bubblechart.tsx`
- `src/features/dashboard/components/Linechart.tsx`
- `src/features/dashboard/components/Scatterplot.tsx`

This structure makes it easy to find everything related to a specific part of the app.

## Integrating D3 with React

One of the biggest challenges was deciding how to let D3 and React coexist. I settled on a pattern where **React handles the lifecycle and the container**, while **D3 handles the actual rendering** inside a `useEffect` hook.

For the **Worldmap**, I used a custom **D3 Mercator projection**. This allowed me to implement advanced features like:
- **Pan and Zoom:** Using `d3-zoom`.
- **Custom Hatching:** A diagonal pattern for countries with no data, implemented via SVG `<defs>`.
- **Surgical Updates:** Updating colors and selections without re-rendering the entire SVG.

## State Management with Zustand

Handling the "drill-down" logic (Sport → Discipline → Event) and multi-country selection (up to 4 countries) was one of the most complex parts of the original app. 

With **Zustand**, I created a clean `useYearStore` that handles all of this globally. I even implemented a "Ctrl + Click" feature on the map to quickly focus on a single country, clearing all other selections.

## Better Tooltips with React Portals

The old version used `d3-tip`, which was sometimes buggy with positioning. In the new version, I built a custom **Tooltip component using React Portals**. 

The tooltip is rendered at the document body level, ensuring it never gets cut off by container boundaries. I also stylized it with **Catppuccin** colors and added rich HTML content, including gold, silver, and bronze medal icons (🥇🥈🥉) to match the original's aesthetic.

## Testing with Vitest

For the first time in this project, I have a robust testing suite. I’m using **Vitest** for unit and integration tests. It’s incredibly fast (thanks to Bun) and works seamlessly with React Testing Library.

## Wrapping Up

This migration wasn't just about using newer tools; it was about building a foundation that I can continue to iterate on. The new architecture is cleaner, safer, and much more fun to work with.

You can check out the source code (and the new React implementation) over on my GitHub!

---
*Olympics Visualization - Made with ❤️*
