import { LitElement, html, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import type { UmbInputDateElement } from '@umbraco-cms/backoffice/components';
import { UmbPropertyEditorConfigCollection, UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';

@customElement('date-picker-offset-property-editor-ui')
export default class DatePickerOffsetPropertyEditorUIElement extends LitElement implements UmbPropertyEditorUiElement {
	@property()
	value?: string;

	@state()
	private _inputValue?: string;

	@state()
	private _min?: string;

	@state()
	private _max?: string;

	@state()
	private _step?: number;

	@state()
	private _readOnly?: boolean;

	@state()
	private _inputType: UmbInputDateElement['type'] = 'datetime-local';

	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		if (!config) return;

		// Format string prevalue/config
		const format = config.getValueByAlias<string>('format');
		const hasTime = (format?.includes('H') || format?.includes('m')) ?? false;
		const hasSeconds = format?.includes('s') ?? false;
		this._inputType = hasTime ? 'datetime-local' : 'date';
		this._readOnly = config.getValueByAlias('readonly');

		// Based on the type of format string change the UUI-input type
		// Note: The format string is not validated, so it's possible to have an invalid format string,
		// but we do not use the format string for anything else than to determine the input type.
		// The format string is not used to validate the value and is only used on the frontend.
		const timeFormatPattern = /^h{1,2}:m{1,2}(:s{1,2})?\s?a?$/gim;
		if (format?.toLowerCase().match(timeFormatPattern)) {
			this._inputType = 'time';
		}

		this._min = config.getValueByAlias('min');
		this._max = config.getValueByAlias('max');
		this._step = (config.getValueByAlias('step') ?? hasSeconds) ? 1 : undefined;

		if (this.value) {
			this.#formatValue(this.value);
		}
	}

	#convertTimeZone(dateString: string) {
		let dateValue = new Date(dateString);

		//Define options for formatting the date and time in current local

		let formattedLocaleTime = new Intl.DateTimeFormat('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		}).format(dateValue);

		//Get the GMT offset
		let gmtOffset = dateValue.getTimezoneOffset();
		let offsetHours = Math.abs(Math.floor(gmtOffset / 60)).toString().padStart(2, '0');
		let offsetMinutes = Math.abs(gmtOffset % 60).toString().padStart(2, '0');
		let gmtString = `GMT${gmtOffset > 0 ? '-' : '+'}${offsetHours}${offsetMinutes}`;

		let finalLocaleTimeString = `${formattedLocaleTime} ${gmtString}`;
		return finalLocaleTimeString;
	}

	#formatValue(value: string) {
		this._inputValue = undefined;

		if (isNaN(new Date(value).getTime())) {
			console.warn(`[UmbDatePicker] Invalid date: ${value}`);
			return;
		}
		var valueDate = new Date(this.#convertTimeZone(value));

		let hours = valueDate.getHours();
		let minutes = valueDate.getMinutes();
		let seconds = valueDate.getSeconds();
		let date = valueDate.getDate();
		let month = valueDate.getMonth() + 1;
		let year = valueDate.getFullYear();
		let timeValue = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		let dateValue = `${year.toString()}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`
		switch (this._inputType) {
			case 'time':
				this._inputValue = `0001-01-01 ${timeValue}`;
				break;
			case 'date':
				this._inputValue = `${dateValue} 00:00:00`;
				break;
			default:
				this._inputValue = `${dateValue} ${timeValue}`;
				break;
		}
	}

	#onChange(event: CustomEvent & { target: UmbInputDateElement }) {
		let value = event.target.value.toString();

		if (!value) {
			this.#syncValue(undefined);
			return;
		}

		switch (this._inputType) {
			case 'time':
				value = `0001-01-01 ${value}`;
				break;
			case 'date':
				value = `${value} 00:00:00`;
				break;
			case 'datetime-local':
				value = value.replace('T', ' ');
				break;
		}

		this.#syncValue(value);
	}

	#syncValue(value?: string) {
		const valueHasChanged = this.value !== value;
		if (valueHasChanged) {
			if (value) {
				let offsetTime = new Date(value?.toString()).toString();
				this.value = offsetTime.split('(')[0].trim();
			}
			else {
				this.value = value;
			}

			this.dispatchEvent(new UmbPropertyValueChangeEvent());
		}
	}

	render() {
		if (this._readOnly) {
			return html`
			${this._inputValue}
			`
		}
		else {
			return html`
				<umb-input-date
					.value=${this._inputValue}
					.min=${this._min}
					.max=${this._max}
					.step=${this._step}
					.type=${this._inputType}
					@change=${this.#onChange}
				>
				</umb-input-date>
				`;
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'date-picker-offset-property-editor-ui': DatePickerOffsetPropertyEditorUIElement;
	}
}