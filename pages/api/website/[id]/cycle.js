import { getPageviewCycle } from 'lib/queries';
import { ok, methodNotAllowed } from 'lib/response';

export default async (req, res) => {
  if (req.method === 'GET') {
    const { id, start_at, end_at, url, username, syscode } = req.query;

    console.log(id);

    console.log(username);

    const websiteId = +id;
    const startDate = new Date(+start_at);
    const endDate = new Date(+end_at);
    console.log(startDate);
    console.log(endDate);
    const data = await getPageviewCycle(websiteId, startDate, endDate, url, username, syscode);

    return ok(res, data);
  }

  return methodNotAllowed(res);
};
