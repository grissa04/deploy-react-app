const API_URL = process.env.REACT_APP_API_URL;

export function getApiUrl(path = "") {
  if (!API_URL) {
    throw new Error("REACT_APP_API_URL is not set");
  }
  return `${API_URL}${path}`;
}
