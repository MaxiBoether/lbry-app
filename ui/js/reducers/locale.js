import { ENGLISH_TRANSLATION } from '../messages/en';
import { GERMAN_TRANSLATION } from '../messages/de';

const initialState = {
  lang: ENGLISH_TRANSLATION.lang,
  messages: ENGLISH_TRANSLATION.messages
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOCALE_SELECTED':
    switch (action.locale) {
      case 'de':
        return { ...initialState, lang: GERMAN_TRANSLATION.lang, messages: GERMAN_TRANSLATION.messages };
      default:
        return { ...initialState, lang: ENGLISH_TRANSLATION.lang, messages: ENGLISH_TRANSLATION.messages };
    }
    default:
      return state;
  }
};