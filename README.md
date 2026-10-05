# olis_games

Each game lives in its own top-level folder, and its start page must be called `index.html`:
`my-game/index.html` ✅ · `my-game/my_game.html` ❌ · `my-game/my-game/index.html` ❌
Other files the game needs (scripts, styles, images) go alongside it in the same folder, e.g. `my-game/js/game.js`.
On the homepage each game gets a card: its name comes from the page's `<title>`, and its picture from `my-game/screenshot.png` (16:10, about 600px wide).

1. Oli opens a PR adding/updating a game folder.
2. Review and merge it.
3. Run `./deploy.sh` (uses the default profile in `~/.aws/credentials`).

Games are served at `http://olis-games.s3-website.eu-west-2.amazonaws.com/<folder>/`.
