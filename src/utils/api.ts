const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Form APIs
  async getForms(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/forms?${searchParams}`);
  }

  async getForm(id: string) {
    return this.request(`/forms/${id}`);
  }

  async createForm(formData: any) {
    return this.request('/forms', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async updateForm(id: string, formData: any) {
    return this.request(`/forms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
  }

  async deleteForm(id: string) {
    return this.request(`/forms/${id}`, {
      method: 'DELETE',
    });
  }

  async duplicateForm(id: string) {
    return this.request(`/forms/${id}/duplicate`, {
      method: 'POST',
    });
  }

  async getFormAnalytics(id: string) {
    return this.request(`/forms/${id}/analytics`);
  }

  // Submission APIs
  async getSubmissions(formId: string, params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/submissions/form/${formId}?${searchParams}`);
  }

  async submitForm(formId: string, data: any) {
    return this.request(`/submissions/${formId}`, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  async getSubmission(id: string) {
    return this.request(`/submissions/${id}`);
  }

  async deleteSubmission(id: string) {
    return this.request(`/submissions/${id}`, {
      method: 'DELETE',
    });
  }

  async exportSubmissions(formId: string) {
    const response = await this.request(`/submissions/form/${formId}/export`);
    return response; // This will be a blob/response object
  }
}

export const apiClient = new ApiClient();