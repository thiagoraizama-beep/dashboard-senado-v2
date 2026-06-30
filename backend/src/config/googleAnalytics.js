import { google } from "googleapis";
import { getGoogleAuth } from "./googleAuth.js";

let analyticsDataClient = null;

export function getAnalyticsDataClient() {
  if (!analyticsDataClient) {
    analyticsDataClient = google.analyticsdata({ version: "v1beta", auth: getGoogleAuth() });
  }
  return analyticsDataClient;
}
