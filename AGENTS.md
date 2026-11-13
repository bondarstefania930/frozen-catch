# Agent rules — Frozen Catch (ANDROID-4538)

> Главное правило: делать только то, о чём просят. Делать ровно запрошенное — ни больше, ни меньше.

## Scope discipline (highest priority)

1. Do exactly what the user asked in the current message — nothing more, nothing less.
2. Do not add, remove, rename, reformat or "improve" code, files, configs, dependencies,
   workflows or styles that were not requested.
3. Do not run commands with side effects unless the user explicitly asked for that action
   in the current message: builds (`gradlew`, `npm run release`), `git commit` / `git push` /
   `git tag` / `git remote` changes, `gh workflow run` / `gh run cancel` / `gh secret set` /
   `gh repo create`, releases, uploads, deploys, installs, Jira / Firebase updates.
4. Do not fix unrelated problems, do not refactor opportunistically, do not "clean up" while
   doing a task. Report what you noticed instead of changing it.
5. Do not create extra artifacts (reports, docs, README sections, migrations, scripts)
   that were not requested.
6. If the task seems to require additional changes or any of the actions above, stop and ask
   the user first, then continue only after confirmation.
7. When in doubt — ask. A clarifying question is always cheaper than an unwanted change.
8. Verification of your own work is allowed and expected: read back edited files, run the
   requested test/build/lint. Verification is not a licence to extend the scope.
