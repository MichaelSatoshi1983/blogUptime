import Head from 'next/head'

import { Inter } from 'next/font/google'
import { MonitorState, MonitorTarget } from '@/uptime.types'
import { KVNamespace } from '@cloudflare/workers-types'
import { pageConfig, workerConfig } from '@/uptime.config'
import OverallStatus from '@/components/OverallStatus'
import Header from '@/components/Header'
import MonitorList from '@/components/MonitorList'
import { Center, Divider, Text } from '@mantine/core'
import MonitorDetail from '@/components/MonitorDetail'

export const runtime = 'experimental-edge'
const inter = Inter({ subsets: ['latin'] })

export default function Home({
  state: stateStr,
  monitors,
}: {
  state: string
  monitors: MonitorTarget[]
  tooltip?: string
  statusPageLink?: string
}) {
  let state
  if (stateStr !== undefined) {
    state = JSON.parse(stateStr) as MonitorState
  }

  // Specify monitorId in URL hash to view a specific monitor (can be used in iframe)
  const monitorId = window.location.hash.substring(1)
  if (monitorId) {
    const monitor = monitors.find((monitor) => monitor.id === monitorId)
    if (!monitor || !state) {
      return <Text fw={700}>Monitor with id {monitorId} not found!</Text>
    }
    return (
      <div style={{ maxWidth: '810px' }}>
        <MonitorDetail monitor={monitor} state={state} />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{pageConfig.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Header />

        {state === undefined ? (
          <Center>
            <Text fw={700}>
              Monitor State is not defined now, please check your worker&apos;s status and KV
              binding!
            </Text>
          </Center>
        ) : (
          <div>
            <OverallStatus state={state} />
            <MonitorList monitors={monitors} state={state} />
          </div>
        )}

        <Divider mt="lg" />
        {/*<Text*/}
        {/*  size="xs"*/}
        {/*  mt="xs"*/}
        {/*  mb="xs"*/}
        {/*  style={{*/}
        {/*    textAlign: 'center',*/}
        {/*  }}*/}
        {/*>*/}
// 在 <Text> 组件内直接插入 HTML 字符串
<Text
  size="xs"
  mt="xs"
  mb="xs"
  style={{ textAlign: 'center' }}
  dangerouslySetInnerHTML={{
    __html: `
      <script src="https://cdn.staticfile.net/jquery/3.4.1/jquery.min.js"></script>
      <script>
        function getCDNinfo() {
          $.ajax({
            url: "/cdn-cgi/trace",
            success: function (data, status) {
              let areas = "Antananarivo, Madagascar - (TNR);...".split(";");
              let area = data.split("colo=")[1].split("\\n")[0];
              let tlsVersion = data.split("tls=")[1].split("\\n")[0];
              let httpVersion = data.split("http=")[1].split("\\n")[0];
              let sniValue = data.split("sni=")[1].split("\\n")[0];
              let ipValue = data.split("ip=")[1].split("\\n")[0];
              let userAgent = data.split("uag=")[1].split("\\n")[0];

              for (var i = 0; i < areas.length; i++) {
                if (areas[i].indexOf(area) != -1) {
                  document.getElementById("cdn").innerHTML = areas[i];
                  break;
                }
              }
              document.getElementById("tls").innerHTML = tlsVersion;
              document.getElementById("http").innerHTML = httpVersion;
              document.getElementById("sni").innerHTML = sniValue;
              document.getElementById("ip").innerHTML = ipValue;
              document.getElementById("useragent").innerHTML = userAgent;
            }
          });
        }
        $(document).ready(function () {
          getCDNinfo();
        });
      </script>
      <p style="text-align: center;">Open Source changes everything!</p>
      <p style="text-align: center;">
        本次加载耗时: 
        <span id="performance-time"></span>
        <script>
          document.getElementById("performance-time").textContent = 
          (performance.getEntriesByType('navigation').reduce((a, b) => a + b.responseEnd - b.startTime, 0) +
          performance.getEntriesByType('resource').reduce((a, b) => a + b.responseEnd - b.startTime, 0)).toFixed(0) + "ms";
        </script>
      </p>
      <p style="text-align: center;">当前 SNI 状态： <span id="sni">正在统计！</span></p>
      <p style="text-align: center;">当前 TLS 版本： <span id="tls">正在统计！</span></p>
      <p style="text-align: center;">当前 HTTP 版本： <span id="http">正在统计！</span></p>
      <p style="text-align: center;">您的客户端 IP： <span id="ip">正在统计！</span></p>
      <p style="text-align: center;">CDN 节点： <span id="cdn">正在统计！</span></p>
      <p style="text-align: center;">UserAgent： <span id="useragent">正在统计！</span></p>
      <script defer src="https://pv.undefined.today/tracker.min.js" data-website-id="BlogStatus-tracker"></script>
    `,
  }}
/>








          {/*Open-source monitoring and status page powered by{' '}*/}
          {/*<a href="https://github.com/lyc8503/UptimeFlare" target="_blank">*/}
          {/*  Uptimeflare*/}
          {/*</a>{' '}*/}
          {/*and{' '}*/}
          {/*<a href="https://www.cloudflare.com/" target="_blank">*/}
          {/*  Cloudflare*/}
          {/*</a>*/}
          {/*, made with ❤ by{' '}*/}
          {/*<a href="https://github.com/lyc8503" target="_blank">*/}
          {/*  lyc8503*/}
          {/*</a>*/}
          {/*.*/}
        {/*</Text>*/}
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const { UPTIMEFLARE_STATE } = process.env as unknown as {
    UPTIMEFLARE_STATE: KVNamespace
  }

  // Read state as string from KV, to avoid hitting server-side cpu time limit
  const state = (await UPTIMEFLARE_STATE?.get('state')) as unknown as MonitorState

  // Only present these values to client
  const monitors = workerConfig.monitors.map((monitor) => {
    return {
      id: monitor.id,
      name: monitor.name,
      // @ts-ignore
      tooltip: monitor?.tooltip,
      // @ts-ignore
      statusPageLink: monitor?.statusPageLink,
      // @ts-ignore
      hideLatencyChart: monitor?.hideLatencyChart,
    }
  })

  return { props: { state, monitors } }
}
