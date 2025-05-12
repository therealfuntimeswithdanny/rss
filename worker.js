/**
 * This worker generates an RSS feed inspired by 9to5Google's,
 * with an added cover photo image for each post.
 * It uses a static array of posts. In a real-world scenario,
 * you can replace this with dynamic data from an API or database.
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Entry point for the worker that generates the RSS XML.
 */
async function handleRequest(request) {
  // Example posts array — replace with your dynamic data if necessary.
  const posts = [
    {
      title: "Microsoft is revamping the Windows 11 Start menu",
      link: "https://blog.madebydanny.uk/static/microsoft-is-revamping-the-windows-11-start-menu.html",
      description: "Microsoft is revamping the Windows 11 Start menu",
      coverPhoto: "https://cdn.funtimesmedia.uk/blogs/bafkreiea62uuadl274v2rwytrjuo3kcxanxrg3l2mzqa7b2l2vtwvaxntm.jpg", // URL for the cover photo
    },
    {
      title: "Google just revealed its next big Android redesign      ",
      link: "https://blog.madebydanny.uk/static/Google-just-revealed-its-next-big-Android-redesign.html",
      description: "Found in a deleted 9to5Google post, Google accidentally revealed the next Android redesign.",
      coverPhoto: "https://cdn.funtimesmedia.uk/blogs/AA1EdwZi.png", // URL for the cover photo
    },
    {
      title: "The Best time to Post on YouTube      ",
      link: "https://blog.madebydanny.uk/static/the-best-time-to-post-on-youtube.html",
      description: "I'm gonna share with you the best times to post your videos to maximize views, all thanks to some awesome tips from Buffer.",
      coverPhoto: "https://cdn.funtimesmedia.uk/blogs/best-time-to-post-on-youtube-main.png", // URL for the cover photo
      pubDate: new Date("2025-05-09T12:00:00Z").toUTCString(),
    },
    {
      title: "My New Best Friend      ",
      link: "https://blog.madebydanny.uk/static/my-new-best-friend.html",
      description: "For the past couple of weeks, I've been using my Raspberry Pi 4 as my main computer. It's been a fun little experiment.",
      coverPhoto: "https://cdn.funtimesmedia.uk/blogs/538545649b8f9e6a8b077d3f52e5e06e.original.jpg", // URL for the cover photo
      pubDate: new Date("2025-05-09T12:00:00Z").toUTCString(),
    },
    {
      title: "Bluesky Adds Verification via Blue Check Marks",
      link: "https://blog.madebydanny.uk/static/bsky-verification.html",
      description: "Bluesky is adding Blue Check Marks for Verification of Bluesky Accounts! Hopefully I get one!",
      coverPhoto: "https://cdn.funtimesmedia.uk/blogs/4-21-25-verification-diagram.png", // URL for the cover photo
      pubDate: new Date("2025-05-09T12:00:00Z").toUTCString(),
    },
    {
      title: "iPhone 14, 3 years later",
      link: "https://blog.madebydanny.uk/static/the-iphone-13-4-years-later",
      description: "Apple announced the iPhone 14 three years ago; how does it work today!",
      coverPhoto: "https://cdn.funtimesmedia.uk/blogs/4-28-25-iphone-14-red.jpg", // URL for the cover photo
      pubDate: new Date("2025-05-09T12:00:00Z").toUTCString(),
    },
    {
      title: "Fontawesome is awesome!      ",
      link: "https://blog.madebydanny.uk/static/fontawesome-is-awesome.html",
      description: "Fontawesome is awesome and your website can be awesome with Fontawesome, now that's a lot of awesome!",
      coverPhoto: "https://cdn.funtimesmedia.uk/blogs/4-29-25-fontawesome.jpg", // URL for the cover photo
      pubDate: new Date("2025-05-09T12:00:00Z").toUTCString(),
    },
    {
      title: "Is HTML going away forever",
      link: "https://madebydanny.uk/static/text-clip/ishtmlgoneforever.html",
      description: "What happend to HTML?",
      pubDate: new Date("2025-05-09T12:00:00Z").toUTCString(),
    },
    {
      title: "Matter’s latest update adds tap-to-pair setup via NFC",
      link: "https://madebydanny.uk/static/matter-update-with-nfc.html",
      description: "Two groundbreaking updates are being introduced to Matter, designed to streamline the installation process of smart home devices.",
      coverPhoto: "https://cdn.funtimesmedia.uk/blogs/056a60b57c68fcddbaeb4de7bdaea912.original.webp", // URL for the cover photo
      pubDate: new Date("2025-05-011T12:00:00Z").toUTCString(),
    },
        {
      title: "Microsoft is giving hope for Windows on tablets",
      link: "https://blog.madebydanny.uk/static/windows-tablets",
      description: "Just like how Apple thinks their iPad is a computer, Microsoft thinks their new 12-Inch Surface Pro is a tablet.",
      coverPhoto: "https://cdn.funtimesmedia.uk/blogs/microsoft-surface-pro-12inch-colors.webp", // URL for the cover photo
      pubDate: new Date("2025-05-012T8:29:00Z").toUTCString(),
    },
  ];

  // Assemble each post into an RSS <item> element.
  let itemsXML = posts.map(post => {
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.link)}</link>
      <guid isPermaLink="true">${escapeXml(post.link)}</guid>
      <pubDate>${post.pubDate}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      ${
        post.coverPhoto
          ? `<media:content url="${escapeXml(post.coverPhoto)}" medium="image" type="image/jpeg" />`
          : ""
      }
    </item>`;
  }).join("");

  // Note the addition of the Media RSS namespace (xmlns:media) in the <rss> tag
  let rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Danny's Blog RSS Feed</title>
    <link>https://blog.madebydanny.uk</link>
    <description>My RSS feed for my blog, that i use for my blog bot on bluesky</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${itemsXML}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

/**
 * Helper function to escape XML special characters.
 */
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function(c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
