<!-- This file is a translation of EVENT_TRACKER.ko.md (source of truth). -->

# Data collection

This document covers how to receive the events sent by `src/features/event-tracker` in Google Tag Manager and Google Analytics. For how to write tracking functions, see the code.

## Overview

Skillpedia sends data to Analytics through a Tag Manager container. The container is added to the page only when the `GTM_ID` environment variable has a value and the app is built in production mode.

The following values are collected.

- Repository names and document paths
- Code block languages
- Repository card ranks

The following are not collected.

- Any value that identifies a visitor
- Input that fails the repository format check

## Events

| Event                          | Sent when                                                         | Parameters                 |
| ------------------------------ | ----------------------------------------------------------------- | -------------------------- |
| `hero_submit_button_click`     | The hero form is submitted and passes the repository format check | `repository`, `is_example` |
| `repository_card_click`        | A repository card is clicked                                      | `repository`, `rank`       |
| `repository_card_impression`   | A repository card stays at least half visible for one second      | `repository`, `rank`       |
| `sidebar_document_link_click`  | A document item in the sidebar or side panel is clicked           | `repository`, `path`       |
| `code_block_copy_button_click` | The copy button on a code block is pressed and the copy succeeds  | `language`                 |

| Parameter    | Value                                                                 |
| ------------ | --------------------------------------------------------------------- |
| `repository` | Repository name in `{owner}/{repo}` format                            |
| `path`       | Document path, starting with `/{owner}/{repo}`                        |
| `language`   | Code block language, or `text` when none is set                       |
| `rank`       | Repository card rank, or `0` for cards without a rank badge           |
| `is_example` | `true` when the form is submitted empty and moves to the example repo |

- Parameters without a value are not sent, so the copy event sends only `language`.
- Page views are not in this list because the Google tag added in Tag Manager collects them automatically.

## Before you start

Create an Analytics property and a Tag Manager container, then take note of two values.

| Value          | Format             | Where to find it                   |
| -------------- | ------------------ | ---------------------------------- |
| Measurement ID | Starts with `G-`   | Analytics > Admin > Data streams   |
| Container ID   | Starts with `GTM-` | Tag Manager > top of the workspace |

When Analytics asks how you want to install the tag, skip the code snippet since you are using Tag Manager.

Skillpedia changes screens through client-side routing. To count moves between documents as page views, turn on 'Page changes based on browser history events' under Analytics > Admin > Data streams > Enhanced measurement.

## Tag Manager setup

### Variables

Enable the `Event` built-in variable. The tag uses it to pass the event name through.

Create five data layer variables as user-defined variables.

| Variable type       | Data layer variable name |
| ------------------- | ------------------------ |
| Data Layer Variable | `repository`             |
| Data Layer Variable | `rank`                   |
| Data Layer Variable | `path`                   |
| Data Layer Variable | `language`               |
| Data Layer Variable | `is_example`             |

- The data layer variable name must match the key the code sends, character for character.
- Leave 'Set Default Value' unchecked, since checking it puts that value into events that do not carry the key.
- Create the measurement ID as a constant variable and reference it from the tags.

### Trigger

Create one custom event trigger.

| Field                 | Value                   |
| --------------------- | ----------------------- |
| Trigger type          | Custom Event            |
| Event name            | `_(click\|impression)$` |
| Use regex matching    | Checked                 |
| This trigger fires on | All Custom Events       |

- Without regex matching, the event name has to equal this string exactly, so nothing matches.

### Tags

Create two tags.

**Google tag**

| Field    | Value                      |
| -------- | -------------------------- |
| Tag type | Google Tag                 |
| Tag ID   | Measurement ID             |
| Trigger  | Initialization - All Pages |

- This tag initializes Analytics and sends page views.

**GA4 event tag**

| Field          | Value                          |
| -------------- | ------------------------------ |
| Tag type       | Google Analytics: GA4 Event    |
| Measurement ID | Measurement ID                 |
| Event name     | `{{Event}}`                    |
| Trigger        | The custom event trigger above |

Add five rows under event parameters.

| Event parameter | Value                     |
| --------------- | ------------------------- |
| `repository`    | `{{repository variable}}` |
| `rank`          | `{{rank variable}}`       |
| `path`          | `{{path variable}}`       |
| `language`      | `{{language variable}}`   |
| `is_example`    | `{{is_example variable}}` |

- Setting the event name to `{{Event}}` lets one tag forward every event, so you do not need a tag per event.
- In preview mode, clicking a card on the home page should show `repository_card_click` in the event list with the GA4 event tag under 'Tags Fired'.
- Publish once you have confirmed it.

## Analytics setup

Parameters have to be registered before they appear in reports. Create them under Analytics > Admin > Data display > Custom definitions.

| Event parameter | Create as        | Scope |
| --------------- | ---------------- | ----- |
| `repository`    | Custom dimension | Event |
| `path`          | Custom dimension | Event |
| `language`      | Custom dimension | Event |
| `is_example`    | Custom dimension | Event |
| `rank`          | Custom metric    | Event |

- `is_example` records true and false as strings, so create it as a custom dimension.
- Registration does not apply to data received earlier.

## Environment variable

Put the container ID in `GTM_ID`.

```properties
GTM_ID=GTM-XXXXXXX
```

- Set the same value in your deployment environment. When deploying with GitHub Actions, register it under Variables in the repository settings.
- The value appears in the published page source, so use Variables rather than Secrets.
- Even when `GTM_ID` is set, the tag is not included in development mode; the container loads only in production mode, which `npm run build` creates.

## Adding events

The trigger selects events by name suffix, so an event name ending in `_click` or `_impression` is collected without touching Tag Manager.

```typescript
// src/features/event-tracker/lib/repository.tracker.ts

export const trackingTocLinkClick = (repository: string, path: string) => {
  trackingEvent('toc_link_click', { repository, path });
};
```

- With any other suffix, update the trigger regex as well.
- Otherwise the event only piles up in the data layer and never reaches Analytics.

Sending a new parameter takes three steps.

1. Add a data layer variable in Tag Manager
2. Add an event parameter row to the GA4 event tag
3. Register a custom definition in Analytics

- Checking whether an existing parameter answers the question first keeps this work down.
- The event name already carries what was pressed, so splitting event names is simpler than adding a parameter for position.
