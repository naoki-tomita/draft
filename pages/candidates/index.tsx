import { NextPage } from "next";
import { CandidatesComponents } from "../../Components/Candidates";
import { Candidate } from "../../Components/Candidates/Candidate";
import { origin, fetchCandidates, execIdentify } from "../../api/Client";
import { Breadcrumbs, Link, Typography } from "@material-ui/core";

interface Props {
  candidates: Candidate[];
}

const CandidatesPage: NextPage<Props> = ({ candidates }) => {
  return (
    <>
      <div style={{ marginTop: 16 }}>
        <Breadcrumbs>
          <Link color="inherit" href="/">
            お薦めする
          </Link>
          <Typography color="textPrimary">一覧をみる</Typography>
        </Breadcrumbs>
      </div>
      <CandidatesComponents candidates={candidates} />
    </>
  );
};

CandidatesPage.getInitialProps = async ({ req }) => {
  const [user, candidates] = await Promise.all([
    execIdentify(origin(), req.headers.cookie),
    fetchCandidates(origin())
  ]);
  return {
    candidates: candidates.map(it => ({
      ...it,
      done: it.recommends.some(r => r.loginId === user.loginId)
    }))
  };
};

export default CandidatesPage;
