import { NextApiRequest, NextApiResponse } from "next";
import { getUsecases } from "../../../api/usecase";
import { CandidateId } from "../../../api/domain";
import { CandidateResponse } from "../../../api/Client";

const { candidatesUsecase } = getUsecases();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch ((req.method || "GET").toUpperCase()) {
    case "GET":
      return get(req, res);
    default:
      res.writeHead(500, { "content-type": "application/json" }).end();
      return;
  }
};

async function get(
  req: NextApiRequest,
  res: NextApiResponse<CandidateResponse>
) {
  try {
    const candidate = await candidatesUsecase.findById(
      new CandidateId(parseInt(req.query.id as string, 10))
    );
    res.writeHead(200, { "content-type": "application/json" }).end(
      JSON.stringify({
        id: candidate.id.value,
        recommends: candidate.recommends.map(({ user, message, good }) => ({
          loginId: user.loginId.value,
          recommend: message.value,
          good: good.value
        }))
      })
    );
  } catch (e) {
    console.error(e);
    res
      .writeHead(500, { "content-type": "application/json" })
      .end((e as Error).stack);
  }
}
