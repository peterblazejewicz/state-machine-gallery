import { GalleryActionType } from './action';
import { GalleryState } from './state';

// shortcuts
const Action = GalleryActionType;
const State = GalleryState;
/**
 * @type {Object} state machine
 */
export const galleryMachine = {
  [State.Start]: {
    [Action.SEARCH]: State.Loading,
  },
  [State.Loading]: {
    [Action.CANCEL_SEARCH]: State.Gallery,
    [Action.SEARCH_FAILURE]: State.Error,
    [Action.SEARCH_SUCCESS]: State.Gallery,
  },
  [State.Error]: {
    [Action.SEARCH]: State.Loading,
  },
  [State.Gallery]: {
    [Action.SEARCH]: State.Loading,
    [Action.SELECT_PHOTO]: State.Photo,
  },
  [State.Photo]: {
    [Action.EXIT_PHOTO]: State.Gallery,
  },
};
