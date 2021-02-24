import { getWebsiteForStatistics } from 'lib/queries';
import { ok, methodNotAllowed } from 'lib/response';

export default async (req, res) => {
  if (req.method === 'GET') {
    const { id, start_at, end_at } = req.query;

    const websiteId = +id;
    const startDate = new Date(+start_at);
    const endDate = new Date(+end_at);

    const pageviews = getWebsiteForStatistics(websiteId, startDate, endDate);

    return ok(res, pageviews);
  }

  return methodNotAllowed(res);
};
