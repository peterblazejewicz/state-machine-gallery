import React, { ChangeEvent, FormEvent } from 'react';
import './App.css';
import { ApplicationState, GalleryState } from './Model/state';
import { GalleryAction, GalleryActionType } from './Model/action';
import { galleryMachine } from './Model/machine';
import fetchJsonp from 'fetch-jsonp';

class App extends React.Component {
  /**
   * Default state
   * @type {ApplicationState}
   * @memberof App
   */
  state: ApplicationState = {
    gallery: GalleryState.Start,
    items: [],
    query: '',
  };

  constructor(props: {}) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeQuery = this.handleChangeQuery.bind(this);
  }

  command(nextState: GalleryState, action: GalleryAction): ApplicationState {
    switch (nextState) {
      case GalleryState.Loading:
        // execute the search command
        this.search(action.query);
        break;
      case GalleryState.Gallery:
        if (action.items) {
          // update the state with the found items
          return { items: action.items, ...this.state };
        }
        break;
      case GalleryState.Photo:
        if (action.item) {
          // update the state with the selected photo item
          return { item: action.item, ...this.state };
        }
        break;
      default:
      /* break - through */
    }
    return { ...this.state };
  }

  transition(action: GalleryAction) {
    const currentGalleryState = this.state.gallery;
    const nextGalleryState = galleryMachine[currentGalleryState][action.type];

    if (nextGalleryState) {
      const nextState = this.command(nextGalleryState, action);

      this.setState({
        ...nextState,
        gallery: nextGalleryState,
      });
    }
  }

  handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.persist();
    event.preventDefault();
    this.transition({
      type: GalleryActionType.SEARCH,
      query: this.state.query,
    } as GalleryAction);
  }

  search(query: string) {
    const encodedQuery = encodeURIComponent(query);

    setTimeout(() => {
      fetchJsonp(
        `https://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&tags=${encodedQuery}`,
        { jsonpCallback: 'jsoncallback' },
      )
        .then(res => res.json())
        .then(data => {
          this.transition({
            type: GalleryActionType.SEARCH_SUCCESS,
            items: data.items,
          } as GalleryAction);
        })
        .catch(error => {
          this.transition({
            type: GalleryActionType.SEARCH_FAILURE,
          } as GalleryAction);
        });
      // tslint:disable-next-line:align
    }, 1000);
  }
  handleChangeQuery(event: ChangeEvent<HTMLInputElement>) {
    const { target: { value } } = event;
    this.setState({ query: value });
  }
  renderForm(state: GalleryState) {
    const searchText =
      {
        loading: 'Searching...',
        error: 'Try search again',
        start: 'Search',
      }[state] || 'Search';

    return (
      <form className="ui-form" onSubmit={this.handleSubmit}>
        <input
          type="search"
          className="ui-input"
          value={this.state.query}
          onChange={this.handleChangeQuery}
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
          {state === 'loading' && (
            <button
              className="ui-button"
              type="button"
              onClick={() =>
                this.transition({
                  type: GalleryActionType.CANCEL_SEARCH,
                } as GalleryAction)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  }
  renderGallery(state: GalleryState) {
    return (
      <section className="ui-items" data-state={state}>
        {state === 'error' ? (
          <span className="ui-error">Uh oh, search failed.</span>
        ) : (
          // tslint:disable-next-line:no-any
          this.state.items.map((item: any, index) => (
            <img
              src={item.media.m}
              className="ui-item"
              style={{ '--i': index }}
              key={item.link}
              onClick={() =>
                this.transition({
                  type: GalleryActionType.SELECT_PHOTO,
                  item,
                } as GalleryAction)}
            />
          ))
        )}
      </section>
    );
  }
  renderPhoto(state: GalleryState) {
    if (state !== GalleryState.Photo) {
      return null;
    }
    return (
      <section
        className="ui-photo-detail"
        onClick={() =>
          this.transition({
            type: GalleryActionType.EXIT_PHOTO,
          } as GalleryAction)}
      >
        <img src={this.state.item.media.m} className="ui-photo" />
      </section>
    );
  }

  render() {
    const galleryState = this.state.gallery;
    return (
      <div className="ui-app" data-state={galleryState}>
        {this.renderForm(galleryState)}
        {this.renderGallery(galleryState)}
        {this.renderPhoto(galleryState)}
      </div>
    );
  }
}

export default App;
