import './Gallery.css';

import React, { SFC } from 'react';

import { GalleryState } from '../Model/state';

/**
 * Contract for Gallery props
 * @export
 * @interface GalleryProps
 */
export interface GalleryProps {
  /**
   * @property
   * @type {GalleryState}
   * @memberof GalleryProps
   */
  state: GalleryState;
  /**
   * @property
   * @type {any[]}
   * @memberof GalleryProps
   */
  // tslint:disable-next-line:no-any
  items: any[];
  /**
   * @property
   * @memberof GalleryProps
   */
  // tslint:disable-next-line:no-any
  selectPhoto: (item: any) => void;
}
/**
 * Stateless Gallery component
 * @param {any} { state, items, selectPhoto }
 * @returns
 */
export const Gallery: SFC<GalleryProps> = ({ state, items, selectPhoto }) => {
  return (
    <section className="ui-items" data-state={state}>
      {state === 'error' ? (
        <span className="ui-error">Uh oh, search failed.</span>
      ) : (
        // tslint:disable-next-line:no-any
        items.map((item: any, index) => (
          <img
            src={item.media.m}
            className="ui-item"
            style={{ '--i': index }}
            key={item.link}
            onClick={() => selectPhoto(item)}
          />
        ))
      )}
    </section>
  );
};
