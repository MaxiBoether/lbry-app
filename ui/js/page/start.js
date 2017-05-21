import React from 'react';
import lbry from '../lbry.js';

import { intlShape, injectIntl } from 'react-intl';

class StartPage extends React.Component {
  componentWillMount() {
    lbry.stop();
  }

  render() {

    const {
      intl,
    } = this.props


    return (
      <main className="main--single-column">
        <h3>{intl.formatMessage({ id: 'app.page.start.closed' })}</h3>
        <Link href="lbry://lbry" label='app.page.start.start' />
      </main>
    );
  }
}

StartPage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(StartPage);
