<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Diagnostics-first rule
When build, deploy, runtime, or integration issues occur:
1. Reproduce and capture concrete error output first.
2. Diagnose from logs/command output and verify root cause.
3. Apply targeted fixes based on evidence.
4. Re-run diagnostics to confirm resolution.
Do not guess fixes without validating against observed errors.

## Cloud-agent PR merge rule
When cloud agents open PRs for this project, merge them immediately by default.
Only delay merging if the user explicitly asks to hold or review first.
