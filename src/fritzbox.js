const cf = require('cloudflare');
const { updateCloudflare } = require('./cloudflare');
const config = require('./../config.json');

async function handleUpdate(client, update, ip) {
  const zonesBrowse = await client.zones.browse().catch((error) => {
    console.error(JSON.stringify(error.response.body));
  });
  if (zonesBrowse.result) {
    const zone = zonesBrowse.result.find((z) => update.domain.includes(z.name));
    const result = await updateCloudflare(client, zone, ip, update);
    return result;
  }
  return null;
}

async function fritzboxHandler(req, res) {
  const { user, pass, domain, ip, ip6 } = req.query;

  const client = cf({
    email: user,
    key: pass,
  });
  const result = { ip: false, ip6: false };
  if (ip) {
    console.log(`Set new IP ${ip} for ${domain} with ${user} from fritzbox`);
    const update = {
      type: 'A',
      domain,
      proxied: true,
    };
    result.ip = await handleUpdate(client, update, ip);
  }
  if (config.ipv6Support && ip6) {
    console.log(`Set new IP6 ${ip6} for ${domain} with ${user} from fritzbox`);
    const update = {
      type: 'AAAA',
      domain,
      proxied: true,
    };
    result.ip6 = await handleUpdate(client, update, ip6);
  }

  res.send(result);
}

module.exports = fritzboxHandler;
