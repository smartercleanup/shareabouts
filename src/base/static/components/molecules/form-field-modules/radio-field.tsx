/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withTranslation, WithTranslation } from "react-i18next";
import { FieldProps as FormikFieldProps } from "formik";

import { MapseedRadioFieldModule } from "../../../state/ducks/forms";
import { FieldPrompt } from "../../atoms/typography";
import { Image } from "../../atoms/imagery";

type RadioFieldModuleProps = {
  mapseedField: MapseedRadioFieldModule;
} & FormikFieldProps &
  WithTranslation;

const RadioField = ({
  field: { name, value: fieldValue, onBlur, onChange },
  mapseedField: { prompt, id, options },
}: RadioFieldModuleProps) => {
  return (
    <React.Fragment>
      {prompt && <FieldPrompt>{prompt}</FieldPrompt>}
      <RadioGroup
        value={fieldValue}
        onChange={onChange}
        onBlur={onBlur}
        id={name}
        name={name}
      >
        {options.map(({ label, value, icon }) => (
          <React.Fragment>
            <FormControlLabel
              key={String(value)}
              value={value}
              control={<Radio />}
              label={
                <span
                  css={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  {icon && (
                    <Image
                      css={css`
                        margin-right: 8px;
                      `}
                      src={icon}
                      height="30px"
                      width="auto"
                      alt="Radio field icon"
                    />
                  )}
                  {label}
                </span>
              }
            />
          </React.Fragment>
        ))}
      </RadioGroup>
    </React.Fragment>
  );
};

export default withTranslation("RadioField")(RadioField);
