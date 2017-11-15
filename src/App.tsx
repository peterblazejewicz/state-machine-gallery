import fetchJsonp from 'fetch-jsonp';
import React from 'react';
import { ApplicationState, GalleryState } from './Model/state';
import { GalleryAction, GalleryActionType } from './Model/action';
import { galleryMachine } from './Model/machine';
import './App.css';
import { SearchForm } from './Components/SearchForm';

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

  /**
   * Creates an instance of App.
   * @param {{}} props
   * @memberof App
   */
  constructor(props: {}) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  /**
   * Creates updated state (a command) for next state and action
   * @param {GalleryState} nextState
   * @param {GalleryAction} action
   * @returns {ApplicationState}
   * @memberof App
   */
  command(nextState: GalleryState, action: GalleryAction): ApplicationState {
    switch (nextState) {
      case GalleryState.Loading:
        // execute the search command
        this.search(action.query);
        break;
      case GalleryState.Gallery:
        if (action.items) {
          // update the state with the found items
          return { ...this.state, items: action.items };
        }
        break;
      case GalleryState.Photo:
        if (action.item) {
          // update the state with the selected photo item
          return { ...this.state, item: action.item };
        }
        break;
      default:
      /* break - through */
    }
    return { ...this.state };
  }

  /**
   * Switch (transition) to next state
   * @param {GalleryAction} action
   * @memberof App
   */
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

  /**
   * Handles controled form submission value
   * @private
   * @param {string} query term
   * @memberof App
   */
  handleSubmit(query: string) {
    this.transition({
      type: GalleryActionType.SEARCH,
      query,
    } as GalleryAction);
  }

  /**
   * @private performs a search on Flickr
   * @param {string} query
   * @memberof App
   */
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

  /**
   * Called from a form
   * @memberof App
   */
  handleCancel() {
    this.transition({
      type: GalleryActionType.CANCEL_SEARCH,
    } as GalleryAction);
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
        <SearchForm
          state={galleryState}
          handleCancel={this.handleCancel}
          handleFormSubmit={this.handleSubmit}
        />
        {this.renderGallery(galleryState)}
        {this.renderPhoto(galleryState)}
      </div>
    );
  }
}

export default App;
