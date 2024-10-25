export interface SsoRepository {
    authWithSsoProvider(): Promise<void>;
    get(): Promise<void>;
    create(): Promise<void>;
    ssoAuthCallback(): Promise<void>;
}
