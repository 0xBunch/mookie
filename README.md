# Principle

A next-gen Ghost theme that delivers smooth, reload-free browsing for any blog type.

&nbsp;

## Useful links

**Demos: https://principle.highfivethemes.com/**
**Documentation: https://highfivethemes.gitbook.io/principle-user-documentation**

&nbsp;

## Features

1. AJAX-powered Content Loading: The site uses AJAX to dynamically load content without requiring full page reloads.
2. Custom Archive (All Posts), Authors, Categories (tags), Casy Study Post, Case Studies page, Account, Sign In/Up, Subscribe, Error 404 and Membership pages
3. Custom background, borders and buttons colors
4. Customizable border-radius for buttons, inputs, images, containers
5. Translation support
6. Optional image lightbox with zoom for posts
7. Customizable subscribe CTA text and subtext
8. Customizable sidebar subscribe banner and advertising banner

## Installation instructions

1. Go to **Settings > Design** from the admin menu
2. Click **Change theme** in the bottom left corner
3. Then click the **Upload theme** button in the upper right corner
4. Click inside the upload box to select a **principle.zip**, or drag-and-drop the **principle.zip** into the upload box
   5.Once uploaded, click **Activate** to activate the theme

&nbsp;

## Theme structure

The main templates files are:

- [`default.hbs`](default.hbs) - The main template file
- [`index.hbs`](index.hbs) - Used for the home page
- [`post.hbs`](post.hbs) - Used for individual posts
- [`page.hbs`](page.hbs) - Used for individual pages
- [`archive.hbs`](archive.hbs) - Used for Archive (All Posts) page
- [`tag.hbs`](tag.hbs) - Used for tag archives
- [`author.hbs`](author.hbs) - Used for author archives
- [`custom-authors-page.hbs`](custom-authors-page.hbs) - Used for publication's Authors page
- [`custom-categories-page.hbs`](custom-categories-page.hbs) - Used for publication's Categories (Tags) page
- [`error-404.hbs`](error-404.hbs) - Used for 404 Error page
- [`custom-sign-in.hbs`](custom-sign-in.hbs) - Used for custom Sign In page
- [`custom-sign-up.hbs`](custom-sign-up.hbs) - Used for custom Sign Up page
- [`custom-subscribe.hbs`](custom-subscribe.hbs) - Used for custom Subscribe page
- [`custom-membership-page.hbs`](custom-membership-page.hbs) - Used for custom Memberships page
- [`custom-account.hbs`](custom-account.hbs) - Used for custom Account page
- [`custom-case-studies-page.hbs`](custom-case-studies-page.hbs) - Used for custom Case studies page
- [`custom-case-study-post.hbs`](custom-case-study-post.hbs) - Used for custom Case study post

&nbsp;

## Development guide

**principle** theme provides a first-class development experience out of the box.

### Setup

To see realtime changes during development, symlink the **principle** theme folder to the `content/themes` folder in your local Ghost install.

```bash
ln -s /path/to/principle /ghost/content/themes/principle
```

Restart Ghost and select the **principle** theme from **Settings**.

From the theme's root directory, install the dependencies:

```bash
npm install
```

If Node isn't installed, follow the [official Node installation guide](https://nodejs.org/).

### Start development mode

From the **Principle** theme folder, start development mode:

```bash
npm run dev
```

Changes you make to your styles, scripts, and Handlebars files will show up automatically in the browser. CSS and Javascript will be compiled and output to the `built` folder.

Press `ctrl + c` in the terminal to exit development mode.

### Build, zip, and test your theme

Compile your CSS and JavaScript assets for production with the following command:

```bash
npm run build
```

Create a zip archive:

```bash
npm run zip
```

Use `gscan` to test your theme for compatibility with Ghost:

```bash
npm run test
```

&nbsp;

## Copyright & License

Copyright (c) 2024 HighFiveThemes - Released under the MIT license.
