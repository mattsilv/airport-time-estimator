class RateLimiter {
  constructor(timeWindowMinutes = 1, maxRequests = 1) {
    this.timeWindowMinutes = timeWindowMinutes;
    this.maxRequests = maxRequests;
    this.requests = [];
    this.totalRequestsCount = 0; // For debug purposes
  }

  canMakeRequest() {
    const now = Date.now();
    const timeWindow = this.timeWindowMinutes * 60 * 1000;

    // Clean up old requests
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < timeWindow
    );

    // Check if we can make a new request
    return this.requests.length < this.maxRequests;
  }

  recordRequest() {
    this.requests.push(Date.now());
    this.totalRequestsCount++;
  }

  getTimeUntilNextRequest() {
    if (this.requests.length === 0) return 0;

    const oldestRequest = this.requests[0];
    const timeWindow = this.timeWindowMinutes * 60 * 1000;
    const waitTime = oldestRequest + timeWindow - Date.now();

    return Math.max(0, Math.ceil(waitTime / 1000));
  }

  getTotalRequests() {
    return this.totalRequestsCount;
  }
}

// Create a singleton instance
export const tomtomRateLimiter = new RateLimiter(1, 1); // 1 request per minute
