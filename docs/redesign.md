# Redesign: "Bench notes"

Goal: make the home page feel like a specific person made it, not a template. It should lead with the real photos from the work and keep the theme light with dark ink. Projects and personal facts stay exactly as they are in `src/content/`. Only the layout, type and copy around them change.

## What made the old home page read as generated

The tells were the layout's defaults, not any single choice:

- Blurred gradient blobs behind the hero.
- A decorative 3D network as the hero image (it was accurate to the gesture model, but at a glance it looks like stock "AI").
- A row of four big coloured stat tiles straight under the hero.
- Numbered pill section headings with a coloured full stop (`01 Selected work.`).
- Rainbow pill chips for skills, and colour-coded left-border cards for organizations.
- Geist everywhere: the default typeface of the tooling it was built with.
- Copy in the third person and in slogans ("AI that runs on real hardware."), which could sit on anyone's site.

The real build photos, the strongest proof that the work happened, were only on the detail pages.

## Directions compared

| | A. Lab notebook | B. Editorial index | C. Field report | D. Terminal / IDE |
|---|---|---|---|---|
| Idea | Grid paper, tape, handwritten margin notes, projects as pinned pages | Big serif type, every project one text row, a photo appears on hover | Every project is a captioned spread: a real photo, what I did, the number that proves it | Mono type, projects as a command log |
| Human feel | High, but it's a costume | High | High: the photos carry it | Low: a well-worn dev trope |
| Credibility | Medium | Low: photos are hidden until hover, and phones have no hover | **High**: photos are always visible, with captions | Low |
| 30-second recruiter skim | Slow: decoration competes with the facts | **Fast** | Fast if each spread stays short | Medium |
| Mobile | Fragile (tape and rotations) | Good, minus the photos | Good: photo stacks over text | Good |
| Risk | Reads as gimmicky to engineering recruiters | Reads as a design-studio site, not an engineer's | Low | Generic |

**Chosen: C, written with B's restraint.** Photos do the persuading, and the type stays quiet so the photos and numbers stand out. From B it takes the ruled, index-like rhythm and the serif display type. From A it takes only one idea: figure numbers and captions, the way you would label a lab notebook, without the paper costume.

## Inspiration

- Student engineering team sites (Terra Labs USC was the brief's reference) lead with photos of the hardware on the bench, not illustrations. This session's network policy blocked uscterralabs.com, so the reference is the general pattern, not a pixel study.
- Hacker News "share your personal website" threads: the most memorable sites read like working notebooks, e.g. dense project logs with photos.
- Write-ups on AI-looking sites: one called the default font, uniform gradients and spacing, and generic copy the giveaways. Another argued the copy test matters most: cover the name, and ask if the text could be on someone else's site.

## The spec

- **Type:** Newsreader (serif) for the name, headings and the intro; IBM Plex Sans for body text; IBM Plex Mono for labels, dates and figure numbers.
- **Colour:** warm off-white paper `#f7f5f0`, near-black ink `#161512`, hairline rules. One accent, marker blue `#2347b8`, which matches the whiteboard marker in the photos and is used for links and figure numbers only. The demos keep their own palette variables.
- **Hero:** first-person intro on the left and a professional headshot on the right (`site.headshot`; a placeholder frame shows until it is set). The first version had three project photos here; they now live only in the build logs.
- **Numbers:** the four stats become a plain ruled ledger in ink, with no coloured bars.
- **Work:** one spread per project in resume order: number and dates, title, role, a first-person sentence, the headline number, highlights as plain text, and a captioned cover photo that says how many more photos are in the build log. The cell-filament tool has no photos, so its spread shows the live demo instead.
- **Research, organizations, about, contact:** ruled lists and tables, with no pills or tag colours.
- **Copy voice:** first person, concrete, no slogans. Every claim maps to a field in `src/content/`.
- **Motion:** none on the home page beyond hover states. View transitions between pages stay.
