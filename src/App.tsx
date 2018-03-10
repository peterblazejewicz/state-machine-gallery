import './App.css';

import autobind from 'autobind-decorator';
import React, { Component } from 'react';

import { Gallery, Photo, SearchForm } from './Components';
import { GalleryAction, GalleryActionType } from './Model/action';
import { galleryMachine } from './Model/machine';
import { ApplicationState, GalleryState } from './Model/state';
import { executeSearch } from './Utils/fetch';

class App extends Component {
  /**
   * @property
   * @type {ApplicationState}
   * @memberof App
   */
  state: ApplicationState = {
    gallery: GalleryState.Start,
    items: [],
    query: '',
  };

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
  @autobind
  startSearch(query: string) {
    this.transition({
      type: GalleryActionType.SEARCH,
      query,
    } as GalleryAction);
  }

  /**
   * @private performs a search on Flickr
   * @async
   * @param {string} query
   * @memberof App
   */
  @autobind
  async search(query: string) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = await executeSearch(query);
      this.transition({
        type: GalleryActionType.SEARCH_SUCCESS,
        items: data.items,
      } as GalleryAction);
    } catch (error) {
      this.transition({
        type: GalleryActionType.SEARCH_FAILURE,
      } as GalleryAction);
    }
  }

  /**
   * Called from a form
   * @memberof App
   */
  @autobind
  cancelSearch() {
    this.transition({
      type: GalleryActionType.CANCEL_SEARCH,
    } as GalleryAction);
  }

  /**
   * Called from photo to close a large version
   * @memberof App
   */
  @autobind
  exitPhotoHandler() {
    this.transition({
      type: GalleryActionType.EXIT_PHOTO,
    } as GalleryAction);
  }

  @autobind
  // tslint:disable-next-line:no-any
  selectPhoto(item: any) {
    this.transition({
      type: GalleryActionType.SELECT_PHOTO,
      item,
    } as GalleryAction);
  }

  render() {
    const galleryState = this.state.gallery;
    return (
      <div className="ui-app" data-state={galleryState}>
        <SearchForm
          state={galleryState}
          handleCancel={this.cancelSearch}
          handleFormSubmit={this.startSearch}
        />
        <Gallery
          state={galleryState}
          items={this.state.items}
          selectPhoto={this.selectPhoto}
        />
        <Photo
          clickHandler={this.exitPhotoHandler}
          state={galleryState}
          item={this.state.item}
        />
      </div>
    );
  }
}

export default App;
