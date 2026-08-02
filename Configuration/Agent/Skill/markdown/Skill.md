---
name: markdown
description: Write Markdown files in the monorepo.
---

Use this skill to write well-formed TSDoc for both public APIs and internal tooling.

## Copyright Header

Every markdown file should begin with the following header,

```md
<span style="font-size: 12px;">Documentation for ${PRODUCT_NAME}.<br />(c) 2024&mdash;${CURRENT_YEAR} Gage Sorrell.  Provided under the [MIT License](${NEAREST_LICENSE_MD_FILE}).</span>
```

unless the file begins with frontmatter, in which case this header should appear immediately after the frontmatter, separated by an additional linebreak.  The variable names referenced in the above header template should be filled in as,

* `${PRODUCT_NAME}`: the package name ("SorrellWm" for the window manager, otherwise the name of the `npm` package to which the markdown file belongs)
* `${CURRENT_YEAR}`: the current year
* `${NEAREST_LICENSE_MD_FILE}`: the path to the nearest `License.md` file

## Diction and grammatical conventions

* The general writing style should be reminiscent of popular 20th-century mathematical texts
* Text that precedes a list should end the line with a comma, not a colon
* List items should not end with a period
* Sentences in the same paragraph should be separated by two spaces, not one space
* Lists that enumerate a discrete set of possibilities should be labeled with lowercase roman numerals
* Use US English
