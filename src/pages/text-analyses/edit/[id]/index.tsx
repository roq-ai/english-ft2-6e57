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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getTextAnalysisById, updateTextAnalysisById } from 'apiSdk/text-analyses';
import { Error } from 'components/error';
import { textAnalysisValidationSchema } from 'validationSchema/text-analyses';
import { TextAnalysisInterface } from 'interfaces/text-analysis';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function TextAnalysisEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TextAnalysisInterface>(
    () => (id ? `/text-analyses/${id}` : null),
    () => getTextAnalysisById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: TextAnalysisInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateTextAnalysisById(id, values);
      mutate(updated);
      resetForm();
      router.push('/text-analyses');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<TextAnalysisInterface>({
    initialValues: data,
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
            Edit Text Analysis
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(TextAnalysisEditPage);
