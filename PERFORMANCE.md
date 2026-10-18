# Animation and performance notes

Current implementation, verified 2026-10-18. Superseded investigation notes and raw browser captures are local-only, in `.local-archive/PERFORMANCE-history.md` and `.perf-audit/` respectively.

## Runtime behavior

- The intro logo starts its 1.8-second fill from server-rendered CSS. The 3D scene mounts after the fill, under the covered page, then loads its local HDR, compiles its material asynchronously and submits a warm render. The filled logo may hold while setup completes. The exit text and curtain use native transform/opacity animations.
- The hero retains its gold knot geometry, physical material and lighting. It uses a fixed DPR of 1 and pauses rendering while covered, offscreen or hidden. Its vertical fade is applied in the shader. Pointer input is coalesced, and glow positioning avoids repeated layout measurements.
- Lenis uses one GSAP ticker with lag smoothing disabled. Touch retains native momentum. Navigation curtains cancel interrupted navigation and settle the destination while covered before revealing it.
- Two solid background layers crossfade through opacity. About cards avoid CSS transitions on transforms already controlled by GSAP. Work heading eyes cache geometry and stop updating while offscreen, hidden or covered by a preview.
- Fonts and the HDR environment are local assets. The active Work section uses the poster wall; the earlier WorkCarousel component is retained as unused source and is not mounted.

## Verification

The production build, TypeScript checks and lint passed after the animation changes. Lint has one existing `next/no-img-element` warning for the full-size Awards preview.

Desktop and mobile-emulated browser checks covered section navigation, return to hero, rapid interrupted clicks, certificate previews, Escape dismissal, touch scrolling, reduced motion and horizontal overflow. No runtime exceptions were captured in normal flows. Blocking the HDR produced the expected renderer error; the loader still exited and scrolling unlocked. Offscreen WebGL submissions stopped and resumed on return to the hero.

Screencast checks showed the logo fill and navigation curtain continuing to move during deliberately blocked main-thread intervals. GPU/compositor traces were also inspected. Some startup and navigation frame markers remain; headless timings do not guarantee zero dropped frames on every physical device.

## Rechecking

Use `npm run lint`, then `npm run build` and `npm run start`. Review the production server in Chrome and the integrated preview at the actual screen size. Include initial loading, pointer movement over the hero, scrolling in both directions, rapid navigation and image previews. Keep browser profiles, traces and screenshots out of Git.
