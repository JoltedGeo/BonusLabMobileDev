import { Formik } from "formik";
import React, { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Yup from "yup";
import InputField from "../components/InputField";
import { colors } from "../theme/MainColors";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { Alert } from "react-native";
import { signOut } from "firebase/auth";

type Props = {
  navigation: any;
};

const EmployeeInfoSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(2, "First name too short")
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .min(2, "Last name too short")
    .required("Last name is required"),

  employeeId: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z0-9]+$/,
      "Employee ID can only contain letters and numbers",
    )
    .required("Employee ID is required"),

  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),

  phone: Yup.string()
    .trim()
    .matches(/^\d{10}$/, "Phone must be 10 digits")
    .required("Phone number is required"),

  department: Yup.string().trim().required("Department is required"),

  startDate: Yup.string()
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD")
    .required("Start date is required"),
});

export default function EmployeeInfoScreen({ navigation }: Props) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollViewPadding}>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            employeeId: "",
            email: "",
            phone: "",
            department: "",
            startDate: "",
          }}
          validationSchema={EmployeeInfoSchema}
          validateOnMount={true}
          onSubmit={async (values, { resetForm }) => {
            setSubmitting(true);
            console.log("SUBMIT STARTED");

            try {
              const user = auth.currentUser;

              if (!user) {
                Alert.alert("Error", "You must be signed in.");
                return;
              }

              await addDoc(collection(db, "employeeSubmissions"), {
                userId: user.uid,
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                employeeId: values.employeeId.trim(),
                email: values.email.trim(),
                phone: values.phone.trim(),
                department: values.department.trim(),
                startDate: values.startDate.trim(),
                createdAt: serverTimestamp(),
              });

              console.log("FIRESTORE SAVE SUCCESS");
              Alert.alert("Success", "Employee info saved.");
              resetForm();
            } catch (error: any) {
              console.log("EMPLOYEE SAVE ERROR:", error);
              console.log("EMPLOYEE SAVE ERROR CODE:", error?.code);
              console.log("EMPLOYEE SAVE ERROR MESSAGE:", error?.message);
              Alert.alert(
                "Error",
                error?.message ?? "Could not save employee info. Please try again."
              );
            } finally {
              console.log("SETTING SUBMITTING FALSE");
              setSubmitting(false);
            }
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
            <View style={styles.card}>
              <InputField
                label="First Name"
                value={values.firstName}
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                error={touched.firstName ? errors.firstName : undefined}
              />

              <InputField
                label="Last Name"
                value={values.lastName}
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                error={touched.lastName ? errors.lastName : undefined}
              />

              <InputField
                label="Employee ID"
                value={values.employeeId}
                onChangeText={handleChange("employeeId")}
                onBlur={handleBlur("employeeId")}
                error={touched.employeeId ? errors.employeeId : undefined}
              />

              <InputField
                label="Email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={touched.email ? errors.email : undefined}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputField
                label="Phone (10 digits)"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                error={touched.phone ? errors.phone : undefined}
                keyboardType="phone-pad"
              />

              <InputField
                label="Department"
                value={values.department}
                onChangeText={handleChange("department")}
                onBlur={handleBlur("department")}
                error={touched.department ? errors.department : undefined}
              />

              <InputField
                label="Start Date (YYYY-MM-DD)"
                value={values.startDate}
                onChangeText={handleChange("startDate")}
                onBlur={handleBlur("startDate")}
                error={touched.startDate ? errors.startDate : undefined}
              />

              <Pressable
                onPress={handleSubmit as any}
                disabled={!isValid || submitting}
                style={[
                  styles.button,
                  (!isValid || submitting) && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.buttonText}>
                  {submitting ? "Submitting..." : "Submit"}
                </Text>
              </Pressable>

              <Pressable
                onPress={async () => {
                  try {
                    await signOut(auth);
                  } catch (error) {
                    console.log("Sign out error:", error);
                  }
                }}
              >
                <Text style={styles.link}>Sign Out</Text>
              </Pressable>
            </View>
          )}
        </Formik>

        <View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollViewPadding: {
    padding: 20,
  },
  card: {
  backgroundColor: colors.card,
  borderRadius: 20,
  padding: 20,
  borderWidth: 2,
  borderColor: colors.border,
  },
  link: {
    color: colors.primary,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
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
});