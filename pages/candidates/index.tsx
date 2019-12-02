import { NextPage } from "next";
import { CandidatesComponents } from "../../Components/Candidates";
import { Candidate } from "../../Components/Candidates/Candidate";
import { origin, fetchCandidates } from "../../api/Client";

interface Props {
  candidates: Candidate[];
}

const CandidatesPage: NextPage<Props> = ({ candidates }) => {
  return <CandidatesComponents candidates={candidates} />;
};

CandidatesPage.getInitialProps = async ({ req }) => {
  const result = await fetchCandidates(origin(req));
  if (result.ok) {
    const candidates = await result.json();
    return { candidates };
  }
  return { candidates: [] };
};

export default CandidatesPage;
