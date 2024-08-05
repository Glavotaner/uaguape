export type DeepLinkType = {
  url: string;
  parse: Record<string, unknown>;
  link: (...args: unknown[]) => string;
};
