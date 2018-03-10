import fetchJsonp from 'fetch-jsonp';

// tslint:disable-next-line:no-any
export type executeSearchType = (query: string) => Promise<any>;

/**
 * Fetches photos from Flickr using query term
 * @async
 * @param {string} query
 * @returns {Promise<any>}
 */
// tslint:disable-next-line:no-any
export const executeSearch: executeSearchType = (query) => {
  const encodedQuery = encodeURIComponent(query);
  return new Promise((resolve, reject) => {
    fetchJsonp(
      `https://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&tags=${encodedQuery}`,
      { jsonpCallback: 'jsoncallback' },
    )
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
};
