import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TextAnalysisInterface {
  id?: string;
  text: string;
  analysis: string;
  improvement_tips: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface TextAnalysisGetQueryInterface extends GetQueryInterface {
  id?: string;
  text?: string;
  analysis?: string;
  improvement_tips?: string;
  user_id?: string;
}
