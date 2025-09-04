import { Searchbar } from 'react-native-paper'

const CustomSearchBar = ({
    placeholder,
    query,
    onSearch,
}: ICustomSearchBarProps) => {
    return (
        <Searchbar
            placeholder={placeholder}
            onChangeText={(val: string) => {
                onSearch(val)
            }}
            value={query}
            style={{
                height: 45,
                borderRadius: 8,
                paddingVertical: 0,
                backgroundColor: '#fff',
                marginTop: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
            }}
            inputStyle={{
                fontSize: 14,
                marginVertical: 0,
                paddingTop: -20,
            }}
        />
    )
}

export default CustomSearchBar
