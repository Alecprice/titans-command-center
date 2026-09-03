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

## Security boundary

The controller deliberately uses `workflow_run` from the trusted default-branch workflow definition. It does not use `pull_request_target`, does not check out or execute pull-request code, accepts no fork PRs, and uses only the repository-scoped `github.token` with explicit Actions-read, contents-write, and pull-request-write permissions.

## Operating model

New autonomous TENX PRs should carry the marker from creation. Existing or unrelated pull requests remain manual unless deliberately opted in. Production verification remains owned by the existing Cloudflare deploy and post-deploy browser audit workflows after merge.
