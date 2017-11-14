/**
 * Appliaction properties
 * @export
 * @interface ApplicationState
 */
export interface ApplicationState {
  /**
   * @property
   * @type {GalleryState}
   * @memberof ApplicationState
   */
  gallery: GalleryState;
  /**
   * @property
   * @type {string}
   * @memberof ApplicationState
   */
  query: string;
  /**
   * @property
   * @type {{}[]}
   * @memberof ApplicationState
   */
  items: {}[];
  /**
   * @property
   * @type {{}}
   * @memberof ApplicationState
   */
  // tslint:disable-next-line:no-any
  item?: any;
}
/**
 * Available states
 *
 * @enum {string}
 */
export enum GalleryState {
  Error = 'error',
  Gallery = 'gallery',
  Loading = 'loading',
  Photo = 'photo',
  Start = 'start',
}
