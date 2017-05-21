import React from 'react'
import {
  Modal
} from 'component/modal'
import {Line} from 'rc-progress';
import Link from 'component/link'
import { intlShape, injectIntl } from 'react-intl';

class DownloadingModal extends React.Component {
  render() {
    const {
      downloadProgress,
      downloadComplete,
      startUpgrade,
      cancelUpgrade,
      intl,
    } = this.props

    return (
      <Modal isOpen={true} contentLabel={intl.formatMessage({ id: 'app.downloadingModal.updateDownload' })} type="custom">
        {intl.formatMessage({ id: 'app.downloadingModal.updateDownload' })}{downloadProgress ? `: ${downloadProgress}%` : null}
        <Line percent={downloadProgress} strokeWidth="4"/>
        {downloadComplete ? (
           <div>
             <br />
             <p>{intl.formatMessage({ id: 'app.downloadingModal.explanation1' })}</p>
             <p>{intl.formatMessage({ id: 'app.downloadingModal.explanation2' })}</p>
             <p>{intl.formatMessage({ id: 'app.downloadingModal.explanation3' })}</p>
           </div>
         ) : null }
        <div className="modal__buttons">
          {downloadComplete
            ? <Link button="primary" label="Begin Upgrade" className="modal__button" onClick={startUpgrade} />
            : null}
          <Link button="alt" label="Cancel" className="modal__button" onClick={cancelUpgrade} />
        </div>
      </Modal>
    )
  }
}


DownloadingModal.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(DownloadingModal)
