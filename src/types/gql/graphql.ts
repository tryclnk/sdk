/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ApiKey = {
  __typename?: 'ApiKey';
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<User>;
};

export type AuthData = {
  __typename?: 'AuthData';
  accessToken?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type CreateUrlInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  shortUrl?: InputMaybe<Scalars['String']['input']>;
  shorten?: InputMaybe<Scalars['Boolean']['input']>;
  url: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Meta = {
  __typename?: 'Meta';
  limit?: Maybe<Scalars['Int']['output']>;
  page?: Maybe<Scalars['Int']['output']>;
  pages?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createRole?: Maybe<Role>;
  createUrl?: Maybe<Url>;
  deleteRole?: Maybe<Role>;
  deleteUrl?: Maybe<Scalars['Boolean']['output']>;
  deleteUser?: Maybe<User>;
  generateApiKey?: Maybe<ApiKey>;
  googleAuth?: Maybe<AuthData>;
  login?: Maybe<AuthData>;
  refreshToken: RefreshPayload;
  register?: Maybe<RegisterData>;
  revokeApiKey?: Maybe<ApiKey>;
  sendOTP?: Maybe<Scalars['String']['output']>;
  updateUrl?: Maybe<Url>;
  updateUser?: Maybe<User>;
  verifyOTP?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationCreateRoleArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateUrlArgs = {
  input: CreateUrlInput;
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUrlArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGoogleAuthArgs = {
  code: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRefreshTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRevokeApiKeyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSendOtpArgs = {
  input: SendOtpInput;
};


export type MutationUpdateUrlArgs = {
  input: UpdateUrlInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationVerifyOtpArgs = {
  input: VerifyOtpInput;
};

export type Otp = {
  __typename?: 'OTP';
  createdAt?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  otp?: Maybe<Scalars['String']['output']>;
};

export type Pagination = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  apiKey?: Maybe<ApiKey>;
  apiKeys?: Maybe<Array<Maybe<ApiKey>>>;
  getAllUrls?: Maybe<UrlData>;
  getUrl?: Maybe<Url>;
  getUrls?: Maybe<UrlData>;
  me?: Maybe<User>;
  otp?: Maybe<Otp>;
  otps?: Maybe<Array<Maybe<Otp>>>;
  roles?: Maybe<Array<Maybe<Role>>>;
  user?: Maybe<User>;
  users?: Maybe<UserData>;
};


export type QueryApiKeyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetAllUrlsArgs = {
  filter?: InputMaybe<UrlFilter>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryGetUrlArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetUrlsArgs = {
  filter?: InputMaybe<UrlFilter>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryOtpArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  pagination?: InputMaybe<Pagination>;
};

export type RefreshPayload = {
  __typename?: 'RefreshPayload';
  accessToken: Scalars['String']['output'];
};

export type RegisterData = {
  __typename?: 'RegisterData';
  user?: Maybe<User>;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type SendOtpInput = {
  email: Scalars['String']['input'];
};

export type UpdateUrlInput = {
  id: Scalars['ID']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  shortUrl?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Url = {
  __typename?: 'Url';
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  shortUrl: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type UrlData = {
  __typename?: 'UrlData';
  data?: Maybe<Array<Maybe<Url>>>;
  meta?: Maybe<Meta>;
};

export type UrlFilter = {
  code?: InputMaybe<Scalars['String']['input']>;
  shortUrl?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['ID']['input']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  emailVerified?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<Role>>>;
};

export type UserData = {
  __typename?: 'UserData';
  data?: Maybe<Array<Maybe<User>>>;
  meta?: Maybe<Meta>;
};

export type VerifyOtpInput = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};
