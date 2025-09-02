import React from 'react'
import { View } from 'react-native'
import {
    Controller,
    Control,
    FieldValues,
    Path,
    RegisterOptions,
} from 'react-hook-form'
import {
    TextInput as PaperInput,
    HelperText,
    Switch as PaperSwitch,
    Checkbox as PaperCheckbox,
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
