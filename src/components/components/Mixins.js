import Events from '../../lib/Events';
import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import { Selector } from './Selector';
export default class Mixin extends React.Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { mixins: this.getMixinValue() };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.entity === prevProps.entity) {
      return;
    }
    this.setState({ mixins: this.getMixinValue() });
  }

  getMixinValue() {
    return (this.props.entity.getAttribute('mixin') || '')
      .split(/\s+/g)
      .filter((v) => !!v)
      .map((v) => ({ label: v, value: v }));
  }

  getMixinOptions = () => {
    const mixinIds = this.props.entity.mixinEls.map(function (mixin) {
      return mixin.id;
    });

    return Array.prototype.slice
      .call(document.querySelectorAll('a-mixin'))
      .filter(function (mixin) {
        return mixinIds.indexOf(mixin.id) === -1;
      })
      .sort()
      .map(function (mixin) {
        return { value: mixin.id, label: mixin.id };
      });
  };

  updateMixins = (value) => {
    const entity = this.props.entity;
    value = Array.isArray(value) ? value : [value];
    this.setState({ mixins: value });
    const mixinStr = value.map((v) => v.value).join(' ');
    entity.setAttribute('mixin', mixinStr);

    Events.emit('entityupdate', {
      component: 'mixin',
      entity: entity,
      property: '',
      value: mixinStr
    });
    if (typeof ga !== 'undefined') {
      ga('send', 'event', 'Components', 'addMixin');
    }
  };

  render() {
    return (
      <div className="mixinOptions">
        <div className="propertyRow">
          <span className="text">Model</span>
          <span className="mixinValue">
            {this.state.mixins.length >= 2 ? (
              <Select
                id="mixinSelect"
                classNamePrefix="select"
                options={this.getMixinOptions()}
                isMulti={true}
                placeholder="Add mixin..."
                noResultsText="No mixins found"
                onChange={this.updateMixins.bind(this)}
                simpleValue
                value={this.state.mixins}
              />
            ) : (
              <Selector
                id="mixinSelect"
                placeholder="Add mixin..."
                options={this.getMixinOptions()}
                icon={true}
                onSelect={(value) => this.updateMixins(value)}
              />
            )}
          </span>
        </div>
      </div>
    );
  }
}
