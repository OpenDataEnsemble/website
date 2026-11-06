# Contributing to the ODE website

Thanks for wanting to help with the Open Data Ensemble website. This guide is for this repository only — the marketing site at [opendataensemble.org](https://opendataensemble.org). For the Formulus and Synkronus tools, see the [monorepo contributing guide](https://github.com/OpenDataEnsemble/ode/blob/main/CONTRIBUTING.md).

## Prerequisites

- Node.js 22.13 or newer
- pnpm 11.1.2 (the package declares its version; `corepack enable` will pick it up)

## Run locally

```sh
pnpm install
pnpm dev
```

Open <http://127.0.0.1:3000>. The dev server hot-reloads; stop it with Ctrl+C.

To build and preview the static export:

```sh
pnpm build
pnpm start:preview
```

Open <http://127.0.0.1:4173>. Full details are in the [README](README.md).

## Validate

Before opening a pull request, run:

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
pnpm exec playwright install chromium
pnpm test
```

If Chrome is already installed, skip the browser download with `PLAYWRIGHT_CHROMIUM_CHANNEL=chrome pnpm test`.

## Making a change

1. Fork this repository and clone your fork.
2. Create a branch: `git checkout -b your-change`.
3. Make the change, then run the validation commands above.
4. Commit with a clear message and push the branch to your fork.
5. Open a pull request against `main`, describing the problem and your fix. Link any related issue (for example `Closes #15`).

## Where to start

Good first issues are labelled [`good first issue`](https://github.com/OpenDataEnsemble/website/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). Pick one up, or open an issue to propose something bigger before you start.

## Questions?

Ask on the [ODE forum](https://forum.opendataensemble.org). For bug reports or feature ideas, open an issue in this repository.
