/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react');
var ReactStyle  = require('react-style');

var helperDiv;
if (typeof window !== 'undefined'){
  helperDiv = document.createElement('div');
}

var NewsArticle = React.createClass({

  styles: {

    articleStyle: ReactStyle({
      top: 0,
      left: '300px',
      padding:   '10px',
      position:  'absolute',
      width:     '280px'
    }),

    descriptionStyle: ReactStyle({
      overflowX: 'hidden',
      overflowY: 'scroll',
      marginTop: '10px'
    }),

    imageStyle: ReactStyle({
      float:    'left',
      margin:   '0 10px 10px 0',
      maxWidth: '100px'
    }),

    titleStyle: ReactStyle({
      margin: '0 0 10px 0'
    }),

    fullArticleButtonStyle: ReactStyle({
      float: 'right'
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
    var image;
    var mediaContent = article['media:content'];
    if (mediaContent) {
      image = <img src={mediaContent.url} styles={styles.imageStyle} />;
    }
    helperDiv.innerHTML = article.description;
    return <div ref="article" styles={styles.articleStyle}>
        <h3 styles={styles.titleStyle}>
          {article.title}
        </h3>
        <a href="#" styles={styles.backButtonStyle}
        onClick={this.props.onBackButtonClick}>
          Go back
        </a>
        <a styles={styles.fullArticleButtonStyle} href={article.link}>Full article</a>
        <div ref="description" styles={styles.descriptionStyle}>
                    {image}
                    {helperDiv.innerText}

        </div>
    </div>;
  },

  componentDidUpdate() {
    var descriptionDOMNode = this.refs.description.getDOMNode();
    var clientRect = descriptionDOMNode.getBoundingClientRect();
    descriptionDOMNode.style.height = (300 - clientRect.top) + 'px';
  }

});

module.exports = NewsArticle;
