import { GraphQLClient } from "@untools/gql-client";
import type {
  CreateUrlInput,
  Url,
  UpdateUrlInput,
  UrlData,
  UrlFilter,
  AuthData,
  LoginInput,
  RegisterInput,
  RegisterData,
  RefreshPayload,
  User,
  ApiKey,
  Pagination,
} from "./types/gql/graphql";

export class ClnkSDK {
  private client: GraphQLClient;
  private accessToken?: string;

  constructor(config: {
    apiUrl?: string;
    apiKey?: string;
    accessToken?: string;
  }) {
    this.client = new GraphQLClient({
      apiUrl: config.apiUrl || "https://clnk-api.m10.live/graphql",
      apiKey: config.apiKey,
    });
    this.accessToken = config.accessToken;
  }

  // Helper method to get headers with auth token
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }
    return headers;
  }

  // Set access token
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  // Authentication methods
  async login(input: LoginInput): Promise<AuthData> {
    const LOGIN_MUTATION = `#graphql
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          accessToken
          refreshToken
          user {
            id
            name
            email
            emailVerified
          }
        }
      }
    `;

    const executeGQL = this.client.executeGraphQL();
    const response = await executeGQL<
      { login: AuthData },
      { input: LoginInput }
    >({
      query: LOGIN_MUTATION,
      variables: { input },
      headers: this.getHeaders(),
    });

    if (response.login?.accessToken) {
      this.setAccessToken(response.login.accessToken);
    }

    return response.login;
  }

  async register(input: RegisterInput): Promise<RegisterData> {
    const REGISTER_MUTATION = `#graphql
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          user {
            id
            name
            email
            emailVerified
          }
        }
      }
    `;

    const executeGQL = this.client.executeGraphQL();
    const response = await executeGQL<
      { register: RegisterData },
      { input: RegisterInput }
    >({
      query: REGISTER_MUTATION,
      variables: { input },
      headers: this.getHeaders(),
    });

    return response.register;
  }

  async refreshToken(token: string): Promise<RefreshPayload> {
    const REFRESH_TOKEN_MUTATION = `#graphql
      mutation RefreshToken($token: String!) {
        refreshToken(token: $token) {
          accessToken
        }
      }
    `;

    const executeGQL = this.client.executeGraphQL();
    const response = await executeGQL<
      { refreshToken: RefreshPayload },
      { token: string }
    >({
      query: REFRESH_TOKEN_MUTATION,
      variables: { token },
      headers: this.getHeaders(),
    });

    if (response.refreshToken?.accessToken) {
      this.setAccessToken(response.refreshToken.accessToken);
    }

    return response.refreshToken;
  }

  async generateApiKey(): Promise<ApiKey> {
    const GENERATE_API_KEY_MUTATION = `#graphql
      mutation GenerateApiKey {
        generateApiKey {
          id
          key
          createdAt
        }
      }
    `;

    const executeGQL = this.client.executeGraphQL();
    const response = await executeGQL<{ generateApiKey: ApiKey }, {}>({
      query: GENERATE_API_KEY_MUTATION,
      variables: {},
      headers: this.getHeaders(),
    });

    return response.generateApiKey;
  }

  // URL shortening methods
  async createUrl(input: CreateUrlInput): Promise<Url> {
    const CREATE_URL_MUTATION = `#graphql
      mutation CreateUrl($input: CreateUrlInput!) {
        createUrl(input: $input) {
          id
          url
          shortUrl
          code
          image
          createdAt
          updatedAt
        }
      }
    `;

    const executeGQL = this.client.executeGraphQL();
    const response = await executeGQL<
      { createUrl: Url },
      { input: CreateUrlInput }
    >({
      query: CREATE_URL_MUTATION,
      variables: { input },
      headers: this.getHeaders(),
    });

    return response.createUrl;
  }

  async updateUrl(input: UpdateUrlInput): Promise<Url> {
    const UPDATE_URL_MUTATION = `#graphql
      mutation UpdateUrl($input: UpdateUrlInput!) {
        updateUrl(input: $input) {
          id
          url
          shortUrl
          code
          image
          createdAt
          updatedAt
        }
      }
    `;

    const executeGQL = this.client.executeGraphQL();
    const response = await executeGQL<
      { updateUrl: Url },
      { input: UpdateUrlInput }
    >({
      query: UPDATE_URL_MUTATION,
      variables: { input },
      headers: this.getHeaders(),
    });

    return response.updateUrl;
  }

  async deleteUrl(id: string): Promise<boolean> {
    const DELETE_URL_MUTATION = `#graphql
      mutation DeleteUrl($id: ID!) {
        deleteUrl(id: $id)
      }
    `;

    const executeGQL = this.client.executeGraphQL();
    const response = await executeGQL<{ deleteUrl: boolean }, { id: string }>({
      query: DELETE_URL_MUTATION,
      variables: { id },
      headers: this.getHeaders(),
    });

    return response.deleteUrl;
  }

  async getUrl(options: { id?: string; code?: string }): Promise<Url> {
    const GET_URL_QUERY = `#graphql
      query GetUrl($id: ID, $code: String) {
        getUrl(id: $id, code: $code) {
          id
          url
          shortUrl
          code
          image
          createdAt
          updatedAt
          user {
            id
            name
          }
        }
      }
    `;

    const executeGQL = this.client.executeGraphQL();
    const response = await executeGQL<
      { getUrl: Url },
      { id?: string; code?: string }
    >({
      query: GET_URL_QUERY,
      variables: options,
      headers: this.getHeaders(),
    });

    return response.getUrl;
  }

  async getUrls(options?: {
    filter?: UrlFilter;
    pagination?: Pagination;
  }): Promise<UrlData> {
    const GET_URLS_QUERY = `#graphql
      query GetUrls($filter: UrlFilter, $pagination: Pagination) {
        getUrls(filter: $filter, pagination: $pagination) {
          data {
            id
            url
            shortUrl
            code
            image
            createdAt
            updatedAt
          }
          meta {
            total
            page
            pages
            limit
          }
        }
      }
    `;

    const executeGQL = this.client.executeGraphQL();
    const response = await executeGQL<
      { getUrls: UrlData },
      { filter?: UrlFilter; pagination?: Pagination }
    >({
      query: GET_URLS_QUERY,
      variables: options || {},
      headers: this.getHeaders(),
    });

    return response.getUrls;
  }

  async getAllUrls(options?: {
    filter?: UrlFilter;
    pagination?: Pagination;
  }): Promise<UrlData> {
    const GET_ALL_URLS_QUERY = `#graphql
      query GetAllUrls($filter: UrlFilter, $pagination: Pagination) {
        getAllUrls(filter: $filter, pagination: $pagination) {
          data {
            id
            url
            shortUrl
            code
            image
            createdAt
            updatedAt
          }
          meta {
            total
            page
            pages
            limit
          }
        }
      }
    `;

    const executeGQL = this.client.executeGraphQL();
    const response = await executeGQL<
      { getAllUrls: UrlData },
      { filter?: UrlFilter; pagination?: Pagination }
    >({
      query: GET_ALL_URLS_QUERY,
      variables: options || {},
      headers: this.getHeaders(),
    });

    return response.getAllUrls;
  }

  // User methods
  async getCurrentUser(): Promise<User> {
    const ME_QUERY = `#graphql
      query Me {
        me {
          id
          name
          email
          emailVerified
          roles {
            id
            name
          }
        }
      }
    `;

    const executeGQL = this.client.executeGraphQL();
    const response = await executeGQL<{ me: User }, {}>({
      query: ME_QUERY,
      variables: {},
      headers: this.getHeaders(),
    });

    return response.me;
  }

  // QR code generation utility
  generateQRCodeUrl(shortUrl: string, size: number = 300): string {
    // Using a free QR code API service
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(shortUrl)}`;
  }
}

// Export types
export * from "./types/gql";
