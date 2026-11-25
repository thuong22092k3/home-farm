export type CustomerSession = {
  accessToken: string;
  user: { id: string; name: string; role: string };
};
