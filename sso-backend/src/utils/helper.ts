interface getEmailActivatedParams {
  email: string;
  notificationEmail?: string;
  activatedEmail?: string;
}

interface getPhoneNumberActivatedParams {
  notificationPhoneNumber?: string;
  activatedPhone?: string;
}

const getEmailActivated = ({ email, notificationEmail, activatedEmail } : getEmailActivatedParams) => {
  if (!activatedEmail) return null;
  if (activatedEmail === 'email') return email;
  if (activatedEmail === 'notificationEmail') return notificationEmail;
  return null;
};

const getPhoneNumberActivated = ({ notificationPhoneNumber, activatedPhone } : getPhoneNumberActivatedParams) => {
  if (!activatedPhone) return null;
  if (activatedPhone === 'notificationPhoneNumber') return notificationPhoneNumber;
  return null;
};

export {
  getEmailActivated,
  getPhoneNumberActivated,
};
