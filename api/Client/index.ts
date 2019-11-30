import fetch from "node-fetch";
import { IncomingMessage } from "http";

export function execCreate(loginId: string) {
  return fetch(
    "/api/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ loginId })
    }
  )
}

export function execLogin(loginId: string) {
  return fetch(
    "/api/users/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ loginId })
    }
  );
}

export function execLogout() {
  return fetch("/api/users/logout");
}

export function execIdentify(origin: string, cookies: string) {
  return fetch(`${origin}/api/users/identify`, {
    headers: { cookie: cookies }
  });
}

export function fetchCandidates(origin: string) {
  return fetch(`${origin}/api/candidates`);
}

export function postCandidates(candidateId: number, recommend: string) {
  return fetch("/api/candidates", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ candidateId, recommend })
  });
}

export function origin(context?: IncomingMessage) {
  return context ?
    `http://localhost:${process.env.PORT || 80}` : location.origin;
}
