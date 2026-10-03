# olis_games

Each subfolder is a web game with an `index.html`.

1. Oli opens a PR adding/updating a game folder.
2. Review and merge it.
3. Run `./deploy.sh` (uses the default profile in `~/.aws/credentials`).

Games are served at `http://olis-games.s3-website.eu-west-2.amazonaws.com/<folder>/`.
