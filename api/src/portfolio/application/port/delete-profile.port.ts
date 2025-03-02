export interface DeleteProfilePort {
  deleteProfile(id: string): Promise<void>;
}
