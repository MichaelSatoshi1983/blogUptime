const pageConfig = {
  // Title for your status page
  title: "Day 1 Blog 及其周边服务监控页面",
  // Links shown at the header of your status page, could set `highlight` to `true`
  links: [
    { link: 'https://github.com/MichaelSatoshi1983', label: 'GitHub' },
    { link: 'https://day1.pub', label: 'Blog' },
    { link: 'mailto:satoshi1983@zohomail.com', label: '给我发邮件', highlight: true },
  ],
  // [OPTIONAL] Group your monitors
  // If not specified, all monitors will be shown in a single list
  // If specified, monitors will be grouped and ordered, not-listed monitors will be invisble (but still monitored)
  group: {

    '主站点': ['Blog'],
    '提供的服务': ['Docker Mirror', 'Pastebin'],
    '使用的服务': ['Github', 'Cloudflare', 'Google Search Console', 'Bing Webmasters Tools'],
  },
}

const workerConfig = {
  // Write KV at most every 3 minutes unless the status changed
  kvWriteCooldownMinutes: 3,
  // Enable HTTP Basic auth for status page & API by uncommenting the line below, format `<USERNAME>:<PASSWORD>`
  // passwordProtection: 'username:password',
  // Define all your monitors here
  monitors: [
    // Example HTTP Monitor
    {
      id: 'Blog',
      name: 'Day 1 Blog',
      method: 'GET',
      target: 'https://day1.pub',
      tooltip: 'Day 1 Blog',
      statusPageLink: 'https://day1.pub',
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15',
      },
    },
    {
      id: 'Docker Mirror',
      name: 'Docker Mirror',
      method: 'GET',
      target: 'https://docker.day1.pub',
      tooltip: 'Docker 镜像平台',
      statusPageLink: 'https://docker.day1.pub',
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15',
      },
    },
    {
      id: 'Pastebin',
      name: 'Pastebin 在线剪切板',
      method: 'GET',
      target: 'https://paste.day1.pub',
      tooltip: '在线剪切板',
      statusPageLink: 'https://paste.day1.pub',
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15',
      },
    },
    {
      id: 'Github',
      name: 'Github',
      method: 'GET',
      target: 'https://github.com',
      tooltip: 'Github 代码托管平台',
      statusPageLink: 'https://github.com',
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15',
      },
    },
    {
      id: 'Cloudflare',
      name: 'Cloudflare',
      method: 'GET',
      target: 'https://cloudflare.com',
      tooltip: 'Cloudflare 云解析平台',
      statusPageLink: 'https://cloudflare.com',
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15',
      },
    },
    {
      id: 'Google Search Console',
      name: 'Google Search Console',
      method: 'GET',
      target: 'https://search.google.com/search-console/',
      tooltip: 'Google 搜索控制台',
      statusPageLink: 'https://search.google.com/search-console/',
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15',
      },
    },

    {
      id: 'Bing Webmasters Tools',
      name: 'Bing Webmasters Tools',
      method: 'GET',
      target: 'https://www.bing.com/webmasters/about',
      tooltip: 'Bing 搜索控制台',
      statusPageLink: 'https://www.bing.com/webmasters/about',
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15',
      },
    },







    // Example TCP Monitor
    // {
    //   id: 'test_tcp_monitor',
    //   name: 'Example TCP Monitor',
    //   // `method` should be `TCP_PING` for tcp monitors
    //   method: 'TCP_PING',
    //   // `target` should be `host:port` for tcp monitors
    //   target: '1.2.3.4:22',
    //   tooltip: 'My production server SSH',
    //   statusPageLink: 'https://example.com',
    //   timeout: 5000,
    // },
  ],
  notification: {
    // [Optional] apprise API server URL
    // if not specified, no notification will be sent
    appriseApiServer: 'https://apprise.example.com/notify',
    // [Optional] recipient URL for apprise, refer to https://github.com/caronc/apprise
    // if not specified, no notification will be sent
    recipientUrl: 'tgram://bottoken/ChatID',
    // [Optional] timezone used in notification messages, default to "Etc/GMT"
    timeZone: 'Asia/Shanghai',
    // [Optional] grace period in minutes before sending a notification
    // notification will be sent only if the monitor is down for N continuous checks after the initial failure
    // if not specified, notification will be sent immediately
    gracePeriod: 5,
    // [Optional] disable notification for monitors with specified ids
    skipNotificationIds: ['foo_monitor', 'bar_monitor'],
  },
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // This callback will be called when there's a status change for any monitor
      // Write any Typescript code here
      // This will not follow the grace period settings and will be called immediately when the status changes
      // You need to handle the grace period manually if you want to implement it
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // This callback will be called EVERY 1 MINTUE if there's an on-going incident for any monitor
      // Write any Typescript code here
    },
  },
}

// Don't forget this, otherwise compilation fails.
export { pageConfig, workerConfig }
