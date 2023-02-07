import { AxiosRequestConfig, AxiosResponse } from "axios";

import StackoverflowAPI from "@/fetch";

interface IPaginationEntity<Item> {
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
  items: Array<Item>;
}

interface IGetTagsDto {
  page: number;
  pagesize: number;
  fromdate?: number;
  todate?: number;
  order: "desc" | "asc";
  /**
   * @description
   * The minimum count.
   */
  min?: number;
  /**
   * @description
   * The maximum count.
   */
  max?: number;
  /**
   * The sorts accepted by this method operate on the following fields of the tag object:
   *
   * popular – count
   * activity – the creation_date of the last question asked with the tag
   * name – name
   * popular is the default sort.
   */
  sort?: "popular" | "activity" | "name";
  /**
   * @description
   * The inname parameter lets a consumer filter down to tags that contain a certain substring.
   * For example, inname=own would return both "download" and "owner" amongst others.
   */
  inname?: string;
}

export interface ITagEntity {
  has_synonyms: boolean;
  is_moderator_only: boolean;
  is_required: boolean;
  count: number;
  name: string;
}

interface IGetQuestionsDto {
  page: number;
  pagesize: number;
  fromdate?: number;
  todate?: number;
  order: "desc" | "asc";
  /**
   * @description
   * The minimum last_activity_date.
   */
  min?: number;
  /**
   * @description
   * The maximum last_activity_date.
   */
  max?: number;
  /**
   * The sorts accepted by this method operate on the following fields of the question object:
   *
   * activity – last_activity_date
   * creation – creation_date
   * votes – score
   * hot – by the formula ordering the hot tab
   * Does not accept min or max
   * week – by the formula ordering the week tab
   * Does not accept min or max
   * month – by the formula ordering the month tab
   * Does not accept min or max
   * activity is the default sort.
   */
  sort?: "activity" | "votes" | "creation" | "hot" | "week" | "month";
  /**
   * To constrain questions returned to those with a set of tags,
   * use the tagged parameter with a semi-colon delimited list of tags.
   *
   * This is an and constraint,
   * passing tagged=c;java will return only those questions with both tags.
   * As such, passing more than 5 tags will always return zero results.
   */
  tagged?: string;
}

export interface IQuestionEntity {
  tags: Array<string>;
  owner: IQuestionOwnerEntity;
  is_answered: boolean;
  view_count: number;
  accepted_answer_id: number;
  answer_count: number;
  score: number;
  last_activity_date: number;
  creation_date: number;
  last_edit_date: number;
  question_id: number;
  content_license: string;
  link: string;
  title: string;
}

interface IQuestionOwnerEntity {
  account_id: number;
  reputation: number;
  user_id: number;
  user_type: string;
  profile_image: string;
  display_name: string;
  link: string;
}

function axiosDataDestructor<D = any>(
  axiosResponse: Promise<AxiosResponse<D>>
): Promise<D> {
  return axiosResponse.then((response) => response.data);
}

class Stackoverflow {
  private apiInstance = StackoverflowAPI;
  public questions = {
    getMany: (dto: IGetQuestionsDto, config?: AxiosRequestConfig) =>
      axiosDataDestructor(
        this.apiInstance.get<IPaginationEntity<IQuestionEntity>>(
          "/2.3/questions",
          {
            params: {
              ...dto,
              key: process.env.STACKOVERFLOW_KEY,
              site: "stackoverflow",
            },
            ...config,
          }
        )
      ),
  };
  public tags = {
    getMany: (dto: IGetTagsDto) =>
      axiosDataDestructor(
        this.apiInstance.get<IPaginationEntity<ITagEntity>>("/2.3/tags", {
          params: {
            ...dto,
            key: process.env.STACKOVERFLOW_KEY,
            site: "stackoverflow",
          },
        })
      ),
  };
}

const stackoverflow = new Stackoverflow();
export default stackoverflow;
