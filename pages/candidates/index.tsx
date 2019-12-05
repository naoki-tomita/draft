import { NextPage } from "next";
import Link from "next/link";
import { CandidatesComponents } from "../../Components/Candidates";
import { Candidate } from "../../Components/Candidates/Candidate";
import { fetchCandidates, execIdentify } from "../../api/Client";
import {
  Breadcrumbs,
  Typography,
  Link as LinkComponent
} from "@material-ui/core";

interface Props {
  candidates: Candidate[];
}

const CandidatesPage: NextPage<Props> = ({ candidates }) => {
  return (
    <>
      <div style={{ marginTop: 16 }}>
        <Breadcrumbs>
          <Link href="/">
            <LinkComponent
              component="a"
              color="inherit"
              style={{ cursor: "pointer" }}
            >
              お薦めする
            </LinkComponent>
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
    execIdentify(req?.headers?.cookie || ""),
    fetchCandidates()
  ]);
  return {
    candidates: candidates.map(it => ({
      ...it,
      done: it.recommends.some(r => r.loginId === user.loginId)
    }))
  };
};

export default CandidatesPage;
