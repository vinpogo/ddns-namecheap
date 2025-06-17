const hosts = Deno.env.get("HOSTS");
const domain = Deno.env.get("DOMAIN");
const passwordFile = Deno.env.get("PASSWORD_FILE")!;
const cron = Deno.env.get("CRON") ?? "0 * * * *";

const password = await Deno.readTextFile(passwordFile);

if (!(hosts && domain && password)) {
  console.error(
    `Something is missing... see ${
      JSON.stringify({ host: hosts, domain, password })
    }`,
  );
  Deno.exit(1);
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
  console.error("Something went wrong while getting public ip");
}

Deno.cron("update dns record", cron, async () => {
  const ip = await getPublicIp();
  if (!(hosts && domain && password && ip)) {
    Deno.exit(1);
  }
  for (const host of hosts.split(",")) {
    await updateDnsRecord({ host, domain, password, ip });
  }
});
