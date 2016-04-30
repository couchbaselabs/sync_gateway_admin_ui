import keymirror from 'keymirror'
import { serverApi } from '../../app';
import { makePath } from '../../utils';

const Keys = keymirror({
  'SET_APP_CONTENT_HEADER': null,
});
export { Keys }

export function setAppSidebarEnabled(enabled) {
  return { 
    type: Keys.SET_APP_SIDEBAR_ENABLED, 
    sidebarEnabled: enabled 
  };
}

export function setAppContentHeader(primary, secondary) {
  return { 
    type: Keys.SET_APP_CONTENT_HEADER, 
    primaryHeader: primary,
    secondaryHeader: secondary
  }
}
