import { CaretDown } from 'phosphor-react';
import * as React from 'react';
import { useButton, useComboBox, useFilter } from 'react-aria';
import { Item, useComboBoxState } from 'react-stately';
import { clsx } from '../../lib/functions';

import { TextInput } from '../atoms/input';
import { ListBox } from '../atoms/listbox-ra';
import { LoadingIndicator } from '../atoms/loading-indicator';
import { Popover } from '../atoms/popover-ra';

export type ListBoxOption = {
    key: string;
    label: string;
    disabled?: boolean;
};

export type SearchAutocompleteProps = {
    variant?: 'primary' | 'secondary';
    className?: string;
    errorText?: string;
    helpText?: string;
    isLoading?: boolean;
    initialQuery?: string;
    onChange: (selectedKey: string) => void;
    value?: string;
    label: string;
    options: Array<ListBoxOption>;
    children?: (item: ListBoxOption) => React.ReactNode;
    onSearch?: (query: string) => void;
    disabled?: boolean;
    autoFocus?: boolean;
};

export function SearchAutocomplete(props: SearchAutocompleteProps) {
    const [query, setQuery] = React.useState(props.initialQuery ?? '');

    const id = React.useId();
    const initialEmptyId = React.useRef(id);

    const options: ListBoxOption[] = props.isLoading
        ? [
              {
                  key: `disabled-id-${initialEmptyId.current}`,
                  label: 'Recherche...',
                  disabled: true
              }
          ]
        : props.options.length === 0
        ? [
              {
                  key: `disabled-id-${initialEmptyId.current}`,
                  label: 'Aucun résultat trouvé',
                  disabled: true
              }
          ]
        : props.options;

    function getItem(item: ListBoxOption) {
        return <Item key={item.key}>{item.label}</Item>;
    }

    // Setup filter function and state.
    const { contains } = useFilter({ sensitivity: 'base' });
    const state = useComboBoxState({
        items: options,
        disabledKeys: options.filter(o => o.disabled).map(o => o.key),
        inputValue: query,
        onInputChange: val => {
            setQuery(val);
            props.onSearch?.(val);
        },
        children: getItem,
        isDisabled: props.disabled,
        selectedKey: props.value,
        onSelectionChange: key => {
            setQuery(props.options.find(o => o.key === key)?.label ?? '');
            props.onChange?.(key.toString());
        },
        defaultFilter: contains
    });

    // Setup refs and get props for child elements.
    const buttonRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const listBoxRef = React.useRef(null);
    const popoverRef = React.useRef(null);

    const {
        buttonProps: triggerProps,
        inputProps,
        listBoxProps,
        labelProps
    } = useComboBox(
        {
            children: getItem,
            inputRef,
            buttonRef,
            listBoxRef,
            popoverRef
        },
        state
    );

    const { buttonProps } = useButton(triggerProps, buttonRef);
    return (
        <div className={clsx(props.className, 'relative w-full')}>
            <TextInput
                {...inputProps}
                labelProps={{ ...labelProps }}
                disabled={props.disabled}
                label={props.label}
                ref={inputRef}
                autoFocus={props.autoFocus}
                errorText={props.errorText}
                helpText={props.helpText}
                appendix={
                    <button {...buttonProps} ref={buttonRef} className={``}>
                        {props.isLoading ? (
                            <LoadingIndicator className="h-5 w-5" />
                        ) : (
                            <CaretDown
                                weight="bold"
                                className={clsx('h-4 w-4', {
                                    'rotate-180': state.isOpen
                                })}
                            />
                        )}
                    </button>
                }
            />
            {state.isOpen && (
                <Popover
                    popoverRef={popoverRef}
                    isOpen={state.isOpen}
                    onClose={state.close}>
                    <ListBox
                        {...listBoxProps}
                        variant={props.variant}
                        listBoxRef={listBoxRef}
                        state={state}
                    />
                </Popover>
            )}
        </div>
    );
}
