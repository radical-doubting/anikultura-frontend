export class User {
  name: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  contactNumber?: string;
  profile: UserProfile;
}

export class UserProfile {
  isTutorialDone: boolean;
  gender: string;
  birthday: string;
  affiliatedOrganization: string;
  tesdaTrainingJoined: string;
  joinedAt: string;
}
