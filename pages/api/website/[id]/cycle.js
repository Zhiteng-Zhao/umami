import { getPageviewCycle } from 'lib/queries';
import { ok, badRequest, methodNotAllowed, unauthorized } from 'lib/response';
import { DOMAIN_REGEX } from 'lib/constants';
import { allowQuery } from 'lib/auth';

export default async (req, res) => {
  if (req.method === 'GET') {
    if (!(await allowQuery(req))) {
      return unauthorized(res);
    }

    const { id, start_at, end_at, domain, url, username } = req.query;

    if (domain && !DOMAIN_REGEX.test(domain)) {
      return badRequest(res);
    }

    const websiteId = +id;
    const startDate = new Date(+start_at);
    const endDate = new Date(+end_at);

    const data = await getPageviewCycle(websiteId, startDate, endDate, url, username);

    return ok(res, data);
  }

  return methodNotAllowed(res);
};
