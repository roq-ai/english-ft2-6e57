import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createTextAnalysis } from 'apiSdk/text-analyses';
import { Error } from 'components/error';
import { textAnalysisValidationSchema } from 'validationSchema/text-analyses';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { TextAnalysisInterface } from 'interfaces/text-analysis';

function TextAnalysisCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TextAnalysisInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTextAnalysis(values);
      resetForm();
      router.push('/text-analyses');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TextAnalysisInterface>({
    initialValues: {
      text: '',
      analysis: '',
      improvement_tips: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: textAnalysisValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Text Analysis
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="text" mb="4" isInvalid={!!formik.errors?.text}>
            <FormLabel>Text</FormLabel>
            <Input type="text" name="text" value={formik.values?.text} onChange={formik.handleChange} />
            {formik.errors.text && <FormErrorMessage>{formik.errors?.text}</FormErrorMessage>}
          </FormControl>
          <FormControl id="analysis" mb="4" isInvalid={!!formik.errors?.analysis}>
            <FormLabel>Analysis</FormLabel>
            <Input type="text" name="analysis" value={formik.values?.analysis} onChange={formik.handleChange} />
            {formik.errors.analysis && <FormErrorMessage>{formik.errors?.analysis}</FormErrorMessage>}
          </FormControl>
          <FormControl id="improvement_tips" mb="4" isInvalid={!!formik.errors?.improvement_tips}>
            <FormLabel>Improvement Tips</FormLabel>
            <Input
              type="text"
              name="improvement_tips"
              value={formik.values?.improvement_tips}
              onChange={formik.handleChange}
            />
            {formik.errors.improvement_tips && <FormErrorMessage>{formik.errors?.improvement_tips}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'text_analysis',
    operation: AccessOperationEnum.CREATE,
  }),
)(TextAnalysisCreatePage);
