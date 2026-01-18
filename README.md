# Welcome, Nurexia Contributor

## Setting Up the Development Environment

1. Fork the repository.

2. In your terminal, run the `git clone` command with the forked repository's URL, e.g.

   ```bash
   git clone https://github.com/nurexi-app/nextapp.git
   ```

   This creates a local repository on your machine.

3. Configure the upstream remote
   If you haven't already, add the original repository as a remote named "upstream".

   ```bash
   git remote add upstream https://github.com/nurexi-app/nextapp.git
   ```

   This establishes a link between your forked copy and the main organisation repo

4. Verify the connection:
   Run `git remote -v` . You should see `origin` pointing to your personal fork and `upstream` pointing to the organization's repo.

5. Fetch the upstream changes from development branch only!!!
   This downloads the latest commits and branches from the original repository without merging them.
   ` git fetch upstream development`

6. Sync your local development branch
   Switch to your local development branch (create it if it doesn't exist) and merge the changes you just fetched:

   ```bash
    # Switch to or create the development branch
   git checkout development

    # Merge the organization's latest development code into your local branch

    git merge upstream/development

   ```

7. Create a Feature Branch
   Always create a new branch for your work. Never commit directly to the `main` or `development` branches:
   ` git checkout -b feature/your-feature-name`
8. Submit Your Changes
   Once your work is ready:
   1. Push your feature branch to your fork: `git push origin feature/your-feature-name`.
   2. Go to the Nurexi NextApp Repo and open a Pull Request.
   3. Ensure the base branch is set to `development` and the head branch is your feature branch.

First, run the development server:

```bash
pnpm dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
