import React, { Component } from "react";
import PropTypes from "prop-types";
import { List, Map } from "immutable";
import classNames from "classnames";

import fieldDefinitions from "./field-definitions";
import { translate } from "react-i18next";
import constants from "../../constants";

import "./form-field.scss";

const Util = require("../../js/utils.js");

class FormField extends Component {
  constructor(props) {
    super(props);
    this.fieldDefinition = fieldDefinitions[this.props.fieldConfig.type];
    this.validator = this.fieldDefinition.getValidator(
      this.props.fieldConfig.optional,
    );

    // "autofill" is a better term than "autocomplete" for this feature.
    // TODO: Update this throughout the codebase.
    const autofillValue = this.props.fieldConfig.autocomplete
      ? Util.getAutocompleteValue(this.props.fieldConfig.name)
      : null;
    this.props.fieldConfig.hasAutofill = !!autofillValue;

    // TODO: This field initialization mechanism is a little convoluted.
    // We have to coordinate between the FormField component and its parent--
    // which manages the state--in order to initialize properly. We should
    // search for a better pattern to support field state management.
    const initialFieldValue = this.fieldDefinition.getInitialValue({
      value:
        this.props.fieldState.get(constants.FIELD_VALUE_KEY) ||
        autofillValue ||
        this.props.fieldConfig.default_value ||
        "",
      fieldConfig: this.props.fieldConfig,
      attachmentModels: this.props.attachmentModels,
    });

    this.state = {
      isInitialized: false,
    };

    this.onChange(this.props.fieldConfig.name, initialFieldValue, true);
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.isInitializing ||
      nextProps.showValidityStatus ||
      nextProps.updatingField === this.props.fieldConfig.name
    );
  }

  componentDidMount() {
    this.setState({
      isInitialized: true,
    });
  }

  onChange(fieldName, fieldValue, isInitializing = false) {
    this.props.onFieldChange({
      fieldName: fieldName,
      fieldStatus: Map()
        .set(constants.FIELD_VALUE_KEY, fieldValue)
        .set(
          constants.FIELD_VALIDITY_KEY,
          this.validator.validate({
            value: fieldValue,
            places: this.props.places,
            modelId: this.props.modelId,
          }),
        )
        .set(
          constants.FIELD_RENDER_KEY,
          this.props.fieldState.get(constants.FIELD_RENDER_KEY),
        )
        .set(constants.FIELD_VALIDITY_MESSAGE_KEY, this.validator.message),
      isInitializing: isInitializing,
    });
  }

  render() {
    const cn = {
      container: classNames("input-form__field-container", {
        "input-form__field-container--invalid":
          this.props.showValidityStatus &&
          !this.props.fieldState.get(constants.FIELD_VALIDITY_KEY),
      }),
      optionalMsg: classNames("input-form__optional-msg", {
        "input-form__optional-msg--visible": this.props.fieldConfig.optional,
      }),
    };
    const { t } = this.props;

    return (
      <div className={cn.container}>
        <p className="input-form__field-prompt">
          {this.props.fieldConfig.prompt}
          <span className={cn.optionalMsg}>{t("optionalMsg")}</span>
        </p>
        {this.state.isInitialized &&
          this.fieldDefinition.getComponent(this.props.fieldConfig, this)}
      </div>
    );
  }
}

FormField.propTypes = {
  attachmentModels: PropTypes.instanceOf(List),
  categoryConfig: PropTypes.object,
  disabled: PropTypes.bool,
  fieldConfig: PropTypes.object.isRequired,
  fieldState: PropTypes.object,
  map: PropTypes.object,
  mapConfig: PropTypes.object,
  modelId: PropTypes.number,
  onFieldChange: PropTypes.func.isRequired,
  onGeometryStyleChange: PropTypes.func,
  places: PropTypes.object,
  router: PropTypes.object,
  showValidityStatus: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.object,
  ]),
};

FormField.defaultProps = {
  attachmentModels: new List(),
};

export default translate("FormField")(FormField);