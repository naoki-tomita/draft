import fetch from "node-fetch";

export function execCreate(loginId: string) {
  return fetch("/api/users", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ loginId })
  });
}

export function execLogin(loginId: string) {
  return fetch("/api/users/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ loginId })
  });
}

export function execLogout() {
  return fetch("/api/users/logout");
}

export interface UserResponse {
  loginId: string;
}

export async function execIdentify(
  cookies: string
): Promise<UserResponse | null> {
  const result = await fetch(`${origin()}/api/users/identify`, {
    headers: { cookie: cookies }
  });
  if (result.ok) {
    return await result.json();
  }
  return null;
}

export interface CandidateResponse {
  id: number;
  recommends: Array<{
    loginId: string;
    recommend: string;
    good: boolean;
  }>;
}

export async function fetchCandidates(): Promise<CandidateResponse[] | null> {
  const result = await fetch(`${origin()}/api/candidates`);
  if (result.ok) {
    return await result.json();
  }
  return [];
}

export function postCandidates(
  candidateId: number,
  recommend: string,
  good: boolean
) {
  return fetch("/api/candidates", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ candidateId, recommend, good })
  });
}

export async function fetchCandidate(
  candidateId: number
): Promise<CandidateResponse | null> {
  const result = await fetch(`${origin()}/api/candidates/${candidateId}`);
  if (result.ok) {
    return await result.json();
  }
  return null;
}

export function origin() {
  return !process.browser
    ? `http://localhost:${process.env.PORT || 80}`
    : location.origin;
}
