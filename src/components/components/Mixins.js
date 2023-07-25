import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Events from '../../lib/Events';
import { DropdownArrowIcon } from '../../icons';

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
      .sort()
      .map(function (mixin) {
        return { value: mixin.id, label: mixin.id };
      });
  };

  updateMixins = (value) => {
    const entity = this.props.entity;
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

  updateMixinSingle = (value) => {
    const entity = this.props.entity;
    this.setState({ mixins: value });
    const mixinStr = value.value;
    // hack to fix error that sometimes a newly selected model won't load
    entity.setAttribute('mixin', '');
    entity.setAttribute('mixin', value.value);
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
                components={{
                  DropdownIndicator: DropdownArrowIcon,
                  IndicatorSeparator: () => null
                }}
                isMulti={true}
                placeholder="Search mixins..."
                noResultsText="No mixins found"
                onChange={this.updateMixins.bind(this)}
                simpleValue
                value={this.state.mixins}
              />
            ) : (
              <Select
                id="mixinSelect"
                classNamePrefix="select-single"
                options={this.getMixinOptions()}
                components={{
                  DropdownIndicator: DropdownArrowIcon,
                  IndicatorSeparator: () => null
                }}
                isMulti={false}
                isSearchable={true}
                isClearable={false}
                placeholder="Search models..."
                noResultsText="No models found"
                onChange={this.updateMixinSingle.bind(this)}
                simpleValue
                value={this.state.mixins}
              />
            )}
          </span>
        </div>
      </div>
    );
  }
}
