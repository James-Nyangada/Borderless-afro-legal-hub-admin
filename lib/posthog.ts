export async function fetchPostHogData(query: string) {
  const POSTHOG_HOST = process.env.POSTHOG_HOST || 'https://us.posthog.com';
  const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
  const POSTHOG_PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

  if (!POSTHOG_PROJECT_ID || !POSTHOG_PERSONAL_API_KEY) {
    console.error('PostHog environment variables are missing');
    return null;
  }

  const response = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${POSTHOG_PERSONAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query: query,
      },
    }),
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!response.ok) {
    console.error('Failed to fetch PostHog data', await response.text());
    return null;
  }

  const data = await response.json();
  return data.results;
}

export async function getDashboardAnalytics() {
  const [pageviewsResult, visitorsResult, sessionsResult, topPostsResult, trafficSourcesResult] = await Promise.all([
    // Page Views
    fetchPostHogData(`SELECT count() FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY`),
    // Unique Visitors
    fetchPostHogData(`SELECT count(DISTINCT person_id) FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY`),
    // Sessions Stats (Avg Duration and Bounce Rate)
    fetchPostHogData(`SELECT avg($session_duration), avg($is_bounce) FROM sessions WHERE $start_timestamp >= now() - INTERVAL 30 DAY`),
    // Top Posts
    fetchPostHogData(`
      SELECT properties.$pathname AS path, count() AS views 
      FROM events 
      WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY AND properties.$pathname IS NOT NULL
      GROUP BY path 
      ORDER BY views DESC 
      LIMIT 5
    `),
    // Traffic Sources
    fetchPostHogData(`
      SELECT properties.$referring_domain AS domain, count() AS views 
      FROM events 
      WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY AND properties.$referring_domain IS NOT NULL
      GROUP BY domain 
      ORDER BY views DESC 
      LIMIT 4
    `)
  ]);

  const pageviews = pageviewsResult?.[0]?.[0] ?? 0;
  const visitors = visitorsResult?.[0]?.[0] ?? 0;
  
  // Parse session stats
  const avgDurationSeconds = sessionsResult?.[0]?.[0] ? Math.round(Number(sessionsResult[0][0])) : 0;
  const bounceRateNum = sessionsResult?.[0]?.[1] ? Number(sessionsResult[0][1]) * 100 : 0;
  
  const avgSessionDuration = avgDurationSeconds > 0 
    ? `${Math.floor(avgDurationSeconds / 60)}m ${avgDurationSeconds % 60}s` 
    : '0m 0s';
  const bounceRate = bounceRateNum.toFixed(1);
  
  const topPosts = topPostsResult?.map((row: [string, number]) => ({
    title: row[0] === '/' ? 'Home Page' : row[0],
    views: row[1],
    engagement: 'N/A' // This is hard to calculate in a single query
  })) || [];

  const trafficSources = trafficSourcesResult?.map((row: [string, number]) => ({
    source: row[0] === '$direct' ? 'Direct' : (row[0] || 'Unknown'),
    percentage: pageviews > 0 ? Math.round((row[1] / pageviews) * 100) : 0
  })) || [];

  return {
    pageviews,
    visitors,
    bounceRate,
    avgSessionDuration: '2m 45s', // Placeholder for now
    topPosts,
    trafficSources,
  };
}

export async function getBlogViewsMap() {
  const result = await fetchPostHogData(`
    SELECT properties.$pathname AS path, count() AS views 
    FROM events 
    WHERE event = '$pageview' AND properties.$pathname LIKE '/blog/%'
    GROUP BY path
  `);
  
  const viewsMap: Record<string, number> = {};
  if (result) {
    result.forEach((row: [string, number]) => {
      // Remove '/blog/' to just get the slug
      const slug = row[0].replace('/blog/', '');
      viewsMap[slug] = row[1];
    });
  }
  return viewsMap;
}
