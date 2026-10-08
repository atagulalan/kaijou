# kaijou

`npx` runner for **kai** — markdown kanban CLI.

```bash
npx kaijou
```

What it does:

1. Ensures `./kai` exists in the current directory (copies the bundled CLI)
2. If `.kai/config` is missing → runs `./kai init` (default prefix `Kai`)
3. Otherwise forwards args to `./kai` (no args → `./kai list`)

Examples:

```bash
npx kaijou                 # install ./kai + init if needed
npx kaijou init MyProj     # init with custom prefix
npx kaijou add --author user --title "Ship it" --priority 10
npx kaijou list --all
npx kaitui                 # optional UI
```

- npm: https://www.npmjs.com/package/kaijou
- source: https://github.com/atagulalan/kaijou
