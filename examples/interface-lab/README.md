# Authentic Design: three rendered interfaces

Three synthetic interface trials, revised after browser inspection. The final gallery and prototypes are in `dist/`; first attempts are preserved in `baseline/`; screenshots and checks are in `screenshots/` and [QA.md](QA.md).

Serve the gallery from this directory:

```sh
python3 -m http.server 8765 --directory dist
```

Then open http://localhost:8765/. There is no install or build step. To inspect the first attempts, serve `baseline` instead and open `/ceramics/`, `/cinema/`, or `/transit/`.

- **Barro:** material-led product comparison; local bag with quantities and removal.
- **Margem:** compact film programme; session-specific seat choice and simulated reservation.
- **Linha:** operational list and schematic; exclusive spare-vehicle assignment and undo.

This directory is evidence, not a template library that the skill must reuse. All companies, films, vehicle records and availability are fictional. No real purchase, ticket or dispatch occurs. Barro stores only its demonstration bag in localStorage; reload resets cinema and transit simulation state. See [ASSETS.md](ASSETS.md) for image provenance and font fallbacks.
