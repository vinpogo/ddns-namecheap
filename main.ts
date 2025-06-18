const hosts = Deno.env.get("HOSTS");
const domain = Deno.env.get("DOMAIN");
const passwordFile = Deno.env.get("PASSWORD_FILE")!;
const cron = Deno.env.get("CRON") ?? "0 * * * *";

const password = await Deno.readTextFile(passwordFile);

if (!(hosts && domain && password)) {
  console.error(
    `Missing required configuration. Check environment variables: ${
      JSON.stringify({ hosts, domain, passwordProvided: !!password })
    }`,
  );
  Deno.exit(EXIT_CODES.MISSING_CONFIG);
}
console.log("Server started successfully");

async function updateDnsRecord(
  args: { host: string; domain: string; password: string; ip: string },
) {
  console.log(`Updating DNS record for ${args.host} ...`);
  // https://dynamicdns.park-your-domain.com/update?host=[host]&domain=[domain_name]&password=[ddns_password]&ip=[your_ip]
  const url = new URL("https://dynamicdns.park-your-domain.com/update");
  Object.entries(args).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );
  const res = await fetch(url);
  if (res.ok) {
    console.log("DNS record updated successfully");
  }
}

async function getPublicIp() {
  console.log("Getting public ip address...");
  const res = await fetch("https://api.ipify.org?format=json");
  if (res.ok) {
    const { ip } = await res.json() as { ip: string };
    console.log(`Received public ip address: ${ip}`);
    return `${ip}:`;
  }
  console.error("Failed to fetch public IP address");
  Deno.exit(EXIT_CODES.IP_FETCH_FAILED);
}

async function doUpdate() {
  const ip = await getPublicIp();
  if (!(hosts && domain && password && ip)) {
    console.error("Failed to update DNS: missing required data");
    Deno.exit(EXIT_CODES.DNS_UPDATE_FAILED);
  }
  for (const host of hosts.split(",")) {
    await updateDnsRecord({ host, domain, password, ip });
  }
}

Deno.cron("update dns record", cron, doUpdate);

doUpdate();
