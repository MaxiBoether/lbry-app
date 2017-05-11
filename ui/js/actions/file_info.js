import * as types from 'constants/action_types'
import lbry from 'lbry'
import {
  selectCurrentUri,
} from 'selectors/app'
import {
  selectCurrentUriClaimOutpoint,
} from 'selectors/claims'
import {
  doCloseModal,
} from 'actions/app'

const {
  shell,
} = require('electron')

export function doFetchCurrentUriFileInfo() {
  return function(dispatch, getState) {
    const state = getState()
    const uri = selectCurrentUri(state)
    const outpoint = selectCurrentUriClaimOutpoint(state)

    dispatch({
      type: types.FETCH_FILE_INFO_STARTED,
      data: {
        uri,
        outpoint,
      }
    })

    lbry.file_list({ outpoint: outpoint, full_status: true }).then(([fileInfo]) => {
      dispatch({
        type: types.FETCH_FILE_INFO_COMPLETED,
        data: {
          uri,
          fileInfo,
        }
      })
    })
  }
}

export function doOpenFileInShell(fileInfo) {
  return function(dispatch, getState) {
    shell.openItem(fileInfo.download_path)
  }
}

export function doOpenFileInFolder(fileInfo) {
  return function(dispatch, getState) {
    shell.showItemInFolder(fileInfo.download_path)
  }
}

export function doDeleteFile(uri, fileInfo, deleteFromComputer) {
  return function(dispatch, getState) {
    dispatch({
      type: types.DELETE_FILE_STARTED,
      data: {
        uri,
        fileInfo,
        deleteFromComputer,
      }
    })

    const successCallback = () => {
      dispatch({
        type: types.DELETE_FILE_COMPLETED,
        data: {
          uri,
        }
      })
      dispatch(doCloseModal())
    }

    lbry.removeFile(fileInfo.outpoint, deleteFromComputer, successCallback)
  }
}

export function doFetchDownloadedContent() {
  return function(dispatch, getState) {
    const state = getState()

    dispatch({
      type: types.FETCH_DOWNLOADED_CONTENT_STARTED,
    })

    lbry.claim_list_mine().then((myClaimInfos) => {
      lbry.file_list().then((fileInfos) => {
        const myClaimOutpoints = myClaimInfos.map(({txid, nout}) => txid + ':' + nout);

        dispatch({
          type: types.FETCH_DOWNLOADED_CONTENT_COMPLETED,
          data: {
            fileInfos: fileInfos.filter(({outpoint}) => !myClaimOutpoints.includes(outpoint)),
          }
        })
      });
    });
  }
}
