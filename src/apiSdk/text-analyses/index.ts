import axios from 'axios';
import queryString from 'query-string';
import { TextAnalysisInterface, TextAnalysisGetQueryInterface } from 'interfaces/text-analysis';
import { GetQueryInterface } from '../../interfaces';

export const getTextAnalyses = async (query?: TextAnalysisGetQueryInterface) => {
  const response = await axios.get(`/api/text-analyses${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTextAnalysis = async (textAnalysis: TextAnalysisInterface) => {
  const response = await axios.post('/api/text-analyses', textAnalysis);
  return response.data;
};

export const updateTextAnalysisById = async (id: string, textAnalysis: TextAnalysisInterface) => {
  const response = await axios.put(`/api/text-analyses/${id}`, textAnalysis);
  return response.data;
};

export const getTextAnalysisById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/text-analyses/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTextAnalysisById = async (id: string) => {
  const response = await axios.delete(`/api/text-analyses/${id}`);
  return response.data;
};
