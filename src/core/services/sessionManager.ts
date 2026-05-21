let signOutHandler: null | (() => Promise<void> | void) = null;
let signOutInProgress = false;

export const setSessionSignOutHandler = (handler: (() => Promise<void> | void) | null) => {
  signOutHandler = handler;
};

export const triggerSessionExpired = async () => {
  if (!signOutHandler || signOutInProgress) return;

  signOutInProgress = true;
  try {
    await signOutHandler();
  } finally {
    signOutInProgress = false;
  }
};
