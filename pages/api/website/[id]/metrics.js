import { getPageviewMetrics, getSessionMetrics, getWebsiteById } from 'lib/queries';
import { ok, methodNotAllowed, unauthorized, badRequest } from 'lib/response';
import { allowQuery } from 'lib/auth';

const sessionColumns = ['browser', 'os', 'device', 'country'];
const pageviewColumns = ['url', 'referrer'];

function getTable(type) {
  if (type === 'event') {
    return 'event';
  }

  if (sessionColumns.includes(type)) {
    return 'session';
  }

  return 'pageview';
}

function getColumn(type) {
  if (type === 'event') {
    return `concat(event_type, '\t', event_value)`;
  }
  return type;
}

export default async (req, res) => {
  if (req.method === 'GET') {
    if (!(await allowQuery(req))) {
      return unauthorized(res);
    }
    const { id, type, start_at, end_at, domain, url, username } = req.query;

    if (domain && !DOMAIN_REGEX.test(domain)) {
      return badRequest(res);
    }

    const websiteId = +id;
    const startDate = new Date(+start_at);
    const endDate = new Date(+end_at);

    if (sessionColumns.includes(type)) {
      const data = await getSessionMetrics(websiteId, startDate, endDate, type, { url });

      return ok(res, data);
    }

    if (pageviewColumns.includes(type) || type === 'event') {
      let domain;
      if (type === 'referrer') {
        const website = getWebsiteById(websiteId);

        if (!website) {
          return badRequest(res);
        }

        domain = website.domain;
      }

      const data = await getPageviewMetrics(
        websiteId,
        startDate,
        endDate,
        getColumn(type),
        getTable(type),
        {
          domain,
          url: type !== 'url' && url,
          username: username !== undefined && username,
        },
      );

      return ok(res, data);
    }
  }

  return methodNotAllowed(res);
};
