# Produce Website

A static multi-page website for a produce business with separated `frontend` (public marketing & product listing) and `backend` (admin dashboard mock) directories.

## Structure
```
backend/        Admin dashboard HTML, CSS (`css/admin.css`), JS (`js/admin.js`)
frontend/       Public site pages, CSS (`css/styles.css`), JS (`js/script.js`)
```

## Getting Started (Git)
Initial commit steps (run in PowerShell inside project root):
```powershell
git add .gitignore README.md backend frontend
git commit -m "feat: initial project structure"
# Ensure branch name
git branch -M main
# Add remote (replace URL if different)
git remote add origin https://github.com/ayn2110/produce-website.git
git push -u origin main
```

## Suggested Branching Strategy
- `main`: stable, deployable
- `feat/<short>`: new features (e.g. `feat/product-filter`)
- `fix/<short>`: bug fixes
- `docs/<short>`: documentation adjustments
- `chore/<short>`: tooling, build, maintenance

Create a feature branch:
```powershell
git checkout -b feat/product-filter
# work, then
git add .
git commit -m "feat: add product filter UI"
git push -u origin feat/product-filter
```
Open a Pull Request and squash or rebase before merge to keep history clean.

## Commit Message Convention
Use Conventional Commits style:
```
<type>(optional scope): <summary>
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

Examples:
- `feat: add seasonal products section`
- `fix: correct broken image path on products page`

## Future Enhancements
- Add a build step (e.g. bundler or minifier)
- Introduce an `env` example: create `.env.example` for any future config
- Add tests if backend evolves into dynamic framework

## Basic Workflow Recap
```powershell
git status        # check changes
git add <files>    # stage
git commit -m "feat: ..."  # commit
git pull --rebase  # update local before pushing
git push           # send to remote
```

## License
(Choose a license if open source, e.g. MIT.)

---
Feel free to extend this README as functionality grows.
