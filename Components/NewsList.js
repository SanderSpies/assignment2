/**
 * @jsx React.DOM
 */
'use strict';

require('./default.css');

var throttle    = require('lodash-node/modern/functions/throttle')
var React       = require('react');
var ReactStyle  = require('react-style');

var NewsService = require('../Services/NewsService');

var Breadcrumb      = require('./Breadcrumb');
var NewsArticle     = require('./NewsArticle');
var NewsListItem    = require('./NewsListItem');


var NewsList = React.createClass({

  getInitialState() {
    return {
      home:             true,
      isLoading:        true,
      newsItems:        [],
      selectedItem:     -1,
      showBottomShadow: false,
      showTopShadow:    false,
      path: [
        'Latest news articles'
      ]
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
      transition:      'transform .3s ease-in',
      width:           '300px',
      zIndex:          2
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
      <Breadcrumb path={state.path} home={state.home} onBackButtonClick={this.onBackButtonClick} />

      <NewsArticle article={state.newsItems[state.selectedItem]} />

      <div styles={[styles.listContainerStyle,
                    !state.home && styles.listToTheLeftStyle,
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

    </div>;
  },

  onNewsItemClick(e) {
    var position = e.target.dataset.position;

    if (!position) {
      return;
    }

    var state = this.state;
    this.setState({
      home: false,
      path: [
        'Latest news articles',
        state.newsItems[position].title
      ],
      selectedItem: position
    });
  },

  onBackButtonClick() {
    this.setState({home: true});
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
