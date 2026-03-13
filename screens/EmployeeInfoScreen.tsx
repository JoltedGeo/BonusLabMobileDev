import { Formik } from "formik";
import React, { useState } from "react";
import {
    Button,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import * as Yup from "yup";
import InputField from "../components/InputField";

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
      <ScrollView keyboardShouldPersistTaps="handled">
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

            try {
              console.log("Submitted employee info:", values);

              await new Promise((resolve) => setTimeout(resolve, 800));

              resetForm();
            } finally {
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
            <View>
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

              <Button
                title={submitting ? "Submitting..." : "Submit"}
                onPress={handleSubmit as any}
                disabled={!isValid || submitting}
              />
            </View>
          )}
        </Formik>

        <View>
          <Pressable onPress={() => navigation.navigate("SignIn")}>
            <Text>Back to Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
