import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface Props extends TextInputProps {
    label: string;
    error?: string;
    touched?: boolean;
}

export default function InputField({ label, error, touched, ...props }: Props) {

    return (
        <View style={styles.container}>
            <Text>{label}</Text>
            <TextInput style={styles.input} {...props} />
            {touched && error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}


const styles = StyleSheet.create({
    container: { marginBottom: 15 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 6,
    },
    error: {
        color: "red",
        marginTop: 4,
    },
});