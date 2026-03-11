import InputField from "@/components/InputField";
import { Formik } from "formik";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";

type Props = {
    navigation: any;
};

const SignInSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

    password: Yup.string()
        .min(5, "Password must be at least 5 characters")
        .required("Password is required"),
});


export default function SignInScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={SignInSchema}
                onSubmit={(values) => {
                    console.log(values)
                }}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    isValid,
                }) => (
                    <>
                        <InputField
                            label="Email"
                            value={values.email}
                            onChangeText={handleChange("email")}
                            onBlur={handleBlur("email")}
                            error={errors.email}
                            touched={touched.email}
                        />

                        <InputField
                            label="Password"
                            value={values.password}
                            secureTextEntry
                            onChangeText={handleChange("password")}
                            onBlur={handleBlur("password")}
                            error={errors.password}
                            touched={touched.password}
                        />

                        <Button
                            title="Sign In"
                            onPress={handleSubmit as any}
                            disabled={!isValid}
                        />
                    </>
                )}
            </Formik>

            <View style={styles.redirectView}>
                <Pressable onPress={() => navigation.navigate("Sign up")} style={styles.redirect}>
                    <Text>Don&apos;t have an account? Sign Up</Text>
                </Pressable></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    redirect: {
        padding: 10,
    },
    redirectView: {
        justifyContent: "center",
        alignItems: "center"
    }
});