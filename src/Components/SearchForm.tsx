import React, { ChangeEvent, Component, FormEvent, MouseEvent } from 'react';
import { GalleryState } from '../Model/state';
import { Form } from './Form';

/**
 * State of the form container
 * @export
 * @interface SearchFormState
 */
export interface SearchFormState {
  query: string;
}

/**
 * Contract for container props
 * @export
 * @interface SearchFormProps
 */
export interface SearchFormProps {
  handleFormSubmit: (query: string) => void;
  handleCancel: (event: MouseEvent<HTMLButtonElement>) => void;
  state: GalleryState;
}
/**
 * Statefull component (container) for the search form
 * @export
 * @class SearchForm
 * @extends {Component<SearchFormProps, SearchFormState>}
 */
export class SearchForm extends Component<SearchFormProps, SearchFormState> {
  state: SearchFormState = {
    query: '',
  };
  constructor(props: SearchFormProps) {
    super(props);
    this.handleQueryChanged = this.handleQueryChanged.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  /**
   * @private handles search input change
   * @param {ChangeEvent<HTMLInputElement>} event
   * @memberof SeachForm
   */
  handleQueryChanged(event: ChangeEvent<HTMLInputElement>) {
    const { target: { value } } = event;
    this.setState({ query: value });
  }

  /**
   * Handles controled form submission
   * @private
   * @param {FormEvent<HTMLFormElement>} event
   * @memberof SeachForm
   */
  handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.persist();
    event.preventDefault();
    this.props.handleFormSubmit(this.state.query);
  }

  handleCancel(event: MouseEvent<HTMLButtonElement>) {
    this.props.handleCancel(event);
  }

  render() {
    const { state } = this.props;
    const searchText =
      {
        loading: 'Searching...',
        error: 'Try search again',
        start: 'Search',
      }[state] || 'Search';

    return (
      <Form
        handleCancel={this.handleCancel}
        handleFormSubmit={this.handleFormSubmit}
        handleQueryChanged={this.handleQueryChanged}
        query={this.state.query}
        searchText={searchText}
        state={state}
      />
    );
  }
}
