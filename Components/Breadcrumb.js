/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react');
var ReactStyle  = require('react-style');

var Breadcrumb = React.createClass({

  styles: {

    backButtonStyle: ReactStyle({
      cursor:   'pointer',
      padding:  '0 0 10px 10px'
    }),

    breadcrumbStyle: ReactStyle({
      lineHeight: '20px',
      margin:     0,
      padding:    '10px',
      width:      '600px',
      transform:  'translateX(0)',
      transition: 'transform .3s ease-in'
    }),

    crumbleStyle: ReactStyle({
      cursor:        'pointer',
      display:       'inline-block',
      marginRight:   '20px',
      position:      'relative',
      verticalAlign: 'top',
      width:         '270px'
    })

  },

  propTypes: {

  },

  render() {
    var props  = this.props;
    var styles = this.styles;
    var path   = props.path;
    var breadcrumbBlocks = [];

    for (var i = 0, l = path.length; i < l; i++) {
      var pathItem = path[i];
      breadcrumbBlocks[i] = <div data-position={i}
                                 ref={'crumble' + i}
                                 styles={styles.crumbleStyle}>
                              {pathItem}
                            </div>;
    }

    var inlineStyle;
    if (path.length > 1 && !props.home) {
      inlineStyle = ReactStyle({
        transform: 'translateX(-' + (this.refs.crumble0.getDOMNode().offsetWidth + 20) + 'px)'
      });
    }

    return <div>
          <h3 styles={[styles.breadcrumbStyle, inlineStyle]}>
            {breadcrumbBlocks}
          </h3>
          <a href="#" styles={styles.backButtonStyle}
             onClick={this.props.onBackButtonClick}>
            Go back
          </a>
         </div>;
  },

  onCrumbleClick(e) {
    console.log('Clicked crumble on position', e.target.dataset.position);
  }

});

module.exports = Breadcrumb;
