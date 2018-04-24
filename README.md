[![Build status](https://ci.appveyor.com/api/projects/status/ey2un6spnk655g4y?svg=true)](https://ci.appveyor.com/project/nathanwoulfe/promote)

# Promote - Ad modules for Umbraco

Promote is a backoffice extension for creating reusable promo modules, which can then be injected into pages without content updates or adding properties to content types.

## Why?

I'm often asked to 'add an image to this sidebar', or 'put a banner on this page'. All good, but depending on the content type in question, it might not actually be possible.

Since we work to a tightly managed release schedule, it's not possible to quickly add a new property, modify some views, and allow editors to add content themselves.

We do use Google Tag Manager for all manner of tagging and tracking, so can leverage GTM to inject elements into the DOM. But that means writing custom javascript each time, and we're out of luck if the end user is running an ad blocker.

## What?

Promote circumvents these issues by allowing creation of simple promotional modules (think image wrapped in a link), which can be managed from a backoffice dashboard.

Modules are assigned to a single page or all pages of a particular content type, and set to display in a particular location (defined via CSS selector). A module can have additional CSS and JS, and can optionally include a querystring in the rendered link.

## How?

Modules are injected into the response via a middleware layer, which performs output filtering on the current request and inserts any matching modules into the HTML.

Modules are cached on application startup to make things nice and speedy. 

That injection includes a Javascript reference, which relocates the rendered element to the correct location in the DOM.