const LOCAL_STORAGE_KEY = "sessions";

const MAX_SAVED_SESSIONS_COUNT = 3;

const SESSION_STORAGE_KEY = {
  ACCESS_TOKEN: "accessToken",
};

export type Session = {
  fullName: string;
};

class SessionManager {
  saveSession(session: Session) {
    this.set(
      [session, ...this.getSavedSessions()].slice(0, MAX_SAVED_SESSIONS_COUNT),
    );
  }

  getSavedSessions(): Session[] {
    return this.get();
  }

  startSession(accessToken: string) {
    sessionStorage.setItem("accessToken", accessToken);
  }

  moveSavedSessionToTop(index: number) {
    const sessions = this.getSavedSessions();
    const [session] = sessions.splice(index, 1);
    const updated = [session, ...sessions];
    this.set(updated);
  }

  stopSession() {
    sessionStorage.removeItem("token");
  }

  getAccessToken() {
    return sessionStorage.getItem(SESSION_STORAGE_KEY.ACCESS_TOKEN) || null;
  }

  private get(): Session[] {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  }

  private set(sessions: Session[]) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  }
}

export const sessionManager = new SessionManager();
