# Production cache versioning

The homepage loads versioned CSS and JavaScript assets (`?v=20260812`). When an asset changes, update the matching `v` value in `index.html` and regenerate city pages with `node build-cities.js`, so visitors receive the updated cached asset.

The `.htaccess` rules enable Apache compression when available and cache versioned static assets for one year. HTML, JSON, XML, and text remain revalidated.
