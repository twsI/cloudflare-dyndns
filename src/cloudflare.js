const cf = require('cloudflare');
const publicIp = require('public-ip');

const config = require('./../config.json');

async function updateCloudflare(client, zone, ip, update) {
  const dnsBrowse = await client.dnsRecords.browse(zone.id).catch((error) => {
    console.error(error.response.body);
  });
  let updated = false;

  for (const dns of dnsBrowse.result) {
    if (dns.name === update.domain) {
      if (dns.content !== ip) {
        const dnsRecordNew = await client.dnsRecords
          .edit(zone.id, dns.id, {
            content: ip,
            type: update.type,
            proxied: update.proxied,
            name: update.domain,
          })
          .catch((error) => {
            console.error(error.response.body);
          });

        updated = true;
        console.log(`DNS update for ${dns.name} successfull: ${JSON.stringify(dnsRecordNew.result)}`);
      } else {
        console.log(`DNS for ${dns.name} was not updated because IP did not change`);
      }
    }
  }
  return updated;
}

async function updateAll() {
  console.log('Loading configuration file and CloudFlare settings....');

  const getIPs = async () => {
    return {
      ipv4: await publicIp.v4(),
      ipv6: config.ipv6Support ? await publicIp.v6() : null,
    };
  };
  const { ipv4, ipv6 } = await getIPs();

  for (const account of config.accounts) {
    const { credentials, zones } = account;
    const useToken = Object.prototype.hasOwnProperty.call(credentials, 'token');
    const cfConfig = (() => {
      if (useToken) {
        return {
          token: credentials.token,
        };
      }
      return {
        email: credentials.email,
        key: credentials.key,
      };
    })();
    const client = cf(cfConfig);

    const zonesBrowse = await client.zones.browse().catch((error) => {
      console.error(error.response.body);
    });

    for (const zone of zonesBrowse.result) {
      for (const configZone of zones) {
        if (zone.name === configZone.name) {
          const { updates } = configZone;

          for (const update of updates) {
            let updateIp = ipv4;
            if (config.ipv6Support) updateIp = update.type === 'AAAA' ? ipv6 : ipv4;
            console.log(`Attempt to update "${update.type}" record for ${zone.name} with ${updateIp}`);
            const updated = await updateCloudflare(client, zone, updateIp, update);
            console.log(`Domain ${zone.name} was ${updated ? '' : 'not '}updated`);
          }
        }
      }
    }
  }
}

module.exports = {
  updateCloudflare,
  updateAll,
};
