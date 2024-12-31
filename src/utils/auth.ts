import * as crypto from "crypto";
import { Account } from "../types";

export function getAuthHeaders(path: string,  { API_KEY, API_SECRET } : Account): Record<string, string> {
  const timestamp = Date.now();
  const signature = crypto
    .createHmac("sha512", API_SECRET)
    .update(timestamp.toString())
    .update("GET")
    .update(path)
    .update("")
    .digest("hex");

  return {
    "X-VALR-API-KEY": API_KEY,
    "X-VALR-SIGNATURE": signature,
    "X-VALR-TIMESTAMP": timestamp.toString(),
  };
}
