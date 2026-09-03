# TENX autonomous merge contract

TENX pull requests may opt in to autonomous merge by including this exact marker in the pull request body:

`<!-- tenx-automerge:v1 -->`

The `TENX Auto Merge Controller` runs only after the `Titans Quality Gate` finishes for a pull request. A marked pull request is eligible only when all of these are true:

- the Quality Gate conclusion is `success` for the pull request's current head SHA;
- the pull request is open, not a draft, and targets `main`;
- the head branch is in this same repository, not a fork;
- the pull request author is `Alecprice`;
- GitHub still reports the exact tested head SHA as mergeable and not dirty/blocked;
- no reviewer's latest review is `CHANGES_REQUESTED`.

The controller pins the merge API call to the exact green head SHA. If the branch changes after the gate ran, the stale result cannot merge the newer revision.

When the Quality Gate fails, is cancelled, or times out, the controller does not merge. It leaves a SHA-specific `tenx-automerge-failure` comment with the failing Quality Gate run so the TENX repair loop can inspect the diff and logs, make the smallest safe fix, and let the gate run again.

## Production handoff

The autonomous merge is performed with the repository-scoped `github.token`. GitHub intentionally prevents most events created by `GITHUB_TOKEN` from starting another workflow run, so the controller does not rely on the normal `push` event after its merge.

Immediately after a successful exact-SHA merge, the controller explicitly dispatches the existing `cloudflare-deploy.yml` workflow on `main`. `workflow_dispatch` is an allowed `GITHUB_TOKEN` recursion exception, which preserves the production pipeline without introducing a personal access token or long-lived secret.

The existing `Titans Cloudflare Deploy` workflow remains the production deployment owner. Its completion continues into the existing `workflow_run`-based Current Experience/post-deploy audit chain, so autonomous merges still receive the same production verification as manual merges.

## Security boundary

The controller deliberately uses `workflow_run` from the trusted default-branch workflow definition. It does not use `pull_request_target`, does not check out or execute pull-request code, accepts no fork PRs, and uses only the repository-scoped `github.token`. Its explicit permissions are Actions-write only so it can dispatch the established production workflow, contents-write for the exact-SHA merge, and pull-request-write for merge/failure-comment operations.

## Operating model

New autonomous TENX PRs should carry the marker from creation. Existing or unrelated pull requests remain manual unless deliberately opted in. Production verification remains owned by the existing Cloudflare deploy and post-deploy browser audit workflows after merge.
