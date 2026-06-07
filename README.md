# Stephen Wilkinson Portfolio

Static GitHub Pages portfolio for Stephen Wilkinson, focused on IT support readiness, cybersecurity coursework, lab documentation, troubleshooting evidence, and selected project proof.

Live site: [stephenwilkinson.dev](https://stephenwilkinson.dev)

## Site Structure

| Area | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Role focus, featured work, skills, education, and contact |
| Project hub | `projects.html` | Three-tier entry point for resume proof, lab notes, and archive/workbench routing |
| Resume | `resume.html` | Web resume with public-safe contact details |
| About | `about.html` | Background, current direction, and work style |
| Lab notes | `lab-notes.html` | Index of support-style lab documentation |
| Linux lab | `homelab-infrastructure.html` | Docker/Linux lab case study |
| Networking lab | `networking-lab.html` | DNS and connectivity troubleshooting writeup |
| Windows case | `windows-support-ticket.html` | Ticket-style Windows printer support case |
| A+ tools | `aplus.html` | Tier 3 CompTIA A+ study tools index |
| A+ Core 1 sheet | `aplus-core1-study-sheet.html` | Core 1 one-hour cram sheet |
| A+ Core 1 trainer | `aplus-core1-trainer.html` | Core 1 practice trainer and flashcards |
| A+ Core 2 sheet | `aplus-core2-study-sheet.html` | Core 2 one-hour cram sheet |
| A+ Core 2 flashcards | `aplus-core2-flashcards.html` | Core 2 filtered flashcard deck |
| Archive | `archive.html` | Older study tools, utilities, games, and prototypes |

## Repository Layout

Most public pages remain at the repository root to preserve existing GitHub Pages URLs. Organization is handled through `projects.html`, `archive.html`, and this README instead of moving deployed files and breaking links.

```text
.
|-- index.html
|-- projects.html
|-- resume.html
|-- about.html
|-- lab-notes.html
|-- homelab-infrastructure.html
|-- networking-lab.html
|-- windows-support-ticket.html
|-- aplus.html
|-- aplus-core1-study-sheet.html
|-- aplus-core1-trainer.html
|-- aplus-core2-study-sheet.html
|-- aplus-core2-flashcards.html
|-- archive.html
|-- evidence-linux-sandbox.svg
|-- evidence-dns-connectivity.svg
|-- evidence-windows-printer.svg
|-- styles.css
|-- contact-copy.js
|-- dungeon-party-rpg/
|-- frameforge-arena/
|-- mini-rts-clash/
`-- roadkill-pilgrimage/
```

## Project Tiers

| Tier | Public role | Pages |
| --- | --- | --- |
| Tier 1 | Homepage/resume proof: strongest job evidence only | Linux sandbox, DNS/connectivity lab, Windows support ticket, resume |
| Tier 2 | Project hub and lab notes: polished detail | `projects.html`, `lab-notes.html`, case-study pages |
| Tier 3 | Archive/workbench: useful but not promoted | A+ study tools, older games, utilities, prototypes |

## Local Preview

Run a simple local server from the repo root:

```powershell
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Maintenance Notes

- Keep career-facing pages linked from `projects.html` and the main navigation.
- Put older experiments behind `archive.html` instead of the homepage.
- Update `sitemap.xml` when adding or removing public indexed pages.
- Keep large generated game builds in their own folders.
- Use short, support-style project notes: objective, environment, procedure, validation, evidence, and next step.
- Keep phone numbers and raw home-lab details out of public HTML, PDFs, screenshots, and workbench pages.

## Suggested GitHub Repository Metadata

Description:

```text
Static portfolio focused on IT support readiness, cybersecurity coursework, lab documentation, and troubleshooting evidence.
```

Website: `https://stephenwilkinson.dev`

Topics: `portfolio`, `github-pages`, `it-support`, `cybersecurity`, `networking`, `linux`, `windows`, `documentation`, `help-desk`
