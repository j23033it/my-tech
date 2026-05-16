---
name: beginner-tech-article
description: Create or update beginner-friendly Japanese technical articles for this Astro knowledge site. Use when the user asks to write a new article, expand a prepared article draft, research a technology and turn it into an article, include concrete commands or usage examples, use trustworthy external sources, and commit the resulting file changes.
---

# Beginner Tech Article

## Overview

Use this skill to produce Japanese technical articles that are easy for beginners and early learners to reread later. The article must explain the big picture, practical usage, concrete commands or code examples, and trustworthy source references.

## Workflow

1. Read the repository instructions first, especially `AGENTS.md`.
2. Identify the target article file:
   - If a prepared draft already exists, update that file.
   - If no draft exists, create a new Markdown article under the repository's existing content structure.
   - Follow the existing frontmatter schema and neighboring article style.
3. Research before writing:
   - Prefer primary and official sources: official documentation, official GitHub repositories, standards documents, vendor docs, or authoritative project pages.
   - Use reputable secondary sources only when they add practical context that official sources do not cover.
   - Avoid relying on old blog posts for fast-moving tools unless the date and version still match the current behavior.
   - Add a `参考ソース` section with source links used for the article.
4. Write for beginners:
   - Start with what the technology is and what problem it solves.
   - Explain the mental model before detailed commands.
   - Define unfamiliar terms the first time they appear.
   - Include examples that a learner can run or adapt.
   - Prefer short sections, tables, diagrams, and comparison views when they improve understanding.
5. Include practical usage:
   - Add concrete commands, configuration snippets, or code examples.
   - Explain when each command is used, not only what it does.
   - Include common pitfalls and how to avoid them.
   - Include a small first workflow that shows the order of operations.
6. Match the site style:
   - Use Japanese for explanations, next steps, and source-code comments.
   - For existing Astro articles, preserve the style using frontmatter, `<p class="lead">`, `<section data-search-section>`, tables, cards, notes, and Mermaid diagrams when appropriate.
   - Keep the article as a knowledge map, not marketing copy.
7. Validate:
   - Run the relevant build or validation command, usually `npm run build`.
   - If the command fails because of sandbox or permission issues, rerun with the required approval path.
   - Fix syntax, frontmatter, or rendering issues before finishing.
8. Commit:
   - Check `git status --short` and avoid staging unrelated user changes.
   - Stage only the files changed for the article task unless the user explicitly asks otherwise.
   - Commit with a concise Japanese message.
   - Do not push unless the user explicitly asks.

## Article Shape

Use this default structure unless the existing article strongly suggests another order:

1. Lead paragraph: one-paragraph overview for beginners.
2. Overview: what it is and why it exists.
3. Mental model: important files, components, roles, or architecture.
4. First workflow: commands or steps in the order a learner should run them.
5. Command or API reference: table of common operations.
6. Comparison: how it differs from related tools or older approaches.
7. Practical scenarios: individual development, team development, CI, deployment, or other relevant use cases.
8. Pitfalls: common mistakes and safe habits.
9. Summary: what to remember first.
10. Sources: links to official or trustworthy references.

## Source Quality

Prefer sources in this order:

1. Official documentation for the exact tool or platform.
2. Official GitHub repository, changelog, release notes, or README.
3. Language or ecosystem standards such as Python Packaging, MDN, WHATWG, W3C, TC39, RFCs, or cloud provider docs.
4. Maintainer-authored posts or talks.
5. Well-maintained tutorials only as supporting context.

When information may have changed recently, verify it with current sources before writing. Avoid unsupported claims such as performance numbers, deprecations, or feature availability unless a reliable source supports them.

## Commit Discipline

Before committing:

- Inspect the diff for the files you changed.
- Do not revert unrelated modifications.
- If unrelated files are already modified, leave them unstaged.
- Commit only after validation succeeds or after clearly documenting why validation could not be run.
