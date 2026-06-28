---
name: feedback-no-preview
description: Ne pas utiliser les outils preview (screenshot, click, snapshot, eval) — trop coûteux en tokens
metadata:
  type: feedback
---

Ne pas utiliser les outils preview (preview_screenshot, preview_click, preview_snapshot, preview_eval, etc.) pour vérifier les changements visuels.

**Why:** Trop coûteux en tokens pour ce projet.

**How to apply:** Vérifier uniquement via `npm run build` pour s'assurer que le code compile. Laisser l'utilisateur tester visuellement lui-même.
