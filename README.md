# Authentic Design

**Interfaces with a reason to look and work the way they do.**

An open Agent Skill for designing web and app experiences from the product's users, content, and tasks. It helps an agent develop a specific identity, build usable flows, and question habitual layouts instead of changing colors on the same template.

[Português](README.pt-BR.md) · [Skill](SKILL.md) · [Evaluation method](evals/README.md) · [Sources](references/sources.md)

## What it changes

- Starts with the user's task and the information needed to complete it.
- Explores different organizing ideas for a new identity, then selects and implements one.
- Uses substitution, silhouette, removal, continuity, and evidence checks to challenge interchangeable design.
- Keeps familiar controls and existing product systems consistent.
- Covers content, failure states, responsive behavior, accessibility, and honest validation.
- Compares previous work when it is supplied or authorized; it does not secretly track other projects.

There is no universal palette, required font, mandatory card layout, or random style picker. A restrained utility and an expressive cultural product should not inherit the same composition merely because the agent made both.

## Install

This repository is the skill folder: `SKILL.md` is at its root. Copy the folder into the skills directory supported by your agent, preserving `references/` and `agents/`. Consult your host's instructions for discovery and activation.

For a Codex installation that uses `~/.codex/skills`:

```sh
git clone https://github.com/Enzoramo/authentic-design.git ~/.codex/skills/authentic-design
```

If that directory already exists, inspect it before updating; do not overwrite local changes. Start a new session or use the host's skill reload mechanism. This is an instruction-only skill: no API key, build step, runtime package, or paid service is required. Rendering and implementation depend on tools available in the host.

## Use

```text
Use $authentic-design to build a booking flow for a bicycle repair shop.
Customers often do not know the names of bicycle parts. Show an estimated
price, let them choose a drop-off slot, and provide review before requesting
the booking. Use Portuguese and the existing project stack.
```

```text
Use $authentic-design to improve this dashboard's information hierarchy.
Keep our current brand, navigation, and components. Focus on identifying
overdue work and recovering from an empty search.
```

```text
Use $authentic-design to create a second concept for this product.
Here is the first concept. Change the organizing idea, explain the tradeoff,
and preserve the functional requirements.
```

Give the agent real content, audience, main task, constraints, and any existing design when available. It can work with incomplete briefs, but it should identify assumptions rather than invent research. Explicit invocation syntax and automatic discovery vary by host.

## How the skill is organized

| File | Purpose |
| --- | --- |
| [SKILL.md](SKILL.md) | Task routing, design process, and acceptance behavior |
| [UX and content](references/ux-and-content.md) | Decisions, flows, states, copy, evidence |
| [Art direction](references/art-direction.md) | Contextual identity and structural alternatives |
| [Design continuity](references/design-continuity.md) | Consistency and authorized comparison |
| [Review and validation](references/review-and-validation.md) | Observable checks and reporting limits |
| [Evaluation cases](evals/cases.json) | Reusable behavior scenarios and review criteria |

Supporting references are read when relevant. The skill does not require loading the entire repository or following an elaborate process for a small fix.

## Validation and limits

Version 0.1.0 is an initial release. See the [evaluation record](evals/README.md) for what was run and what remains untested. Structural validation is not design validation. Written concepts do not establish the quality of a rendered interface, and self-review does not replace participant research.

No skill can guarantee that every result will be unique or objectively the best. Output depends on the model, brief, assets, implementation tools, and feedback. “Authentic” here means specific and coherently reasoned; it does not mean undetectable AI authorship, imitation of a designer, or verified originality across the internet.

## Contribute

Submit a reproducible brief, the skill version, relevant host/model information, the observed output, and the specific decision that failed. Use synthetic or shareable material; remove private client data. Include a case where the proposed change should **not** apply, so an improvement does not become another universal style rule.

Prefer small changes backed by observed behavior. The [evaluation guide](evals/README.md) explains how to compare versions. Do not advertise conversion improvements, accessibility compliance, or benchmark wins without corresponding evidence.

## License

[MIT](LICENSE). Third-party references, fonts, images, and other external assets retain their own licenses.
