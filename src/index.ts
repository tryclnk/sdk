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
import { QRCodeOptions } from "./types";

export class ClnkSDK {
  private client: GraphQLClient;
  private accessToken?: string;
  private rateLimitQueue: Promise<any> = Promise.resolve();
  private rateLimit = {
    maxRequests: 10, // Example limit
    timeWindow: 60 * 1000, // 60 seconds
    requestCount: 0,
    resetTime: Date.now() + 60 * 1000,
  };

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

  // Helper method to handle GraphQL errors
  private handleGraphQLError(error: any): never {
    // Extract useful information from GraphQL errors
    if (error?.errors?.length) {
      const firstError = error.errors[0];

      // Transform common errors into more specific ones
      if (firstError.message.includes("Authentication")) {
        throw new Error(
          "Authentication failed: Please check your credentials or API key",
        );
      }

      if (firstError.message.includes("Not authorized")) {
        throw new Error(
          "Authorization failed: You do not have permission to perform this action",
        );
      }

      // Return the original error message if it's not a known type
      throw new Error(`API Error: ${firstError.message}`);
    }

    // If it's not a GraphQL error, just rethrow
    throw error;
  }

  private async executeWithRateLimit<T>(fn: () => Promise<T>): Promise<T> {
    // Reset counter if we're past the reset time
    if (Date.now() > this.rateLimit.resetTime) {
      this.rateLimit.requestCount = 0;
      this.rateLimit.resetTime = Date.now() + this.rateLimit.timeWindow;
    }

    // Check if we're at the limit
    if (this.rateLimit.requestCount >= this.rateLimit.maxRequests) {
      const waitTime = this.rateLimit.resetTime - Date.now();
      if (waitTime > 0) {
        // Wait until the rate limit resets
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        // Reset after waiting
        this.rateLimit.requestCount = 0;
        this.rateLimit.resetTime = Date.now() + this.rateLimit.timeWindow;
      }
    }

    // Use a queue to ensure requests are processed in order
    return (this.rateLimitQueue = this.rateLimitQueue
      .then(async () => {
        this.rateLimit.requestCount++;
        return fn();
      })
      .catch((error) => {
        // If we get a rate limit error, wait and retry once
        if (error?.message?.includes("rate limit")) {
          return new Promise<T>((resolve) =>
            setTimeout(() => resolve(fn()), 1000),
          );
        }
        throw error;
      }));
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

    try {
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
    } catch (error) {
      return this.handleGraphQLError(error);
    }
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

    try {
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
    } catch (error) {
      return this.handleGraphQLError(error);
    }
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
    return this.executeWithRateLimit(async () => {
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

      try {
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
      } catch (error) {
        return this.handleGraphQLError(error);
      }
    });
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
  generateQRCodeUrl(shortUrl: string, options: QRCodeOptions = {}): string {
    const { size = 300, color, backgroundColor, format = "png" } = options;

    // Base URL
    let url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(shortUrl)}`;

    // Add options if provided
    if (color) {
      url += `&color=${encodeURIComponent(color.replace("#", ""))}`;
    }

    if (backgroundColor) {
      url += `&bgcolor=${encodeURIComponent(backgroundColor.replace("#", ""))}`;
    }

    if (format) {
      url += `&format=${format}`;
    }

    return url;
  }
}

// Export types
export * from "./types/gql";
