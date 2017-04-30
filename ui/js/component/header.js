import React from 'react';
import {Link} from './link.js';
import {Icon, CreditAmount} from './common.js';

var Header = React.createClass({
  _balanceSubscribeId: null,
  _isMounted: false,

  getInitialState: function() {
    return {
      balance: 0
    };
  },
  componentDidMount: function() {
    this._isMounted = true;
    this._balanceSubscribeId = lbry.balanceSubscribe((balance) => {
      if (this._isMounted) {
        this.setState({balance: balance});
      }
    });
  },
  componentWillUnmount: function() {
    this._isMounted = false;
    if (this._balanceSubscribeId) {
      lbry.balanceUnsubscribe(this._balanceSubscribeId)
    }
  },
  onBack: function() {

  },
  render: function() {
    return <header id="header">
        <div className="header__item">
          <Link onClick={() => { history.back() }} button="alt button--flat" icon="icon-arrow-left" />
        </div>
        <div className="header__item">
          <Link href="?discover" button="alt button--flat" icon="icon-home" />
        </div>
        <div className="header__item header__item--wunderbar">
          <WunderBar address={this.props.address} icon={this.props.wunderBarIcon} onSearch={this.props.onSearch} viewingPage={this.props.viewingPage} />
        </div>
        <div className="header__item">
          <Link href="?wallet" button="text" icon="icon-bank" label={lbry.formatCredits(this.state.balance, 1)} ></Link>
        </div>
        <div className="header__item">
          <Link button="primary button--flat" href="?publish" icon="icon-upload" label="Publish" />
        </div>
        <div className="header__item">
          <Link button="alt button--flat" href="?downloaded" icon="icon-folder" />
        </div>
        <div className="header__item">
          <Link button="alt button--flat" href="?settings" icon="icon-gear" />
        </div>
      </header>
  }
  /*
  render: function() {
    return (
      <header id="header" className={ (this.state.isScrolled ? 'header-scrolled' : 'header-unscrolled') + ' ' + (this.props.links ? 'header-with-subnav' : 'header-no-subnav') }>
        <div className="header-top-bar">
          <Link onClick={this.props.onOpenDrawer} icon="icon-bars" className="open-drawer-link" />
          <input className="wunderbar__input" type="search" onChange={this.onQueryChange} value={ this.state.title }
               placeholder="Find movies, music, games, and more"/>
        </div>

      </header>
    );
  }*/
});

let WunderBar = React.createClass({
  _userTypingTimer: null,
  _input: null,
  _stateBeforeSearch: null,

  getInitialState: function() {
    return {
      address: this.props.address,
      icon: this.props.icon
    };
  },
  componentWillMount: function() {
    //observe document.title sets (this is dumb, but the way it works currently)
    // new MutationObserver(function(mutations) {
    //   this.setState({ address: mutations[0].target.textContent });
    // }.bind(this)).observe(
    //   document.querySelector('title'),
    //   { subtree: true, characterData: true, childList: true }
    // );
  },
  componentWillUnmount: function() {
    if (this.userTypingTimer) {
      clearTimeout(this._userTypingTimer);
    }
  },
  onChange: function(event) {

    if (this._userTypingTimer)
    {
      clearTimeout(this._userTypingTimer);
    }

    this.setState({ address: event.target.value })

    //@TODO: Switch to React.js timing
    var searchTerm = event.target.value;

    this._userTypingTimer = setTimeout(() => {
      this.props.onSearch(searchTerm);
    }, 800); // 800ms delay, tweak for faster/slower

  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.viewingPage !== this.props.viewingPage) {
      this.setState({ address: nextProps.address, icon: nextProps.icon });
    }
  },
  onFocus: function() {
    this._stateBeforeSearch = this.state;
    let newState = {
      icon: "icon-search",
      isActive: true
    }
    // this._input.value = ""; //trigger placeholder
    this._focusPending = true;
    if (!this.state.address.startsWith('lbry://')) //onFocus, if they are not on an exact URL, clear the bar
    {
      newState.address = '';
    }
    this.setState(newState);
  },
  onBlur: function() {
    this.setState(Object.assign({}, this._stateBeforeSearch, { isActive: false }));
    this._input.value = this.state.address;
  },
  componentDidUpdate: function() {
    this._input.value = this.state.address;
    if (this._input && this._focusPending) {
      this._input.select();
      this._focusPending = false;
    }
  },
  onReceiveRef: function(ref) {
    this._input = ref;
  },
  render: function() {
    return (
      <div className={'wunderbar' + (this.state.isActive ? ' wunderbar--active' : '')}>
        {this.state.icon ? <Icon fixed icon={this.state.icon} /> : '' }
        <input className="wunderbar__input" type="search" placeholder="Type a LBRY address or search term"
               ref={this.onReceiveRef}
               onFocus={this.onFocus}
               onBlur={this.onBlur}
               onChange={this.onChange}
               value={this.state.address}
               placeholder="Find movies, music, games, and more" />
      </div>
    );
  }
})

export let SubHeader =  React.createClass({
  render: function() {
    let links = [],
        viewingUrl = '?' + this.props.viewingPage;

    for (let link of Object.keys(this.props.links)) {
      links.push(
        <a href={link} key={link} className={ viewingUrl == link ? 'sub-header-selected' : 'sub-header-unselected' }>
          {this.props.links[link]}
        </a>
      );
    }
    return (
      <nav className={'sub-header' + (this.props.modifier ? ' sub-header--' + this.props.modifier : '')}>
        {links}
      </nav>
    );
  }
});

export default Header;
