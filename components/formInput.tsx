import React from 'react'
import {
    Control,
    Controller,
    FieldValues,
    Path,
    RegisterOptions,
} from 'react-hook-form'
import { Pressable, ScrollView, View } from 'react-native'
import {
    Button,
    HelperText,
    List,
    Menu,
    Modal,
    Checkbox as PaperCheckbox,
    TextInput as PaperInput,
    Switch as PaperSwitch,
    Portal,
    RadioButton,
    Text,
} from 'react-native-paper'

type BaseProps<T extends FieldValues, N extends Path<T>> = {
    control: Control<T>
    name: N
    rules?: RegisterOptions<T, N>
    /** Extra hint shown when there's no error */
    description?: string
    /** Vertical spacing */
    spacing?: number
}

/** Low-level wrapper: use when you want a custom child (render-prop). */
export function FormField<T extends FieldValues, N extends Path<T>>(
    props: BaseProps<T, N> & {
        children: (args: {
            value: any
            onChange: (v: any) => void
            onBlur: () => void
            error?: string
        }) => React.ReactNode
    }
) {
    const { control, name, rules, description, children, spacing = 3 } = props

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => (
                <View>
                    {children({
                        value: field.value,
                        onChange: field.onChange,
                        onBlur: field.onBlur,
                        error: fieldState.error?.message,
                    })}
                    <HelperText type="error" visible={!!fieldState.error}>
                        {fieldState.error?.message ?? ''}
                    </HelperText>
                    {!fieldState.error && !!description ? (
                        <HelperText type="info" visible>
                            {description}
                        </HelperText>
                    ) : null}
                </View>
            )}
        />
    )
}

/** Paper TextInput adapter (outlined by default). */
FormField.PaperInput = function PaperInputField<
    T extends FieldValues,
    N extends Path<T>,
>(
    props: BaseProps<T, N> &
        Omit<
            React.ComponentProps<typeof PaperInput>,
            'value' | 'onChangeText' | 'error'
        >
) {
    const {
        control,
        name,
        rules,
        description,
        spacing = 2,
        ...inputProps
    } = props

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => (
                <View style={{ marginBottom: spacing }}>
                    <PaperInput
                        mode="outlined"
                        {...inputProps}
                        value={field.value ?? ''}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        error={!!fieldState.error}
                    />
                    <HelperText type="error" visible={!!fieldState.error}>
                        {fieldState.error?.message ?? ''}
                    </HelperText>
                    {!fieldState.error && !!description ? (
                        <HelperText type="info" visible>
                            {description}
                        </HelperText>
                    ) : null}
                </View>
            )}
        />
    )
}

/** Paper Switch adapter (with optional inline label). */
FormField.PaperSwitch = function PaperSwitchField<
    T extends FieldValues,
    N extends Path<T>,
>(
    props: BaseProps<T, N> &
        Omit<
            React.ComponentProps<typeof PaperSwitch>,
            'value' | 'onValueChange'
        > & {
            label?: string
        }
) {
    const {
        control,
        name,
        rules,
        description,
        spacing = 3,
        label,
        ...switchProps
    } = props

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => (
                <View style={{ marginBottom: spacing }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <PaperSwitch
                            {...switchProps}
                            value={!!field.value}
                            onValueChange={field.onChange}
                        />
                        {label ? <Text>{label}</Text> : null}
                    </View>
                    <HelperText type="error" visible={!!fieldState.error}>
                        {fieldState.error?.message ?? ''}
                    </HelperText>
                    {!fieldState.error && !!description ? (
                        <HelperText type="info" visible>
                            {description}
                        </HelperText>
                    ) : null}
                </View>
            )}
        />
    )
}

/** Paper Checkbox adapter (status-based). */
FormField.PaperCheckbox = function PaperCheckboxField<
    T extends FieldValues,
    N extends Path<T>,
>(
    props: BaseProps<T, N> &
        Omit<
            React.ComponentProps<typeof PaperCheckbox>,
            'status' | 'onPress'
        > & {
            label?: string
        }
) {
    const {
        control,
        name,
        rules,
        description,
        spacing = 3,
        label,
        ...checkboxProps
    } = props

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => {
                const checked = !!field.value
                return (
                    <View style={{ marginBottom: spacing }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <PaperCheckbox
                                {...checkboxProps}
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => field.onChange(!checked)}
                            />
                            {label ? (
                                <Text onPress={() => field.onChange(!checked)}>
                                    {label}
                                </Text>
                            ) : null}
                        </View>
                        <HelperText type="error" visible={!!fieldState.error}>
                            {fieldState.error?.message ?? ''}
                        </HelperText>
                        {!fieldState.error && !!description ? (
                            <HelperText type="info" visible>
                                {description}
                            </HelperText>
                        ) : null}
                    </View>
                )
            }}
        />
    )
}

/** Paper Radio Group adapter. Pass RadioButton.Item children. */
FormField.PaperRadioGroup = function PaperRadioGroupField<
    T extends FieldValues,
    N extends Path<T>,
>(
    props: BaseProps<T, N> & {
        children: React.ReactNode // e.g., <RadioButton.Item ... />
    }
) {
    const { control, name, rules, description, spacing = 3, children } = props

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => (
                <View style={{ marginBottom: spacing }}>
                    <RadioButton.Group
                        onValueChange={field.onChange}
                        value={field.value}
                    >
                        {children}
                    </RadioButton.Group>
                    <HelperText type="error" visible={!!fieldState.error}>
                        {fieldState.error?.message ?? ''}
                    </HelperText>
                    {!fieldState.error && !!description ? (
                        <HelperText type="info" visible>
                            {description}
                        </HelperText>
                    ) : null}
                </View>
            )}
        />
    )
}

// ---- Password input (with eye icon toggle) ----
FormField.PaperPassword = function PaperPasswordField<
    T extends FieldValues,
    N extends Path<T>,
>(
    props: BaseProps<T, N> &
        Omit<
            React.ComponentProps<typeof PaperInput>,
            'value' | 'onChangeText' | 'error' | 'secureTextEntry'
        >
) {
    const {
        control,
        name,
        rules,
        description,
        spacing = 3,
        ...inputProps
    } = props
    const [visible, setVisible] = React.useState(false)

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => (
                <View style={{ marginBottom: spacing }}>
                    <PaperInput
                        mode="outlined"
                        {...inputProps}
                        value={field.value ?? ''}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        secureTextEntry={!visible}
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="password"
                        right={
                            <PaperInput.Icon
                                icon={
                                    visible ? 'eye-off-outline' : 'eye-outline'
                                }
                                onPress={() => setVisible((v) => !v)}
                                // prevents the input from losing focus on toggle
                                forceTextInputFocus={false}
                            />
                        }
                        error={!!fieldState.error}
                    />
                    <HelperText type="error" visible={!!fieldState.error}>
                        {fieldState.error?.message ?? ''}
                    </HelperText>
                    {!fieldState.error && !!description ? (
                        <HelperText type="info" visible>
                            {description}
                        </HelperText>
                    ) : null}
                </View>
            )}
        />
    )
}

// --- Number input (with sanitizing, formatting, min/max, decimals) ---
FormField.PaperNumber = function PaperNumberField<
    T extends FieldValues,
    N extends Path<T>,
>(
    props: BaseProps<T, N> &
        Omit<
            React.ComponentProps<typeof PaperInput>,
            'value' | 'onChangeText' | 'error' | 'keyboardType'
        > & {
            /** number of decimal places; if undefined/0 -> integer mode */
            precision?: number
            /** clamp into [min, max] on blur when set */
            min?: number
            max?: number
            /** allow negative numbers (default: false) */
            allowNegative?: boolean
            /** apply thousands separators on blur (default: false) */
            thousandSeparator?: boolean
            /** format + clamp when leaving the field (default: true) */
            formatOnBlur?: boolean
            /** decimal separator character users will type (default: ".") */
            decimalSeparator?: '.' | ','
        }
) {
    const {
        control,
        name,
        rules,
        description,
        spacing = 14,
        precision = 0,
        min,
        max,
        allowNegative = false,
        thousandSeparator = false,
        formatOnBlur = true,
        decimalSeparator = '.',
        ...inputProps
    } = props

    const decChar = decimalSeparator
    const usesDecimal = (precision ?? 0) > 0

    const sanitize = React.useCallback(
        (s: string) => {
            if (!s) return ''
            // keep digits, 1 decimal char (., or ,), optional leading minus
            const neg = allowNegative ? '-?' : ''
            const dec = usesDecimal ? `\\${decChar}?` : ''
            const re = new RegExp(
                `[^0-9${usesDecimal ? decChar : ''}${allowNegative ? '-' : ''}]`,
                'g'
            )
            let t = s.replace(re, '')

            // enforce single leading minus
            if (allowNegative) {
                t = t.replace(/-/g, '')
                if (s.trim().startsWith('-')) t = '-' + t
            }

            if (usesDecimal) {
                // keep only first decimal separator
                const first = t.indexOf(decChar)
                if (first !== -1) {
                    const before = t.slice(0, first + 1)
                    const after = t
                        .slice(first + 1)
                        .replace(new RegExp(`\\${decChar}`, 'g'), '')
                    t = before + after
                }
                // limit fraction length
                const [intPart, fracPart = ''] = t.split(decChar)
                t = fracPart
                    ? `${intPart}${decChar}${fracPart.slice(0, precision)}`
                    : intPart
            }
            return t
        },
        [allowNegative, usesDecimal, precision, decChar]
    )

    const toNumber = React.useCallback(
        (s: string): number | undefined => {
            if (s === '' || s === '-' || s === decChar || s === `-${decChar}`)
                return undefined
            const normalized = usesDecimal ? s.replace(decChar, '.') : s
            const n = Number(normalized)
            return Number.isFinite(n) ? n : undefined
        },
        [usesDecimal, decChar]
    )

    const format = React.useCallback(
        (n: number | undefined) => {
            if (n === undefined || n === null || Number.isNaN(n)) return ''
            let v = n
            if (typeof min === 'number') v = Math.max(min, v)
            if (typeof max === 'number') v = Math.min(max, v)

            // fixed decimals
            let s = usesDecimal
                ? v.toFixed(precision)
                : Math.trunc(v).toString()

            // thousand separators
            if (thousandSeparator) {
                const [i, f] = s.split('.')
                const withSep = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                s = f !== undefined ? `${withSep}${decChar}${f}` : withSep
            } else if (usesDecimal && decChar !== '.') {
                // swap dot to target decimal char
                s = s.replace('.', decChar)
            }
            return s
        },
        [min, max, usesDecimal, precision, thousandSeparator, decChar]
    )

    const keyboardType = usesDecimal ? 'decimal-pad' : 'number-pad'

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => {
                const [focused, setFocused] = React.useState(false)
                const [text, setText] = React.useState<string>('')

                // sync local text when form value changes (e.g., reset/prefill)
                React.useEffect(() => {
                    if (focused) return // don't fight the user's typing
                    const t =
                        field.value === undefined ? '' : format(field.value)
                    setText(t)
                }, [field.value, format, focused])

                return (
                    <View style={{ marginBottom: spacing }}>
                        <PaperInput
                            mode="outlined"
                            {...inputProps}
                            keyboardType={keyboardType as any}
                            value={text}
                            onChangeText={(raw) => {
                                const s = sanitize(raw)
                                setText(s)
                                const num = toNumber(s)
                                field.onChange(num)
                            }}
                            onFocus={(e) => {
                                setFocused(true)
                                // show raw (no thousand separators) while editing
                                const raw =
                                    field.value === undefined
                                        ? ''
                                        : (() => {
                                              let s = String(field.value)
                                              if (
                                                  usesDecimal &&
                                                  decChar !== '.'
                                              )
                                                  s = s.replace('.', decChar)
                                              return s
                                          })()
                                setText(raw)
                                inputProps.onFocus?.(e)
                            }}
                            onBlur={(e) => {
                                setFocused(false)
                                if (formatOnBlur) {
                                    // clamp and pretty-print
                                    const clamped =
                                        typeof field.value === 'number'
                                            ? Math.min(
                                                  typeof max === 'number'
                                                      ? max
                                                      : Infinity,
                                                  Math.max(
                                                      typeof min === 'number'
                                                          ? min
                                                          : -Infinity,
                                                      field.value
                                                  )
                                              )
                                            : field.value
                                    if (clamped !== field.value)
                                        field.onChange(clamped)
                                    setText(format(clamped))
                                }
                                field.onBlur()
                                inputProps.onBlur?.(e)
                            }}
                            error={!!fieldState.error}
                        />
                        <HelperText type="error" visible={!!fieldState.error}>
                            {fieldState.error?.message ?? ''}
                        </HelperText>
                        {!fieldState.error && !!description ? (
                            <HelperText type="info" visible>
                                {description}
                            </HelperText>
                        ) : null}
                    </View>
                )
            }}
        />
    )
}

/* ===========================
   Single-Select (Menu)
   =========================== */
FormField.PaperSelect = function PaperSelectField<
    T extends FieldValues,
    N extends Path<T>,
>(
    props: BaseProps<T, N> & {
        label?: string
        placeholder?: string
        options: Array<{ label: string; value: string | number }>
        clearable?: boolean
        disabled?: boolean
    }
) {
    const {
        control,
        name,
        rules,
        description,
        spacing = 14,
        label,
        placeholder,
        options,
        clearable,
        disabled,
    } = props

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => {
                const [open, setOpen] = React.useState(false)
                const selected = options.find(
                    (o) => String(o.value) === String(field.value)
                )
                const display = selected?.label ?? ''

                return (
                    <View style={{ marginBottom: spacing }}>
                        <Menu
                            visible={open}
                            onDismiss={() => setOpen(false)}
                            anchor={
                                <Pressable
                                    onPress={() => !disabled && setOpen(true)}
                                >
                                    <PaperInput
                                        mode="outlined"
                                        label={label}
                                        value={display}
                                        placeholder={placeholder}
                                        editable={false}
                                        right={
                                            <PaperInput.Icon icon="menu-down" />
                                        }
                                        error={!!fieldState.error}
                                        disabled={disabled}
                                    />
                                </Pressable>
                            }
                        >
                            {clearable && (
                                <Menu.Item
                                    title="— Clear —"
                                    onPress={() => {
                                        field.onChange(undefined)
                                        setOpen(false)
                                    }}
                                />
                            )}
                            {options.map((opt) => (
                                <Menu.Item
                                    key={`${opt.value}`}
                                    title={opt.label}
                                    onPress={() => {
                                        field.onChange(opt.value)
                                        setOpen(false)
                                    }}
                                />
                            ))}
                        </Menu>

                        <HelperText type="error" visible={!!fieldState.error}>
                            {fieldState.error?.message ?? ''}
                        </HelperText>
                        {!fieldState.error && !!description ? (
                            <HelperText type="info" visible>
                                {description}
                            </HelperText>
                        ) : null}
                    </View>
                )
            }}
        />
    )
}

/* ===========================
    Multi-Select (Modal + checkboxes)
    =========================== */
FormField.PaperMultiSelect = function PaperMultiSelectField<
    T extends FieldValues,
    N extends Path<T>,
>(
    props: BaseProps<T, N> & {
        label?: string
        placeholder?: string
        options: Array<{ label: string; value: string | number }>
        searchable?: boolean
        disabled?: boolean
    }
) {
    const {
        control,
        name,
        rules,
        description,
        spacing = 14,
        label,
        placeholder,
        options,
        searchable = true,
        disabled,
    } = props

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => {
                const [open, setOpen] = React.useState(false)
                const [query, setQuery] = React.useState('')

                const valueArr: Array<string | number> = Array.isArray(
                    field.value
                )
                    ? field.value
                    : []

                const filtered =
                    !searchable || !query
                        ? options
                        : options.filter((o) =>
                              o.label
                                  .toLowerCase()
                                  .includes(query.toLowerCase())
                          )

                const selectedLabels = options
                    .filter((o) =>
                        valueArr.map(String).includes(String(o.value))
                    )
                    .map((o) => o.label)
                    .join(', ')

                const toggle = (val: string | number) => {
                    const exists = valueArr.map(String).includes(String(val))
                    const next = exists
                        ? valueArr.filter((v) => String(v) !== String(val))
                        : [...valueArr, val]
                    field.onChange(next)
                }

                return (
                    <View style={{ marginBottom: spacing }}>
                        <Pressable onPress={() => !disabled && setOpen(true)}>
                            <PaperInput
                                mode="outlined"
                                label={label}
                                placeholder={placeholder}
                                value={selectedLabels}
                                editable={false}
                                right={<PaperInput.Icon icon="chevron-down" />}
                                error={!!fieldState.error}
                                disabled={disabled}
                            />
                        </Pressable>

                        <HelperText type="error" visible={!!fieldState.error}>
                            {fieldState.error?.message ?? ''}
                        </HelperText>
                        {!fieldState.error && !!description ? (
                            <HelperText type="info" visible>
                                {description}
                            </HelperText>
                        ) : null}

                        <Portal>
                            <Modal
                                visible={open}
                                onDismiss={() => setOpen(false)}
                                contentContainerStyle={{
                                    margin: 16,
                                    backgroundColor: 'white',
                                    borderRadius: 12,
                                    padding: 12,
                                }}
                            >
                                {searchable && (
                                    <PaperInput
                                        mode="outlined"
                                        placeholder="Cari…"
                                        value={query}
                                        onChangeText={setQuery}
                                        left={
                                            <PaperInput.Icon icon="magnify" />
                                        }
                                        style={{ marginBottom: 8 }}
                                    />
                                )}

                                <ScrollView style={{ maxHeight: 360 }}>
                                    {filtered.map((o) => {
                                        const checked = valueArr
                                            .map(String)
                                            .includes(String(o.value))
                                        return (
                                            <List.Item
                                                key={`${o.value}`}
                                                title={o.label}
                                                onPress={() => toggle(o.value)}
                                                right={() => (
                                                    <PaperCheckbox
                                                        status={
                                                            checked
                                                                ? 'checked'
                                                                : 'unchecked'
                                                        }
                                                        onPress={() =>
                                                            toggle(o.value)
                                                        }
                                                    />
                                                )}
                                            />
                                        )
                                    })}
                                </ScrollView>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: 8,
                                        marginTop: 12,
                                    }}
                                >
                                    <Button
                                        onPress={() => field.onChange([])}
                                        mode="text"
                                    >
                                        Clear
                                    </Button>
                                    <View style={{ flex: 1 }} />
                                    <Button
                                        mode="contained"
                                        onPress={() => setOpen(false)}
                                    >
                                        Done
                                    </Button>
                                </View>
                            </Modal>
                        </Portal>
                    </View>
                )
            }}
        />
    )
}
