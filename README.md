# Neelix Practices Experience

This GitHub action conditionally creates a Neelix Experience based three
observed behavioral parameters - 
[number of additional commits](#additional-commits),
[days to merge](#days-to-merge) and [lines of code changed](#code-changed).
This action is intended to be used only when a PR is merged and may break or
have unexpected behavior in other circumstances. If you're looking for an
action with more direct control over the Experience created, check out
[create-experience-action](https://github.com/neelix-io/create-experience-action).

## Usage

You will first need to obtain a Neelix API token for your action. Directions
can be found [here](https://platform.neelix.io/api). Be sure to keep your token
secure. We recommend storing it as a
[secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets).
Next get the ID for the consortium for your experiences. This can be found using
the [API Developer helper tool](https://platform.neelix.io/api-developer-helper).
Provide the target consortium ID to the action, as well as any additional
parameters you would like to include.


### Example:

```yaml
name: Create Neelix Simple Net Experience

on:
  pull_request:
    types:
      - closed

jobs:
  create-practices-experience:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: neelix-io/practices-experience-action@v1
        with:
          api-token: ${{ secrets.API_TOKEN }}
          consortium-id: 017af22f-bffb-45a6-8272-01a6066195f3
          commentary: "My experience commentary"
          weight: 3
          activity-id: 275
          category-ids: 8056,3248,7297
          team-ids: 8806,9005
          days-to-merge-limit: 1,3
          additional-commits-limit: ,5
          code-changed-limit: 10,
```

### Inputs

* api-token (required): A valid Neelix API token with access to the specified
  consortium.
* consortium-id (required): ID of target consortium.
* commentary (required): Sets the `commentary` field of the new Exprience.
* weight: Sets the `weight` field of the new Exprience.
* activity-id: ID of an activity belonging to same consortium as experience.
  Sets `activity_id` field of new experience.
* category-ids: IDs of categories belonging to same consortium as experience.
  Use comma-separated list for multiple values (e.g. "1,2,3"). Adds specified
  categories to new experience.
* team-ids: IDs of teams belonging to same consortium as experience. Use
  comma-separated list for multiple values (e.g. "1,2,3"). Adds specified teams
  to new experience.
* days-to-merge-limit: [Additional commits](#additional-commits) upper and/or
  lower limit.
* additional-commits-limit: [Days to merge](#days-to-merge) upper and/or lower
  limit.
* code-changed-limit: [lines of code changed](#code-changed) upper and/or
  lower limit.
* github-token: GitHub token used to authenticate against GitHub API to
  retrieve PR review data. Default: GITHUB_TOKEN from github context.

## Conditions

A Neelix Experience will only created if all observed values fall within
specified limits. If a limit is omitted, no restriction will be applied. For
example, if `days-to-merge-limit` is specified, but `additional-commits-limit`
and `code-changed-limit` are not, a Neelix Experience will be created for any
PR that falls within the `days-to-merge-limit`, regardless of the number of
additional commits or lines of code changed.

Each limit consists of a string with two integers - a lower limit and and upper
limit - separated by a comma. Limits are inclusive, so "1,3" will match 1, 2 or 3.
If either a lower or upper limit is omitted, no restriction will be applied. For
example, "1," will match all values greater than or equal to 1, and ",3" will
match all values less than or equal to 3.

Observed values are defined as follows:

### Additional Commits

Number of commits created after PR was opened and before merged. Can be zero or
more.

### Days to Merge

Number of days from when PR was opened until it was closed, rounded up to the
nearest day. Can be 1 or greater.

### Code Changed

Number of new lines plus number of lines deleted in the whole PR. Multiple
changes to the same line in separate commits should only be counted once. Can be
zero or more.
