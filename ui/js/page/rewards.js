import React from 'react';
import lbryio from 'lbryio';
import {CreditAmount, Icon} from 'component/common.js';
import SubHeader from 'component/subHeader'
import {RewardLink} from 'component/reward-link';

import { intlShape, injectIntl } from 'react-intl';

export class RewardTile extends React.Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    claimed: React.PropTypes.bool.isRequired,
    value: React.PropTypes.number.isRequired,
    onRewardClaim: React.PropTypes.func
  }

  render() {
    return (
      <section className="card">
        <div className="card__inner">
          <div className="card__title-primary">
            <CreditAmount amount={this.props.value} />
            <h3>{this.props.title}</h3>
          </div>
          <div className="card__actions">
            {this.props.claimed
              ? <span><Icon icon="icon-check" /> {intl.formatMessage({ id: 'app.page.rewards.claimed' })}</span>
              : <RewardLink {...this.props} />}
          </div>
          <div className="card__content">{this.props.description}</div>
        </div>
      </section>
    );
  }
}

export class RewardsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userRewards: null,
      failed: null,
    };
  }

  componentWillMount() {
    this.loadRewards()
  }

  loadRewards() {
    lbryio.call('reward', 'list', {}).then((userRewards) => {
      this.setState({
        userRewards: userRewards,
      });
    }, () => {
      this.setState({failed: true })
    });
  }

  render() {

    const {
      intl,
    } = this.props

    return (
      <main className="main--single-column">
        <SubHeader />
        <div>
          {!this.state.userRewards
            ? (this.state.failed ? <div className="empty">{intl.formatMessage({ id: 'app.page.rewards.failed' })}</div> : '')
            : this.state.userRewards.map(({RewardType, RewardTitle, RewardDescription, TransactionID, RewardAmount}) => {
              return <RewardTile key={RewardType} onRewardClaim={this.loadRewards} type={RewardType} title={RewardTitle} description={RewardDescription} claimed={!!TransactionID} value={RewardAmount} />;
            })}
        </div>
      </main>
    );
  }
}

RewardsPage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(RewardsPage);
