export interface GetCharactersQuery {
  accountName: string;
  realm: string;
}

export interface GetPassiveSkillsQuery {
  accountName: string;
  character: string;
  realm: string;
}
