const cf = require('cloudflare');
const { updateCloudflare } = require('./cloudflare');

async function fritzboxHandler(req, res) {
  const { user, pass, domain, ip } = req.query;
  console.log(`Set new IP ${ip} for ${domain} with ${user} from fritzbox`);

  const update = {
    type: 'A',
    domain,
    proxied: true,
  };

  const client = cf({
    email: user,
    key: pass,
  });
  const zonesBrowse = await client.zones.browse().catch((error) => {
    console.error(error.response.body);
  });
  const zone = zonesBrowse.result.filter((z) => update.domain.includes(z.name));

  const result = await updateCloudflare(client, zone, ip, update);
  res.send(result);
}

module.exports = fritzboxHandler;
