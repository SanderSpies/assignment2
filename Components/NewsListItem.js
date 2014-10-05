/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react');
var ReactStyle  = require('react-style');

var NewsListItem = React.createClass({

  styles: {

    normalStyle: ReactStyle({
      cursor: 'pointer',
      padding: '10px',
      ':hover': {
        backgroundColor: '#E0E0E0'
      }
    })

  },

  propTypes: {
    data:   React.PropTypes.object,
    expand: React.PropTypes.number
  },

  render() {
    var props = this.props;
    var styles = this.styles;
    var newsItemData = props.data;
    var title = newsItemData.title;

    return <li data-position={props.position} styles={[styles.normalStyle]}>
      {title}
    </li>;
  }

});

module.exports = NewsListItem;
