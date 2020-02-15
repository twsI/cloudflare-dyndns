function helpInfo() {
  const info = {
    fritzbox: {
      UpdateURL: 'http://your-domain.tld/api/fritzbox?user=<username>&pass=<pass>&domain=<domain>&ip=<ipaddr>&ip6=<ip6addr>',
      Domainname: 'dyndns.your-domain.tld',
      Username: 'your-cloudflare-email-address',
      Password: 'your-cloudflare-api-key',
    },
    cloudflare: {
      token: {
        url: 'https://dash.cloudflare.com/profile/api-tokens',
        permissions: ['read zone', 'edit dns'],
      },
    },
  };
  return info;
}
module.exports = helpInfo;
