import { NextApiRequest, NextApiResponse } from "next";
import { getUsecases } from "../../../api/usecase";
import { LoginId, CandidateId, RecommendMessage } from "../../../api/domain";

const { candidatesUsecase } = getUsecases();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch ((req.method || "GET").toUpperCase()) {
    case "GET":
      return get(req, res);
    case "POST":
      return post(req, res);
    default:
      res.writeHead(500, { "content-type": "application/json" }).end();
      return;
  }
};

async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const candidates = await candidatesUsecase.list();
    res
      .writeHead(200, { "content-type": "application/json" })
      .end(
        JSON.stringify(
          candidates.map(({ id, recommends }) => ({
            id: id.value,
            recommends: recommends.map(({ user, message }) => ({
              loginId: user.loginId.value,
              recommend: message.value
            }))
          }))
        )
      );
  } catch (e) {
    console.error(e);
    res
      .writeHead(500, { "content-type": "application/json" })
      .end((e as Error).stack);
  }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      body: { candidateId, recommend },
      cookies: { loginId }
    } = req;
    await candidatesUsecase.create(
      new CandidateId(candidateId),
      new LoginId(loginId),
      new RecommendMessage(recommend)
    );
    res.writeHead(201, { "content-type": "application/json" }).end();
  } catch (e) {
    console.error(e);
    res
      .writeHead(500, { "content-type": "application/json" })
      .end((e as Error).stack);
  }
}
