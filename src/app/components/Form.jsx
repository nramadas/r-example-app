import React from 'react';
import { connect } from 'react-redux';
import { METHODS } from '@r/platform/router';
import * as platformActions from '@r/platform/actions';

const T = React.PropTypes;

export const getValues = form => {
  if (!form || form.nodeName.toLowerCase() !== 'form') {
    return {};
  }

  return Array.from(form.elements).reduce((values, el) => {
    if (el.name) {
      switch(el.type) {
        case 'checkbox': {
          if (!values[el.name]) values[el.name] = [];
          if (el.value) values[el.name].push(el.value);
          break;
        }
        case 'select-multiple': {
          values[el.name] = Array.from(el.options).map(o => o.value);
        }
        default: {
          values[el.name] = el.value;
          break;
        }
      }
    }
    return values;
  }, {});
};

export class Form extends React.Component {
  static propTypes = {
    action: T.string.isRequired,
    method: T.oneOf([METHODS.POST, METHODS.PUT, METHODS.DELETE, METHODS.PATCH]),
    className: T.string,
    onSubmit: T.func,
  };

  static defaultProps = {
    method: METHODS.POST,
    onSubmit: () => {},
  };

  handleSubmit = e => {
    e.preventDefault();

    const form = e.target;
    this.props.onSubmit(this.props.action, this.props.method, getValues(form));
  }

  render() {
    const { className, action, method, children } = this.props;

    return (
      <form
        className={ className}
        action={ action }
        method={ method }
        onSubmit={ this.handleSubmit }
      >
        { children }
      </form>
    )
  }
}

const dispatcher = dispatch => ({
  onSubmit: (url, method, bodyParams) => dispatch(
    platformActions.navigateToUrl(method, url, { bodyParams })
  ),
});

export default connect(null, dispatcher)(Form);
