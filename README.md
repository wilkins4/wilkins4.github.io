# Stephen Wilkinson Resume Site

Static GitHub Pages resume site for Stephen Wilkinson, focused on entry-level IT support, help desk, desktop support, and junior security support roles.

Live site: [stephenwilkinson.dev](https://stephenwilkinson.dev)

## Site Structure

| Area | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Resume-first landing page with contact, education, skills, experience, and role target |
| Work index | `projects.html` | Noindexed supplemental index for lab notes, study materials, and archived work |
| Resume | `resume.html` | Web resume with public-safe contact details |
| About | `about.html` | Background, current direction, and work style |
| Lab notes | `lab-notes.html` | Noindexed index of support-style lab documentation |
| Linux lab | `homelab-infrastructure.html` | Noindexed Docker/Linux lab note |
| Networking lab | `networking-lab.html` | Noindexed DNS and connectivity troubleshooting note |
| Windows draft | `windows-support-ticket.html` | Noindexed draft support-ticket simulation |
| A+ tools | `aplus.html` | Tier 3 CompTIA A+ study tools index |
| A+ Core 1 sheet | `aplus-core1-study-sheet.html` | Core 1 one-hour cram sheet |
| A+ Core 1 trainer | `aplus-core1-trainer.html` | Core 1 practice trainer and flashcards |
| A+ Core 2 sheet | `aplus-core2-study-sheet.html` | Core 2 one-hour cram sheet |
| A+ Core 2 flashcards | `aplus-core2-flashcards.html` | Core 2 filtered flashcard deck |
| Archive | `archive.html` | Older study tools, utilities, games, and prototypes |

## Repository Layout

Most pages remain at the repository root to preserve existing GitHub Pages URLs. The homepage and resume are the only sitemap-promoted pages; workbench material stays reachable but secondary.

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

## Site Organization

| Area | Public role | Pages |
| --- | --- | --- |
| Employer-facing | Resume, contact, education, skills, and experience | `index.html`, `resume.html` |
| Supplemental | Lab notes and work index kept out of the primary path | `projects.html`, `lab-notes.html`, `homelab-infrastructure.html`, `networking-lab.html` |
| Workbench | Drafts, study tools, and older experiments kept separate from the main resume page | A+ tools, Windows draft, older games, utilities, prototypes |

## Local Preview

Run a simple local server from the repo root:

```powershell
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Maintenance Notes

- Keep the main navigation limited to resume, education, skills, and contact.
- Keep older experiments, lab notes, and practice drafts out of the homepage body.
- Update `sitemap.xml` when adding or removing public indexed pages.
- Keep large generated game builds in their own folders.
- Use short, support-style project notes: objective, environment, procedure, validation, evidence, and next step.
- Keep phone numbers and raw home-lab details out of public HTML, PDFs, screenshots, and workbench pages.

## Suggested GitHub Repository Metadata

Description:

```text
Resume-first GitHub Pages site for entry-level IT support readiness, education, skills, and contact.
```

Website: `https://stephenwilkinson.dev`

Topics: `resume`, `github-pages`, `it-support`, `help-desk`, `desktop-support`, `cybersecurity`, `documentation`
