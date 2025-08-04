import React, { useState, useRef, useEffect } from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Checkbox from '@mui/material/Checkbox'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import Popover from '@mui/material/Popover'
import { withTranslation, WithTranslation } from 'react-i18next'
import { i18n } from '../Settings/LanguageSelector'
import './RecurrencePicker.scss'

const getInterval = (recurrence: string | null): void => recurrence ? recurrence.match(/[a-zA-Z]+/) : 'd'
const getAmount = (recurrence: string | null): void => recurrence ? recurrence.match(/\d+/) : 1
const getStrictIndicator = (recurrence: string | null): void => !!recurrence?.startsWith('+')

interface RecurrencePickerComponentProps extends WithTranslation {
  recurrence: string | null
  handleChange: (key: string, value: string) => void
  t: typeof i18n.t
}

const RecurrencePickerComponent: React.FC<RecurrencePickerComponentProps> = ({
  recurrence,
  handleChange,
  t
}) => {

  const recurrenceFieldRef = useRef<HTMLInputElement | null>(null)
  const [strictRecurrence, setStrictRecurrence] = useState<boolean>(false)
  const [interval, setInterval] = useState<string | null>(null)
  const [amount, setAmount] = useState<string | null>(null)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, popupState): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      const updatedRecurrence = (getStrictIndicator(recurrence) ? '+' : '') + getAmount(recurrence) + getInterval(recurrence)
      handleChange('rec', updatedRecurrence)
      popupState.close()
    }
  }

  useEffect(() => {
    setStrictRecurrence(getStrictIndicator(recurrence))
    setAmount(getAmount(recurrence))
    setInterval(getInterval(recurrence))
  }, [recurrence])

  return (
    <PopupState
      variant="popover"
      popupId="recurrencePicker"
      disableAutoFocus={true}
      parentPopupState={null}
    >
      {(popupState) => (
        <FormControl
          onKeyDown={(event) => {handleKeyDown(event, popupState)}}
        >
          <TextField
            label={t('todoDialog.recurrencePicker.label')}
            className="recurrencePicker"
            onChange={(event) => handleChange('rec', event.target.value ?? '')}
            value={recurrence || '-'}
            inputRef={recurrenceFieldRef}
            data-testid="dialog-picker-recurrence"
            // InputLabelProps={{
            //   shrink: true
            // }}
            {...bindTrigger(popupState)}
          />

          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <FormControl>
              <TextField
                autoFocus={true}
                label={t('todoDialog.recurrencePicker.every')}
                type="number"
                onChange={(event) => {
                  const updatedRecurrence = getStrictIndicator(recurrence) ? '+' + event.target.value + getInterval(recurrence) : event.target.value + getInterval(recurrence)
                  handleChange('rec', updatedRecurrence)
                }}
                value={amount}
                className="recurrencePickerPopupInput"
                inputProps={{
                  min: 0
                }}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
            <FormControl>
              <RadioGroup
                aria-labelledby="recurrencePickerRadioGroup"
                value={interval}
                onChange={(event) => {
                  const updatedRecurrence = getStrictIndicator(recurrence) ? '+' + getAmount(recurrence) + event.target.defaultValue : getAmount(recurrence) + event.target.defaultValue
                  handleChange('rec', updatedRecurrence)
                }}
              >
                <FormControlLabel
                  value="d"
                  control={<Radio />}
                  label={t('todoDialog.recurrencePicker.day')}
                />
                <FormControlLabel
                  value="b"
                  control={<Radio />}
                  label={t('todoDialog.recurrencePicker.businessDay')}
                />
                <FormControlLabel
                  value="w"
                  control={<Radio />}
                  label={t('todoDialog.recurrencePicker.week')}
                />
                <FormControlLabel
                  value="m"
                  control={<Radio />}
                  label={t('todoDialog.recurrencePicker.month')}
                />
                <FormControlLabel
                  value="y"
                  control={<Radio />}
                  label={t('todoDialog.recurrencePicker.year')}
                />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={strictRecurrence}
                    onChange={(event) => {
                      const updatedRecurrence = event.target.checked ? '+' + getAmount(recurrence) + getInterval(recurrence) : getAmount(recurrence) + getInterval(recurrence)
                      handleChange('rec', updatedRecurrence)
                    }}
                    name="strictRecurrenceCheckbox"
                  />
                }
                label={t('todoDialog.recurrencePicker.strict')}
              />
            </FormControl>
          </Popover>
        </FormControl>
      )}
    </PopupState>
  )
}

export default withTranslation()(RecurrencePickerComponent)
