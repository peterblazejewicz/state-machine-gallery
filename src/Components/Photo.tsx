import './Photo.css';

import React, { MouseEvent, SFC } from 'react';

import { GalleryState } from '../Model/state';

/**
 * Contract for Photo props
 * @export
 * @interface PhotoProps
 */
export interface PhotoProps {
  /**
   * @property
   * @type {GalleryState}
   * @memberof PhotoProps
   */
  state: GalleryState;
  /**
   * @property
   * @memberof PhotoProps
   */
  clickHandler: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * @property
   * @type {*}
   * @memberof PhotoProps
   */
  // tslint:disable-next-line:no-any
  item: any;
}
/**
 * Stateless Photo component
 * @param {PhotoProps} { state, clickHandler, item }
 * @returns
 */
export const Photo: SFC<PhotoProps> = ({ state, clickHandler, item }) => {
  if (state !== GalleryState.Photo) {
    return null;
  }
  return (
    <section className="ui-photo-detail" onClick={clickHandler}>
      <img src={item.media.m} className="ui-photo" />
    </section>
  );
};
