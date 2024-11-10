interface TrackingEvent {
  eventName: string;
  properties?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

class TrackingService {
  private static instance: TrackingService;
  private isProduction = process.env.NODE_ENV === 'production';
  private sessionId: string;
  private userId?: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): TrackingService {
    if (!TrackingService.instance) {
      TrackingService.instance = new TrackingService();
    }
    return TrackingService.instance;
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  private formatEvent(eventName: string, properties?: Record<string, unknown>): TrackingEvent {
    return {
      eventName,
      properties,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId
    };
  }

  track(eventName: string, properties?: Record<string, unknown>): void {
    const event = this.formatEvent(eventName, properties);

    console.log('Tracking Event:', event);
  }

  pageView(pageName: string, properties?: Record<string, unknown>): void {
    this.track('page_view', {
      page_name: pageName,
      ...properties
    });
  }

  userAction(actionName: string, properties?: Record<string, unknown>): void {
    this.track('user_action', {
      action_name: actionName,
      ...properties
    });
  }

  error(errorName: string, properties?: Record<string, unknown>): void {
    this.track('error', {
      error_name: errorName,
      ...properties
    });
  }
}

export const tracking = TrackingService.getInstance();
