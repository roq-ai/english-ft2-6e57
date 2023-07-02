import * as yup from 'yup';

export const textAnalysisValidationSchema = yup.object().shape({
  text: yup.string().required(),
  analysis: yup.string().required(),
  improvement_tips: yup.string().required(),
  user_id: yup.string().nullable(),
});
