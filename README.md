# Stephen Wilkinson Portfolio

Static GitHub Pages portfolio for Stephen Wilkinson, focused on IT support readiness, cybersecurity coursework, lab documentation, and selected project evidence.

Live site: [stephenwilkinson.dev](https://stephenwilkinson.dev)

## Site Structure

| Area | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Role focus, featured work, skills, education, and contact |
| Project hub | `projects.html` | Organized entry point for current work, labs, and archive routing |
| Resume | `resume.html` | Web resume and PDF download |
| About | `about.html` | Background, current direction, and work style |
| Lab notes | `lab-notes.html` | Index of support-style lab documentation |
| Linux lab | `homelab-infrastructure.html` | Docker/Linux lab case study |
| Networking lab | `networking-lab.html` | DNS and connectivity troubleshooting writeup |
| A+ tools | `aplus.html` | CompTIA A+ study tools index |
| A+ Core 1 sheet | `aplus-core1-study-sheet.html` | Core 1 one-hour cram sheet |
| A+ Core 1 trainer | `aplus-core1-trainer.html` | Core 1 practice trainer and flashcards |
| A+ Core 2 sheet | `aplus-core2-study-sheet.html` | Core 2 one-hour cram sheet |
| A+ Core 2 flashcards | `aplus-core2-flashcards.html` | Core 2 filtered flashcard deck |
| Archive | `archive.html` | Older utilities, games, and prototypes |

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
|-- aplus.html
|-- aplus-core1-study-sheet.html
|-- aplus-core1-trainer.html
|-- aplus-core2-study-sheet.html
|-- aplus-core2-flashcards.html
|-- archive.html
|-- styles.css
|-- contact-copy.js
|-- Stephen-Wilkinson-Resume.pdf
|-- dungeon-party-rpg/
|-- frameforge-arena/
|-- mini-rts-clash/
`-- roadkill-pilgrimage/
```

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
