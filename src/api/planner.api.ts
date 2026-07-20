import { PlannerFormData, PlanResult } from '../types/planner.types';
import { authSession } from '../auth/auth-session';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export const plannerApi = {
  generatePlan: async (data: PlannerFormData): Promise<PlanResult> => {
    const token = authSession.getAccessToken();

    let res: Response;
    try {
      res = await fetch(`${BASE_URL}/planner/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
    } catch (err: any) {
      throw new Error(`Network error: ${err.message}`);
    }

    let body: any;
    try {
      body = await res.json();
    } catch (err) {
      throw new Error(`Failed to parse response from server. Status: ${res.status}`);
    }

    if (!res.ok) {
      const msg = Array.isArray(body?.message)
        ? body.message.join(' ')
        : body?.message ?? `Request failed with status ${res.status}`;
      throw new Error(msg);
    }

    // The NestJS backend has a global interceptor that wraps the response.
    // The controller returns { message, data: plan }
    // The interceptor wraps it in { success: true, data: <CONTROLLER_RESPONSE>, timestamp }
    // Therefore, the plan is at body.data.data
    
    let plan: PlanResult | undefined;
    
    if (body?.data?.data) {
      plan = body.data.data;
    } else if (body?.data?.allocations) {
      plan = body.data;
    } else if (body?.allocations) {
      plan = body;
    }

    if (!plan?.id || !plan?.allocations) {
      console.error('[plannerApi V3] Unexpected response shape:', JSON.stringify(body));
      throw new Error('V3 ERROR: Plan data or allocations are missing. See browser console for details.');
    }

    return plan;
  },
};



