import React, { FormEvent, SFC } from 'react';
import { GalleryState } from '../Model/state';
import './Form.css';

/**
 * Contract for Form Stateless component
 * @export
 * @interface FormProps
 */
export interface FormProps {
  /**
   * @property
   * @memberof FormProps
   */
  handleFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  /**
   * @property
   * @memberof FormProps
   */
  handleQueryChanged: (event: FormEvent<HTMLInputElement>) => void;
  /**
   * @property
   * @memberof FormProps
   */
  handleCancel: (event: FormEvent<HTMLButtonElement>) => void;
  /**
   * @property
   * @type {string}
   * @memberof FormProps
   */
  query: string;
  /**
   * @property
   * @type {GalleryState}
   * @memberof FormProps
   */
  state: GalleryState;
  /**
   * @property
   * @type {string}
   * @memberof FormProps
   */
  searchText: string;
}

/**
 *
 *
 * @param {FormProps} {
 *   handleFormSubmit,
 *   handleCancel,
 *   handleQueryChanged,
 *   query,
 *   state,
 *   searchText,
 * }
 * @returns {Component}
 */
export const Form: SFC<FormProps> = ({
  handleFormSubmit,
  handleCancel,
  handleQueryChanged,
  query,
  state,
  searchText,
}) => {
  return (
    <form className="ui-form" onSubmit={handleFormSubmit}>
      <input
        type="search"
        className="ui-input"
        value={query}
        onChange={handleQueryChanged}
        placeholder="Search Flickr for photos..."
        disabled={state === GalleryState.Loading}
      />
      <div className="ui-buttons">
        <button
          type="submit"
          className="ui-button"
          disabled={state === GalleryState.Loading}
        >
          {searchText}
        </button>
        {state === GalleryState.Loading && (
          <button className="ui-button" type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
