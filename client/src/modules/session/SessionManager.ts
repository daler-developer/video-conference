const LOCAL_STORAGE_KEY = "sessions";

const MAX_SAVED_SESSIONS_COUNT = 3;

export type Session = {
  fullName: string;
};

class SessionManager {
  saveSession(session: Session) {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(
        [session, ...this.getSavedSessions()].slice(
          0,
          MAX_SAVED_SESSIONS_COUNT,
        ),
      ),
    );
  }

  getSavedSessions(): Session[] {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  }

  startSession(accessToken: string) {
    sessionStorage.setItem("accessToken", accessToken);
  }

  stopSession() {
    sessionStorage.removeItem("token");
  }
}

export const sessionManager = new SessionManager();
