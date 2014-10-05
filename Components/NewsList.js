/**
 * @jsx React.DOM
 */
'use strict';

require('./default.css');

var throttle    = require('lodash-node/modern/functions/throttle')
var React       = require('react');
var ReactStyle  = require('react-style');

var NewsService = require('../Services/NewsService');

var NewsArticle     = require('./NewsArticle');
var NewsListItem    = require('./NewsListItem');

var Views = {
  HOME:    0,
  CONTENT: 1
}

var NewsList = React.createClass({

  getInitialState() {
    return {
      view:             Views.HOME,
      selectedIndex:    -1,
      isLoading:        true,
      newsItems:        [],
      showBottomShadow: false,
      showTopShadow:    false
    };
  },

  styles: {

    containerStyle: ReactStyle({
      backgroundColor:  'white',
      display:          'inline-block',
      height:           '300px',
      margin:           '10px',
      overflow:         'hidden',
      position:         'relative',
      width:            '300px'
    }),

    listStyle: ReactStyle({
      height:     '260px',
      listStyle:  'none',
      margin:     0,
      overflowX:  'hidden',
      overflowY:  'auto',
      padding:    0
    }),

    listContainerStyle: ReactStyle({
      backgroundColor: 'white',
      position:        'absolute',
      top:             '40px',
      width:           '300px',
      zIndex:          2
    }),

    transitionPanelStyle: ReactStyle({
      position:        'relative',
      transition:      'transform .3s ease-in',
      width:           '600px'
    }),

    listToTheLeftStyle: ReactStyle({
      transform:  'translateX(-300px)'
    }),

    listBottomShadowStyle: ReactStyle({
      boxShadow: 'inset 0 -3px 3px -2px #A3A3A3'
    }),


    listTopShadowStyle: ReactStyle({
      boxShadow:  'inset 0 3px 3px -2px #A3A3A3',
    }),

    loadingIndicatorStyle: ReactStyle({
      marginTop:  '-6px',
      position:   'absolute',
      textAlign:  'center',
      top:        '50%',
      width:      '100%'
    }),

    titleStyle: ReactStyle({
      display:    'inline-block',
      fontSize:   '20px',
      margin:     0,
      padding:    '10px',
      width:      '280px'
    })

  },

  componentDidMount() {
    var self = this;
    NewsService
      .getLatestNewsItems()
      .then((data) => {
        self.setState({
          isLoading: false,
          newsItems: data.value.items.slice(0, 10)
        });
        self.onScroll();
      }, (error) => {
        self.setState({
          error:     error,
          isLoading: false
        });
    });
  },

  render() {
    var state         = this.state;
    var styles        = this.styles;
    var newsListData  = state.newsItems;
    var newsItems     = [];

    for (var i = 0, l = newsListData.length; i < l; i++) {
      newsItems[i] = <NewsListItem position={i} data={newsListData[i]} />;
    }

    return <div styles={styles.containerStyle}>
      <div styles={[styles.transitionPanelStyle, !!state.view && styles.listToTheLeftStyle]}>
        <h2 styles={styles.titleStyle}>Latest news articles</h2>
        <div styles={[styles.listContainerStyle,
                      state.showTopShadow && styles.listTopShadowStyle]}>
          <div styles={[state.showBottomShadow && styles.listBottomShadowStyle]}>
            <ul ref="newsList"
                styles={styles.listStyle}
                onClick={this.onNewsItemClick}
                onScroll={throttle(this.onScroll, 200)}>
              {state.isLoading ?
                <div styles={styles.loadingIndicatorStyle}>
                  Loading...
                </div>
                :
                state.error ?
                  <div styles={styles.loadingIndicatorStyle}>
                    Something went wrong: {state.error}
                  </div>
                  :
                  newsItems
                }

            </ul>
          </div>
        </div>
        <NewsArticle onBackButtonClick={this.onBackButtonClick} article={state.newsItems[state.selectedIndex]} />
      </div>
    </div>;
  },

  onNewsItemClick(e) {
    var position = e.target.dataset.position;

    if (!position) {
      return;
    }

    this.setState({selectedIndex:position, view: Views.CONTENT});
  },

  onBackButtonClick() {
    this.setState({view: Views.HOME});
  },

  onScroll() {
    var state        = this.state;
    var domNode      = this.refs.newsList.getDOMNode();
    var height       = domNode.offsetHeight;
    var scrollTop    = domNode.scrollTop;
    var scrollHeight = domNode.scrollHeight;
    var newState     = {};

    if (scrollTop > 0 && !state.showTopShadow) {
      newState.showTopShadow = true;
    }
    else if (scrollTop < 1 && state.showTopShadow) {
      newState.showTopShadow = false;
    }

    if (scrollTop + height < scrollHeight && !state.showBottomShadow) {
      newState.showBottomShadow = true;
    }
    else if (scrollTop + height >= scrollHeight && state.showBottomShadow) {
      newState.showBottomShadow = false;
    }

    // simple check to see if the state has really changed
    if (Object.keys(newState).length) {
      this.setState(newState);
    }
  }

});

// this check is needed for react-style-webpack-plugin, which executes the code
// inside node.js
if (typeof window !== 'undefined') {
  React.renderComponent(<NewsList />, document.getElementById('container'));
}
