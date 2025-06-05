/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
async function fetchModel(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  }
  catch (error) {
    console.log("Error in fetchModel:", error);
    throw error;
  }
}

export default fetchModel;
