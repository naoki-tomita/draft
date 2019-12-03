import React, { FC } from "react";
import { CandidateComponent, Candidate } from "./Candidate";

interface Props {
  candidates: Candidate[];
}
export const CandidatesComponents: FC<Props> = ({ candidates }) => {
  return (
    <ul
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        margin: "0",
        padding: "0"
      }}
    >
      {candidates.map(user => (
        <CandidateComponent key={user.id} candidate={user} />
      ))}
      <li style={{ listStyle: "none", margin: 5, minWidth: 230 }}></li>
      <li style={{ listStyle: "none", margin: 5, minWidth: 230 }}></li>
      <li style={{ listStyle: "none", margin: 5, minWidth: 230 }}></li>
      <li style={{ listStyle: "none", margin: 5, minWidth: 230 }}></li>
      <li style={{ listStyle: "none", margin: 5, minWidth: 230 }}></li>
      <li style={{ listStyle: "none", margin: 5, minWidth: 230 }}></li>
    </ul>
  );
};
