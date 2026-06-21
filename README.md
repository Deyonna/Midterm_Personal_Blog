# 0xdeyonna.sh — Personal Cybersecurity Blog

A personal cybersecurity blog covering HTB machines, CTF writeups, malware analysis, and security research.

**GitHub:** [https://github.com/Deyonna/](https://github.com/Deyonna/)


**Deployment**: [https://deyonna.github.io/Midterm_Personal_Blog/](https://deyonna.github.io/Midterm_Personal_Blog/)

---

## Table of Contents

- [0xdeyonna.sh — Personal Cybersecurity Blog](#0xdeyonnash--personal-cybersecurity-blog)
  - [Table of Contents](#table-of-contents)
  - [Coding Decisions \& Short Descriptions of Each Page](#coding-decisions--short-descriptions-of-each-page)
    - [Index Main Page](#index-main-page)
      - [Latest Activity Section](#latest-activity-section)
      - [CTFTime API](#ctftime-api)
    - [Requests Page](#requests-page)
    - [Writeups Page](#writeups-page)
    - [About Page](#about-page)
    - [Contact Page](#contact-page)
    - [Shared Components](#shared-components)
  - [Performance \& Accessibility Audits](#performance--accessibility-audits)
  - [Questions](#questions)
  - [Reflection](#reflection)

---

## Coding Decisions & Short Descriptions of Each Page

### Index Main Page

This is the main page greeting users into the blog. Short description followed by the latest activity section and the CTFTime upcoming events cards.

#### Latest Activity Section

The homepage shows a live preview of the 4 most recently created requests pulled directly from the same `localStorage` data that the tasks page writes to.

Sorting by `createdAt` ensures correct chronological ordering. The limit of 4 was chosen to keep the homepage concise. The user can click "View all" to go to the requests/tasks page.

If `localStorage` is empty or the parse fails, a fallback message with a link to the requests page is shown instead of an empty section.

#### CTFTime API

This section displays cards containing upcoming CTFs fetched from CTFTime.org using their API. In order for it to work properly both on local environments and on a server an array of proxies was used to overcome CORS limitations.

The page tries to fetch CTF events through 3 proxies in order, stops at the first one that works and then renders CTF cards into the page.

### Requests Page


The (`tasks.html`) page lets visitors submit machines, challenges, or topics they would like covered. Each request is treated as a task with a status that progresses through three stages:

| Status | Meaning |
|---|---|
| **Pending** | Request received, not yet started |
| **In Progress** | Actively being worked on |
| **Completed** | Writeup published |


All data is stored in the browser's `localStorage` under the key `tasks` as a JSON array since there is no backend.

Each task object has the following fields:

```json
{
  "id": 1718000000000,
  "title": "HackTheBox — Machine Name",
  "description": "Optional context or links",
  "category": "HTB | CTF | Malware | TryHackMe | Other",
  "priority": "High | Medium | Low",
  "dueDate": "2026-07-01",
  "status": "pending | in-progress | completed",
  "createdAt": "2026-06-21T10:00:00.000Z"
}
```

ID is created with Date.now() at task creation time so it is always unique.

User is able to create new requests, delete them, and change their status. The table can be sorted by title or due date by clicking the column headers. Filtering is available independently by status and by priority.

The doughnut chart is built with Chart.js on a `<canvas>` element. On first load the chart is created; on subsequent renders the existing chart instance has its data swapped and .update() is called rather than destroying and recreating it, which avoids a visual flash on every change.

The task form uses submit-time validation. On submit, the three required fields, title, category, and priority, are checked with a simple truthy check (!title || !category || !priority). If any are missing, a dismissable Bootstrap alert is injected above the form and the function returns early without creating a task. The alert auto-dismisses after 3 seconds via setTimeout. maxlength attributes on the title (120 characters) and description (300 characters) inputs handle length limits at the HTML level. The due date field is intentionally optional and has no validation.

### Writeups Page

The writeups page displays all published writeups as a filterable, searchable card grid. All writeup data is hardcoded as a const array directly in writeups.js since the content is static and does not require user input or persistence.

The page supports three independent filters that all apply simultaneously, the category, tag, and search query. A writeup only appears if it passes all three at once. The search checks the title, excerpt, and tags so a query like "windows" will match writeups that mention it anywhere.

The tag cloud in the sidebar is built dynamically by looping through every writeup and counting tag occurrences. Tags are then sorted by frequency so the most common ones appear first.

One writeup can be marked featured: true to promote it to the large featured card at the top of the page. Only the first match is used.

Tag clicks inside cards are kept in sync with the tag cloud sidebar. Clicking a tag on a card highlights the matching button in the sidebar and filters the grid, so both entry points behave identically.

Currently no writeups are actually present on the website, it is an implementation to be taken into consideration for future builds. Each time the read button is pressed it goes to the top of the page since `href` is set to `#`.

### About Page

The bio section uses a Bootstrap two-column grid to place the avatar and social links on the left and the text on the right. On smaller screens they are stacked vertically.

This page contains skill chips with current skills, a collaborators grid with team member cards, a testimonials carousel filled with demo data and a timeline of my journey so far.

### Contact Page

The contact form uses two-stage validation. Fields are validated individually on blur. When the user clicks away from a field, it immediately shows a green ring if valid or a red ring with an error message if not, without waiting for a full submit attempt.

On submit, all four fields are validated at once using .every(Boolean) which runs all validators and only proceeds if every one passes, preventing partial submissions. e.preventDefault() stops the browser from reloading the page.

If all fields are valid, the form does not send an email (no backend). Instead it populates a Bootstrap confirmation modal with a summary of what the user typed and displays it. When the modal is closed, the form resets and all validation styling is cleared.


### Shared Components

**File:** `js/components.js`

Rather than copying the navbar and footer HTML into every page, both are defined once as template literals in `components.js` and injected at runtime into placeholder `<div>` elements (`#navbar-placeholder`, `#footer-placeholder`). This means a change to the nav or footer only needs to be made in one place and takes effect across all pages immediately.

After the navbar HTML is injected, `components.js` immediately calls `ThemeManager.updateIcon()` to set the toggle button's icon to match the already-applied theme. Without this step the icon would always render as the default moon on page load, even if dark mode was active. This is necessary because `theme.js` runs before the button exists in the DOM, `components.js` creates it, so the icon sync must happen here after injection.

The copyright year in the footer is set with `new Date().getFullYear()` rather than a hardcoded value, so it updates automatically each year without any maintenance.

Anti FOUC script on every page head in order to avoid flashing.

**File:** `css/common.css`

This file holds all styles that are used across more than one page, the navbar, footer, accent button, and global CSS variables. Page-specific styles live in their own separate files (`about.css`, `tasks.css`, etc.) to keep concerns separated and avoid one page's styles accidentally affecting another.

All recurring design tokens are defined on `:root` so they can be referenced anywhere and changed from one place.

The site uses Bootstrap 5.3's built-in dark mode, which is controlled by the `data-bs-theme` attribute on `<html>`. The shared CSS leans on Bootstrap's own semantic colour tokens (`var(--bs-border-color)`, `var(--bs-body-color)`, `var(--bs-secondary-color)`) rather than hardcoded colours for borders, text, and backgrounds. This means the navbar, footer, and all components automatically adapt to both light and dark mode without any extra CSS.

## Performance & Accessibility Audits

Audited performance and accessibility using [PageSpeed Insights](https://pagespeed.web.dev/) (powered by Lighthouse).

| Page | Report |
|---|---|
| Home (`index.html`) | [View report](https://pagespeed.web.dev/analysis/https-deyonna-github-io-Midterm_Personal_Blog/xacwg112zz?form_factor=desktop) |
| Writeups (`writeups.html`) | [View report](https://pagespeed.web.dev/analysis/https-deyonna-github-io-Midterm_Personal_Blog-writeups-html/hq9pt4or6r?form_factor=desktop) |
| Requests (`tasks.html`) | [View report](https://pagespeed.web.dev/analysis/https-deyonna-github-io-Midterm_Personal_Blog-tasks-html/rzet4mj4kf?form_factor=desktop) |
| About (`about.html`) | [View report](https://pagespeed.web.dev/analysis/https-deyonna-github-io-Midterm_Personal_Blog-about-html/7ndym9392c?form_factor=desktop)  |
| Contact (`contact.html`) | [View report](https://pagespeed.web.dev/analysis/https-deyonna-github-io-Midterm_Personal_Blog-contact-html/partadwrof?form_factor=desktop)  |

Overall great scores both for performance and accessibility. Suggestion to load only specific parts of bootstrap and jquery to reduce loading times.


## Questions

**How are different viewports handled?**

Bootstrap's responsive grid system handles layout at different screen sizes using breakpoint classes. The two-column layout on the tasks page uses col-lg-4 and col-lg-8 where on large screens (≥992px) they sit side by side, but on smaller screens Bootstrap automatically stacks them to full width. The navbar uses navbar-expand-lg, which means it shows the full link list on large screens and collapses it on smaller ones. When collapsed, Bootstrap hides the links and shows a hamburger button (navbar-toggler).

**How is theme persistent and what is FOUC?**

FOUC stands for Flash of Unstyled Content which is the brief flicker where the page loads in the wrong theme before JS runs and corrects it. To prevent this, every page has an inline `<script>` tag at the very top of `<head>`, before any CSS loads, that reads the saved theme from localStorage and sets data-bs-theme on the `<html>` element immediately. By the time Bootstrap's CSS loads and reads that attribute, it's already correct. When the user toggles the theme, theme.js updates data-bs-theme on the live page and saves the choice to localStorage. Every subsequent page load reads that saved value and applies it before anything paints.


**Why Chart.js?**

The task page needs a doughnut chart to visualise the breakdown of requests by status. Chart.js is a lightweight library that handles all the drawing on an HTML `<canvas>` element, calculating slice sizes, rendering the legend, and showing percentage tooltips on hover. Without it, achieving the same result would require manually calculating geometry and complex code.

**How is persistence possible with no backend?**

All task data is stored in the browser's localStorage which is a built-in key/value store that survives page refreshes, tab closes, and browser restarts. When the page loads, loadTasks() reads the saved JSON string from localStorage and parses it back into a JavaScript array. Every time a task is added, edited, or deleted, saveTasks() converts the updated array back to a JSON string and writes it to localStorage. Because localStorage belongs to the domain rather than a specific page, the data is accessible across all pages of the site. The trade-off is that data only exists in that specific browser since it doesn't sync across devices.


## Reflection

The main challenge was coordinating the shared `localStorage` data between the tasks page and the homepage activity feed. Because both pages read the same key independently, any change to the task schema (adding a field, renaming a status value) had to be reflected consistently in both `tasks.js` and `main.js` to avoid rendering gaps.

A second challenge was the persistent theme system throughout the pages while also solving the toggle button timing problem. The toggle button is injected by `components.js` after `theme.js` has already run, so a direct event listener on the button would silently fail. This was solved by attaching the click handler to `document` via event delegation, and having `components.js` call `ThemeManager.updateIcon()` immediately after injecting the navbar to sync the icon state.

Handling asynchronous API calls to CTFTime also proved challenging but chaining promises through multiple CORS proxies was necessary to gracefully handle failures without crashing the page.
