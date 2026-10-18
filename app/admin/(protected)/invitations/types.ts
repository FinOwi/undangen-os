export interface ThemeOption {
  slug: string;
  name: string;
  kind: "engine" | "static";
}

export interface InvitationInitial {
  id: string;
  slug: string;
  theme: string;
  status: string;
  content: Record<string, any>;
}
