/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react');
var ReactStyle  = require('react-style');

var NewsArticle = React.createClass({

  styles: {

    articleStyle: ReactStyle({
      padding:   '10px',
      position:  'absolute',
      width:     '280px'
    }),

    descriptionStyle: ReactStyle({
      height:    '190px',
      overflowX: 'hidden',
      overflowY: 'scroll'
    })

  },

  propTypes: {
    article: React.PropTypes.object,
    visible: React.PropTypes.bool
  },

  render() {
    var props   = this.props;
    var styles  = this.styles;
    var article = props.article || {};
    return <div ref="article" styles={styles.articleStyle}>
        <div styles={styles.descriptionStyle}
             dangerouslySetInnerHTML={{__html:article.description +
                    '<div><a href="' + article.link + '">' + article.link + '</a></div>'}} />
    </div>;
  }

});

module.exports = NewsArticle;
