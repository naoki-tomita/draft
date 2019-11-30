import React, { FC } from "react";
import { Card, CardContent, Typography, CardActions, Button, List, ListItem, ListItemText } from "@material-ui/core";

export interface Candidate {
  id: string;
  recommends: Array<{
    loginId: string;
    recommend: string;
  }>;
}

interface Props {
  candidate: Candidate;
}

export const CandidateComponent: FC<Props> = ({ candidate }) => {
  return (
    <li style={{ listStyle: "none", margin: "5px", minWidth: "200px" }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            {candidate.id}
          </Typography>
          <List component="nav">
            {candidate.recommends.map((it, i) => (
              <ListItem key={i}>
                <ListItemText primary={it.loginId} />
              </ListItem>
            ))}
          </List>
        </CardContent>
        <CardActions>
          <Button href={`/candidates/${candidate.id}`} size="small">みる</Button>
        </CardActions>
      </Card>
    </li>
  );
};

// export const CandidateComponent: FC<Props> = ({ candidate }) => {
//   return (
//     <li style={{ listStyle: "none", margin: "5px", minWidth: "200px" }}>
//       {candidate.id}
//       {candidate.recommends.map(it => it.loginId).join(", ")}
//       {candidate.recommends.map(it => it.recommend).join(", ")}
//     </li>
//   );
// };
