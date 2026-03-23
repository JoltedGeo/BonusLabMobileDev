import { Formik } from "formik";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";
import InputField from "../components/InputField";
import { colors } from "../theme/MainColors";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import React, { useState } from "react";
import { Alert, ActivityIndicator } from "react-native";

type Props = {
    navigation: any;
};

const SignUpSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, "Name too short")
        .required("Full name is required"),

    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

    password: Yup.string()
        .min(5, "Password must be at least 5 characters")
        .required("Password is required"),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords don't match")
        .required("Confirm password"),
})

export default function SignUpScreen({ navigation }: Props) {
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState("");
    return (
        <View style={styles.screen}>
            <View style={styles.card}>
                <Text style={styles.title}>Sign Up</Text>
                <Text style={styles.subtitle}>Sign up to get started</Text>

                <Formik
                    initialValues={{
                        fullName: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                    }}
                    validationSchema={SignUpSchema}
                    validateOnMount={true}
                    /* On submit, try to create a new user account, or display an error if fails. Then set loading to false*/
                    onSubmit={async (values) => {
                    setAuthError("");
                    setLoading(true);
                    try {
                        const userCredential = await createUserWithEmailAndPassword(
                        auth,
                        values.email,
                        values.password
                        );

                        await updateProfile(userCredential.user, {
                            displayName: values.fullName,
                        });
                    } catch (error: any) {
                        if (error.code === "auth/email-already-in-use") {
                            setAuthError("That email is already in use.");
                        } else if (error.code === "auth/weak-password") {
                            setAuthError("Password is too weak.");
                        } else {
                            setAuthError("Could not create account. Please try again.");
                        }
                    } finally {
                        setLoading(false);
                    }
                    }}>

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
                        label="Full Name"
                        value={values.fullName}
                        onChangeText={handleChange("fullName")}
                        onBlur={handleBlur("fullName")}
                        error={errors.fullName}
                        touched={touched.fullName}
                        placeholder="Enter your full name"/>

                    <InputField
                        label="Email"
                        value={values.email}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        error={errors.email}
                        touched={touched.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="Enter your email"/>

                    <InputField
                        label="Password"
                        value={values.password}
                        secureTextEntry
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        error={errors.password}
                        touched={touched.password}
                        placeholder="Enter your password"/>

                    <InputField
                        label="Confirm Password"
                        value={values.confirmPassword}
                        secureTextEntry
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        error={errors.confirmPassword}
                        touched={touched.confirmPassword}
                        placeholder="Re-enter your password"/>

                    <Pressable
                        /* Display signup button when not creating account, display loading state when creating account */
                        onPress={handleSubmit as any}
                        disabled={!isValid || loading}
                        style={[styles.button, (!isValid || loading) && styles.buttonDisabled]}>
                        <Text style={styles.buttonText}>
                            {loading ? "Creating account.." : "Sign Up"}
                        </Text>
                    </Pressable>
                    {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
                    </>
                    )}
                </Formik>

                <View style={styles.redirectView}>
                    <Pressable onPress={() => navigation.navigate("Sign in")}>
                        <Text style={styles.link}>Already have an account? Sign In</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorText: {
    color: colors.error,
    marginTop: 10,
    textAlign: "center",
    fontSize: 13,
    },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: colors.subtext,
    fontSize: 15,
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  redirectView: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});