/**
 * Available actions
 * @enum {string}
 */
export enum GalleryActionType {
  CANCEL_SEARCH = 'cancel_search',
  EXIT_PHOTO = 'exit_photo',
  SEARCH = 'search',
  SEARCH_FAILURE = 'search_failure',
  SEARCH_SUCCESS = 'search_success',
  SELECT_PHOTO = 'select_photo',
}
/**
 * Gallery action contract
 * @export
 * @interface GalleryAction
 */
export interface GalleryAction {
  /**
   * @property
   * @type {GalleryActionType}
   * @memberof GalleryAction
   */
  type: GalleryActionType;
  /**
   * @property
   * @type {string}
   * @memberof GalleryAction
   */
  query: string;
  /**
   * @property
   * @type {Array<Object>}
   * @memberof GalleryAction
   */
  items: {}[];
  /**
   * @property
   * @type {Object}
   * @memberof GalleryAction
   */
  item?: {};
}
