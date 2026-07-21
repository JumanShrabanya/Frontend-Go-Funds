import api from './axios.instance';
import { PlannerFormData, PlanResult } from '../types/planner.types';

export const plannerApi = {
  generatePlan: async (data: PlannerFormData): Promise<PlanResult> => {
    const response = await api.post('/planner/generate', data);
    
    // Axios already parses JSON. The body is in response.data.
    const body = response.data;
    
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
      console.error('[plannerApi] Unexpected response shape:', JSON.stringify(body));
      throw new Error('Plan data or allocations are missing. Please try again.');
    }

    return plan;
  },
};



