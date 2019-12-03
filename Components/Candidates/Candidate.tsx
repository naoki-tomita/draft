import React, { FC } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Badge
} from "@material-ui/core";

export interface Candidate {
  id: number;
  recommends: Array<{
    loginId: string;
    recommend: string;
    good: boolean;
  }>;
  done: boolean;
}

interface Props {
  candidate: Candidate;
}

export const CandidateComponent: FC<Props> = ({ candidate }) => {
  return (
    <li style={{ listStyle: "none", margin: "5px", minWidth: "230px" }}>
      <Badge
        style={{ width: "100%" }}
        component="div"
        badgeContent="DONE"
        color="secondary"
        invisible={!candidate.done}
        overlap="circle"
      >
        <Card style={{ width: "100%" }}>
          <CardContent>
            <Typography component="span" variant="h4">
              {candidate.id}
            </Typography>
            <Typography component="span" variant="h6">
              さん
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              href={`https://job-draft.jp/manage/users/${candidate.id}`}
              size="small"
            >
              ドラフトページへ
            </Button>
            {candidate.done ? (
              <Button href={`/candidates/${candidate.id}`} size="small">
                コメント一覧
              </Button>
            ) : (
              <Button href={`/candidates/${candidate.id}`} size="small">
                👍👎する
              </Button>
            )}
          </CardActions>
        </Card>
      </Badge>
    </li>
  );
};
